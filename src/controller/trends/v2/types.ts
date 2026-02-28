import { RankGroupEnum } from "../../../types";
import { EndrangeFeatureMetrics } from "../../../types/endrange.type";
import { RosFeatureMetrics, RosReturnShotTypes } from "../../../types/ros.type";
import { ServeCalls, ServeFeatureMetrics } from "../../../types/serve.type";

/* ---------------------------------- */
/* Shared                             */
/* ---------------------------------- */

type TrendsFeature =
  | ServeFeatureMetrics
  | RosFeatureMetrics
  | EndrangeFeatureMetrics;

interface PlayerScoped {
  player_id: string;
}

/* ---------------------------------- */
/* Overview                           */
/* ---------------------------------- */

export interface GetTrendsOverviewParams {
  feature: TrendsFeature;
}

/* ---------------------------------- */
/* Top Players                        */
/* ---------------------------------- */

export interface GetTrendsTopPlayersBaseParams {
  rank_group: RankGroupEnum;
  feature: TrendsFeature;
}

export interface GetTrendsServeTopPlayersParams
  extends GetTrendsTopPlayersBaseParams {
  serve_call: ServeCalls;
}

export interface GetTrendsRosTopPlayersParams
  extends GetTrendsTopPlayersBaseParams {
  return_shot_type: RosReturnShotTypes;
}

export interface GetTrendsEndrangeTopPlayersParams
  extends GetTrendsTopPlayersBaseParams {
}

/* ---------------------------------- */
/* Player Stats                       */
/* ---------------------------------- */

export type GetTrendsServePlayerStatParams =
  GetTrendsServeTopPlayersParams & PlayerScoped;

export type GetTrendsRosPlayerStatParams =
  GetTrendsRosTopPlayersParams & PlayerScoped;

export type GetTrendsEndrangePlayerStatParams =
  GetTrendsTopPlayersBaseParams & PlayerScoped;
