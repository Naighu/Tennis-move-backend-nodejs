import { getObjectStream, streamToString } from "../../../../services/s3";
import { AWSKey, getPopulationKeyFromValue, PopulationCategory } from "../../../../types";


type MatchList = {
  [population: string]: {
    [athleteName: string]: Player;
  };
};


type SelectorValue = {
  code: string;
  label: string;
};

type OutputData = {
  [year: string]: {
    [tournament: string]: SelectorValue[]
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




export async function fetchMatchList(): Promise<MatchList> {
  // This function would fetch the match list from s3 bucket
  const match_list = await getObjectStream(AWSKey.TennisMoveBucket, 'web-assets/selectors/match_list.json')
  const jsonString = await streamToString(match_list.stream);
  const matchListObject = JSON.parse(jsonString);
  return matchListObject;
}


export function extractSelectors(data: MatchList): OutputData {
  const result: OutputData = {};

  for (const category of Object.keys(data)) {
    const players = data[category];
    
    const formats = Object.values(PopulationCategory).includes(category as PopulationCategory)
      ? [getPopulationKeyFromValue(category)]
      : null;
    if (!formats) continue;

    for (const player of Object.values(players) as Player[]) {
      const details = player.details;

      for (const year of Object.keys(details)) {
  result[year] ??= {};

  const tournaments = details[year];

  for (const tournament of Object.keys(tournaments)) {
    result[year][tournament] ??= [];

    const matchIds = Object.values(tournaments[tournament]) as string[];

   

    for (const format of formats) {
      const pop = {
          code: format!,
          label: PopulationCategory[format as keyof typeof PopulationCategory],
        }
      if (!result[year][tournament].find(v => v['code'] === pop.code)) {
        result[year][tournament].push(pop);
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




export function extractAthletes(
  data: MatchList,
  year: string,
  tournamentName: string,
  population: string
): AthleteResult[] {
  const result: AthleteResult[] = [];

  const populationKey = PopulationCategory[population as keyof typeof PopulationCategory];
  if (!populationKey) return result;

  const players = data[populationKey];
  if (!players) return result;

  const seen = new Set<string>();

  for (const [fullName, player] of Object.entries(players)) {
    
    const yearData = player.details[year];
    
    if (!yearData) continue;

    if (yearData[tournamentName] && !seen.has(player.player_id)) {
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
  playerId: string,

  population: string
): Record<string, any> {
  const result: Record<string, any> = {};
  const populationKey = PopulationCategory[population as keyof typeof PopulationCategory];
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