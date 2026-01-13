import { queryDynamoDb } from "../../../../services/dyanmo_db";

type MatchInfo = {
  reference_match_id: string;
  sort_keys: string[];
};


export async function enrichMatchIds(matchIds: Record<string, Record<string, string>>, piller: string): Promise<Record<string, Record<string, MatchInfo>>> {
  const updatedMatches: Record<string, Record<string, MatchInfo>> = {};

  for (const [tournamentName, rounds] of Object.entries(matchIds)) {
    updatedMatches[tournamentName] = {};

    for (const [round, matchId] of Object.entries(rounds)) {
      // Fetch sort keys for this matchId
      const sortKeys = await getSortKeysForMatch(matchId,piller);

      // Update structure
      updatedMatches[tournamentName][round] = {
        reference_match_id: matchId,
        sort_keys: sortKeys,
      };
    }
  }

  return updatedMatches;
}

// Helper to fetch sort keys for a single match
async function getSortKeysForMatch(matchId: string,piller:string): Promise<string[]> {
  const rows = await queryDynamoDb<{ sort_key: string }>({
    TableName: "tennis-move",
    KeyConditionExpression: "primary_key = :pk AND begins_with(sort_key, :skPrefix)",
    ExpressionAttributeValues: {
      ":pk": matchId,
      ":skPrefix": `competition#${piller}`,
    },
    ProjectionExpression: "sort_key",
  });

  return rows.map(item => item.sort_key);
}

