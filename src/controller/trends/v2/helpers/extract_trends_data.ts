import { getObjectStream, streamToString } from "../../../../services/s3";
import { AWSKey, Piller, RankGroupEnum } from "../../../../types";
import { expandServeCall } from "../../../../types/serve.type";
import { GetTrendsEndrangeTopPlayersParams, GetTrendsRosTopPlayersParams, GetTrendsServeTopPlayersParams } from "../types";

export async function fetchTrendsData(piller: Piller): Promise<Record<string, any>[]> {
  // This function would fetch the match list from s3 bucket

  console.log(`Fetching ${piller}.json`);
  
  const data = await getObjectStream(AWSKey.TennisMoveBucket, `api_output/${piller}.json`)
  const jsonString = await streamToString(data.stream);
  const dataObject = JSON.parse(jsonString);
  return dataObject['data'];
} 


export async function fetchTrendsDataByFeatureAndRank(piller: Piller, rank_group: RankGroupEnum, feature: string): Promise<Record<string, any>[]> {
  const data = await fetchTrendsData(piller);
  const filtered =  data.filter(item => item[`avg_${feature}`] !== undefined && item.rank_group === rank_group)
  return filtered;
}

export function getTrendsSelectorCondition(item: Record<string, any>, piller: Piller, body: GetTrendsServeTopPlayersParams
      | GetTrendsRosTopPlayersParams
      | GetTrendsEndrangeTopPlayersParams) {
      switch (piller) {
        case Piller.SERVE:
          const [serve_call, serve] = expandServeCall((body as GetTrendsServeTopPlayersParams).serve_call)[0];
          return item.rank_group === body.rank_group &&
        item.serve_call === serve_call &&
        item.serve === serve
        case Piller.RETURN_OF_SERVE:
          return item.rank_group === body.rank_group &&
        item.return_shot_type === (body as GetTrendsRosTopPlayersParams).return_shot_type
        case Piller.END_RANGE:
          return item.rank_group === body.rank_group
        default:
          throw new Error("Invalid piller value");
      }
}