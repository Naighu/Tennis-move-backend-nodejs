import {  RankGroupEnum } from "../../../types";
import { EndrangeFeatureMetrics } from "../../../types/endrange.type";
import { RosFeatureMetrics, RosReturnShotTypes } from "../../../types/ros.type";
import { ServeCalls, ServeFeatureMetrics } from "../../../types/serve.type";


export interface GetTrendsOverviewParams {
  feature: ServeFeatureMetrics | RosFeatureMetrics | EndrangeFeatureMetrics;
}
export interface GetTrendsTopPlayersBaseParams {
  rank_group: RankGroupEnum;
  feature: ServeFeatureMetrics | RosFeatureMetrics | EndrangeFeatureMetrics;
}

export interface GetTrendsServeTopPlayersParams extends GetTrendsTopPlayersBaseParams {
  serve_call: ServeCalls;
}

export interface GetTrendsEndrangeTopPlayersParams extends GetTrendsTopPlayersBaseParams {
 
}

export interface GetTrendsRosTopPlayersParams extends GetTrendsTopPlayersBaseParams {
  return_shot_type: RosReturnShotTypes;
}