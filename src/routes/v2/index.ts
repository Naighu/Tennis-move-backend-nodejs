import { Router, Request, Response, NextFunction } from "express";
import competition from "./competition.routes";

import { sendOk } from "../../utils/respond";

const v2 = Router();

//tag responses with API version
v2.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.apiVersion = "v2";
  next();
});

// simple ping for this version
v2.get("/status", (_req, res) => sendOk(res,{ version: "v2"}));

// mount feature routers
// v2.use("/trends", trends);   // /api/v2/trends
v2.use("/competition", competition);   // /api/v2/competition

export default v2;
