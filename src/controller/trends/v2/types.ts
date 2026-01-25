import { Piller, RankGroupEnum } from "../../../types";
import { ServeCalls, ServeFeatureMetrics } from "../../../types/serve.type";

export interface GetTrendsTopPlayersParams {
  piller: Piller;
  rank_group: RankGroupEnum;
  serve_call: ServeCalls;
  feature: ServeFeatureMetrics
}