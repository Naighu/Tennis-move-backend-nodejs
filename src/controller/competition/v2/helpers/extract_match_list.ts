import { getObjectStream, streamToString } from "../../../../services/s3";
import { AWSKey } from "../../../../types";


type MatchList = {
  [population: string]: {
    [athleteName: string]: Player;
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




export async function fetchMatchList(): Promise<MatchList> {
  // This function would fetch the match list from s3 bucket
  const match_list = await getObjectStream(AWSKey.TennisMoveBucket, 'web-assets/selectors/match_list.json')
  const jsonString = await streamToString(match_list.stream);
  const matchListObject = JSON.parse(jsonString);
  return matchListObject;
}