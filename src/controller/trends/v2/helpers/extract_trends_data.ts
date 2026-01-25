import { getObjectStream, streamToString } from "../../../../services/s3";
import { AWSKey, Piller } from "../../../../types";
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