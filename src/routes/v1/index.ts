import { Router, Request, Response, NextFunction } from "express";
import trends from "./trends.routes";
import competition from "./competition.routes";

import { sendOk } from "../../utils/respond";

const v1 = Router();

//tag responses with API version
v1.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.apiVersion = "v1";
  next();
});

// simple ping for this version
v1.get("/status", (_req, res) => sendOk(res,{ version: "v1"}));

// mount feature routers
v1.use("/trends", trends);   // /api/v1/trends
v1.use("/competition", competition);   // /api/v1/competition


export default v1;
