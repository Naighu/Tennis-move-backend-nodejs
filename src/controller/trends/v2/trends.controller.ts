import { Request, Response } from "express";

import { AppError } from "../../../types/error.type";
import { sendOk } from "../../../utils/respond";
import {  RankGroupEnum } from "../../../types";
import { ServeFeatureMetrics, ServeCalls } from "../../../types/serve.type";
import { RosFeatureMetrics, RosReturnShotTypes } from "../../../types/ros.type";
import { EndrangeFeatureMetrics } from "../../../types/endrange.type";

export async function getServeSelectors(req: Request, res: Response) {
  try {
    const selectors:Record<string, any> = {
        "rank_groups": Object.values(RankGroupEnum),
        "serve_calls": Object.values(ServeCalls),
        "features" :  Object.values(ServeFeatureMetrics),
    }
   return sendOk(res, selectors);

  } catch (err: any) {
    throw new AppError("INTERNAL", err, undefined);
  }
}

export async function getRosSelectors(req: Request, res: Response) {
  try {
    const selectors:Record<string, any> = {
        "rank_groups": Object.values(RankGroupEnum),
        "return_shot_types": Object.values(RosReturnShotTypes),
        "features" :  Object.values(RosFeatureMetrics),
    }
   return sendOk(res, selectors);

  } catch (err: any) {
    throw new AppError("INTERNAL", err, undefined);
  }
}

export async function getEndrangeSelectors(req: Request, res: Response) {
  try {
    const selectors:Record<string, any> = {
        "rank_groups": Object.values(RankGroupEnum),
        "features" :  Object.values(EndrangeFeatureMetrics),
    }
   return sendOk(res, selectors);

  } catch (err: any) {
    throw new AppError("INTERNAL", err, undefined);
  }
}

