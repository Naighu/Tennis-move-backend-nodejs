import { randomUUID } from "crypto";
import { Request, Response, NextFunction } from "express";

export function requestContext(req: Request, res: Response, next: NextFunction) {
  res.locals.requestId = (req.headers["x-request-id"] as string) || randomUUID();
  next();
}
