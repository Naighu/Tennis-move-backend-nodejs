import { getObjectStream, streamToString } from "../../../../services/s3";
import { Bucket } from "../../../../types/bucket.type";

type MatchList = {
  [population: string]: {
    [athleteName: string]: Player;
  };
};


type OutputData = {
  [year: string]: {
    [tournamentCode: string]: string[];
  };
};

type Player = {
  player_id: string;
  details: {
    [year: string]: {
      [tournament: string]: {
        [round: string]: string;
      };
    };
  };
};

type AthleteResult = {
  competition_player_id: string;
  athlete_name: string;
};


const CATEGORY_MAP: Record<string, string[]> = {
  "Men's Singles": ["BS", "MS"],
  "Women's Singles": ["GS", "WS"],
};

export async function fetchMatchList(): Promise<MatchList> {
  // This function would fetch the match list from s3 bucket
  const match_list = await getObjectStream(Bucket.TennisMoveResources, 'web-assets/selectors/match_list.json')
  const jsonString = await streamToString(match_list.stream);
  const matchListObject = JSON.parse(jsonString);
  return matchListObject;
}


export function extractSelectors(data: MatchList): OutputData {
  const result: OutputData = {};

  for (const category of Object.keys(data)) {
    const players = data[category];
    const formats = CATEGORY_MAP[category];

    if (!formats) continue;

    for (const player of Object.values(players) as Player[]) {
      const details = player.details;

      for (const year of Object.keys(details)) {
        result[year] ??= {};

        const tournaments = details[year];

        for (const tournament of Object.values(tournaments)) {
          for (const matchId of Object.values(tournament) as string[]) {
            // Example: 2025_580_MS301
            const [, tournamentCode] = matchId.split("_");

            result[year][tournamentCode] ??= [];

            for (const format of formats) {
              if (!result[year][tournamentCode].includes(format)) {
                result[year][tournamentCode].push(format);
              }
            }
          }
        }
      }
    }
  }

  return result;
}


const formatAthleteName = (fullName: string): string => {
  // "Matteo Berrettini (ITA)" → "M. Berrettini"
  const namePart = fullName.split("(")[0].trim();
  const [firstName, lastName] = namePart.split(" ");
  return `${firstName[0]}. ${lastName}`;
};

// Helper function to get population key from CATEGORY_MAP
const getPopulationKey = (population: string): string | undefined => {
  return Object.keys(CATEGORY_MAP).find((key) =>
    CATEGORY_MAP[key].includes(population)
  );
};


export function extractAthletes(
  data: MatchList,
  year: string,
  tournamentId: string,
  population: string
): AthleteResult[] {
  const result: AthleteResult[] = [];

  const populationKey = getPopulationKey(population);
  if (!populationKey) return result;

  const players = data[populationKey];
  if (!players) return result;

  const seen = new Set<string>();
console.log(`YEAR: ${year} tid: ${tournamentId}`);

  for (const [fullName, player] of Object.entries(players)) {
    
    const yearData = player.details[year];
    
    if (!yearData) continue;

    console.log(`Full name ${fullName} player = ${player}`);

    let participated = false;

    for (const tournament of Object.values(yearData)) {
      for (const matchId of Object.values(tournament)) {
        // Example: 2025_580_MS301
        const [, tId] = matchId.split("_");

        if (tId === tournamentId) {
          participated = true;
          break;
        }
      }
      if (participated) break;
    }

    if (participated && !seen.has(player.player_id)) {
      seen.add(player.player_id);
      result.push({
        competition_player_id: player.player_id,
        athlete_name: formatAthleteName(fullName),
      });
    }
  }

  return result;
}


export function extractMatchIds(
  data: MatchList,
  year: string,
  tournamentId: string,
  playerId: string,

  population: string
): Record<string, any> {
  const result: Record<string, any> = {};
  const populationKey = getPopulationKey(population);
  if (!populationKey) return result;

  const players = data[populationKey];
  if (!players) return result;

  for (const player of Object.values(players) as Player[]) {
    if (player.player_id == playerId && player.details[year]) {
      Object.assign(result, player.details[year]);
    }
  }
  return result

}