import { Request, Response } from "express";
import { AppError } from "../../../types/error.type";
import { sendOk } from "../../../utils/respond";
import { Piller, RankGroupEnum } from "../../../types";
import { ServeFeatureMetrics, ServeCalls } from "../../../types/serve.type";
import { RosFeatureMetrics, RosReturnShotTypes } from "../../../types/ros.type";
import { EndrangeFeatureMetrics } from "../../../types/endrange.type";
import { fetchTrendsData, formatTrendsData, getTrendsSelectorCondition, Row } from "./helpers/extract_trends_data";
import { GetTrendsEndrangeTopPlayersParams, GetTrendsRosTopPlayersParams, GetTrendsServeTopPlayersParams, GetTrendsOverviewParams, GetTrendsServePlayerStatParams, GetTrendsRosPlayerStatParams, GetTrendsEndrangePlayerStatParams } from "./types";
import { computeCV, computeWeightedMean, groupByPlayerId, mergeByPlayer } from "./helpers/compute";

export async function getServeSelectors(req: Request, res: Response) {
  try {
    const selectors: Record<string, any> = {
      "rank_groups": Object.values(RankGroupEnum),
      "serve_calls": Object.values(ServeCalls),
      "features": Object.values(ServeFeatureMetrics),
    }
    return sendOk(res, selectors);

  } catch (err: any) {
    throw new AppError("INTERNAL", err, undefined);
  }
}

export async function getRosSelectors(req: Request, res: Response) {
  try {
    const selectors: Record<string, any> = {
      "rank_groups": Object.values(RankGroupEnum),
      "return_shot_types": Object.values(RosReturnShotTypes),
      "features": Object.values(RosFeatureMetrics),
    }
    return sendOk(res, selectors);

  } catch (err: any) {
    throw new AppError("INTERNAL", err, undefined);
  }
}

export async function getEndrangeSelectors(req: Request, res: Response) {
  try {
    const selectors: Record<string, any> = {
      "rank_groups": Object.values(RankGroupEnum),
      "features": Object.values(EndrangeFeatureMetrics),
    }
    return sendOk(res, selectors);

  } catch (err: any) {
    throw new AppError("INTERNAL", err, undefined);
  }
}


export async function getTrendsOverview(req: Request, res: Response) {
  try {


    const piller = req.piller!

    let body = req.query as unknown as GetTrendsOverviewParams;

    let data = await fetchTrendsData(piller);
    data = formatTrendsData(data, body.feature)
    const grouped = data.reduce((acc, row) => {
      if (!acc[row.rank_group]) acc[row.rank_group] = [];
      acc[row.rank_group].push(row);
      return acc;
    }, {});

    const trendsByRank: Record<string, any> = {};

    for (const [rankGroup, value] of Object.entries(grouped)) {

      trendsByRank[rankGroup] = computeCV(value);
    }
    return sendOk(res, trendsByRank);
  } catch (err: any) {
    console.log(err);

    if (err instanceof AppError) {
      throw err;
    } else {
      throw new AppError("INTERNAL", err, undefined);
    }
  }
}

export async function getTopPlayers(req: Request, res: Response) {
  try {
    const piller = req.piller!
    let body = req.query as unknown as GetTrendsServeTopPlayersParams
      | GetTrendsRosTopPlayersParams
      | GetTrendsEndrangeTopPlayersParams;



    const data = await fetchTrendsData(piller);
      let filteredData = data
        .filter((row) => getTrendsSelectorCondition(row, piller, body))

    filteredData = formatTrendsData(filteredData, body.feature) 

    const merged = mergeByPlayer(filteredData as Row[]).sort((a, b) => (b[`avg_feature`] || 0) - (a[`avg_feature`] || 0)).slice(0, 10);
    return sendOk(res, merged);
  } catch (err: any) {
    if (err instanceof AppError) {
      throw err;
    } else {
      throw new AppError("INTERNAL", err, undefined);
    }
  }
}

export async function getPlayerTrendsStat(req: Request, res: Response) {
  try {
    const piller = req.piller!

    let body = req.query as unknown as GetTrendsServePlayerStatParams
      | GetTrendsRosPlayerStatParams
      | GetTrendsEndrangePlayerStatParams;



    const data = await fetchTrendsData(piller);
    let filteredData = data
      .filter((row) => getTrendsSelectorCondition(row, piller, body))

    filteredData = formatTrendsData(filteredData, body.feature)

    const grouped = groupByPlayerId(filteredData as Row[])
    return sendOk(res, grouped);
  } catch (err: any) {
    if (err instanceof AppError) {
      throw err;
    } else {
      throw new AppError("INTERNAL", err, undefined);
    }
  }
}