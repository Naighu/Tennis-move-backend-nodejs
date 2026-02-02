import { Request, Response } from "express";

import { AppError } from "../../../types/error.type";
import { sendOk } from "../../../utils/respond";
import { Piller, RankGroupEnum } from "../../../types";
import { ServeFeatureMetrics, ServeCalls } from "../../../types/serve.type";
import { RosFeatureMetrics, RosReturnShotTypes } from "../../../types/ros.type";
import { EndrangeFeatureMetrics } from "../../../types/endrange.type";
import { fetchTrendsData, getTrendsSelectorCondition } from "./helpers/extract_trends_data";
import { GetTrendsEndrangeTopPlayersParams, GetTrendsRosTopPlayersParams, GetTrendsServeTopPlayersParams, GetTrendsOverviewParams } from "./types";
import { computeCV } from "./helpers/compute_cv";

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


    const piller = req.path.split("/").filter(Boolean).at(0) as Piller;

    if(piller === undefined) {
      throw new AppError("NOT_FOUND", null, "Piller not specified in the path");
    }
    let body = req.query as unknown as GetTrendsOverviewParams;

    const data = await fetchTrendsData(piller);

    const grouped = data.reduce((acc, row) => {
      if (!acc[row.rank_group]) acc[row.rank_group] = [];
      acc[row.rank_group].push(row);
      return acc;
    }, {});

    const trendsByRank: Record<string, any> = {};

    for (const [rankGroup, value] of Object.entries(grouped)) {
      let rows = (value as any[]).map((r: any) => ({
        rank_group: r.rank_group,
        n: r.n,
        avg_mean: r[`avg_${body.feature}`],
        sd_mean: r[`sd_${body.feature}`]
      }));
      trendsByRank[rankGroup] = computeCV(rows);
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
    const piller = req.path.split("/").filter(Boolean).at(0) as Piller;

    if(piller === undefined) {
      throw new AppError("NOT_FOUND", null, "Piller not specified in the path");
    }
    let body = req.query as unknown as GetTrendsServeTopPlayersParams
      | GetTrendsRosTopPlayersParams
      | GetTrendsEndrangeTopPlayersParams;



    const data = await fetchTrendsData(piller);


    const feature = body.feature;



    const filteredAndSortedData: Record<string, any>[] = [];

    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      // Step 1: Filter
      if (
        getTrendsSelectorCondition(item, piller, body) /// Get the filtering condition based on piller
      ) {
        // Step 2: Sorted Insertion based on avg_feature
        let inserted = false;
        for (let j = 0; j < filteredAndSortedData.length; j++) {
          if (item[`avg_${feature}`] > filteredAndSortedData[j][`avg_${feature}`]) {
            filteredAndSortedData.splice(j, 0, item); // insert at position j
            inserted = true;
            break;
          }
        }
        // If not inserted, push to the end
        if (!inserted) {
          filteredAndSortedData.push(item);
        }
      }
    }





    return sendOk(res, filteredAndSortedData);
  } catch (err: any) {
    if (err instanceof AppError) {
      throw err;
    } else {
      throw new AppError("INTERNAL", err, undefined);
    }
  }
}