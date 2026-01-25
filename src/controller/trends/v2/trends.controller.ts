import { Request, Response } from "express";

import { AppError } from "../../../types/error.type";
import { sendOk } from "../../../utils/respond";
import { Piller, RankGroupEnum } from "../../../types";
import { ServeFeatureMetrics, ServeCalls } from "../../../types/serve.type";
import { RosFeatureMetrics, RosReturnShotTypes } from "../../../types/ros.type";
import { EndrangeFeatureMetrics } from "../../../types/endrange.type";
import { fetchTrendsData, getTrendsSelectorCondition } from "./helpers/extract_trends_data";
import { GetTrendsEndrangeTopPlayersParams, GetTrendsRosTopPlayersParams, GetTrendsServeTopPlayersParams, GetTrendsTopPlayersBaseParams } from "./types";

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


export async function getTopPlayers(req: Request, res: Response) {
  try {
    const piller = req.path.split("/").pop() as Piller;
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
    console.log(err);

    throw new AppError("INTERNAL", err, undefined);
  }
}