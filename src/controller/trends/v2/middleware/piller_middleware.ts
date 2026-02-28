import { NextFunction, Request, Response } from "express";
import { Piller } from "../../../../types";
import { AppError } from "../../../../types/error.type";

export async function pillerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try{
    const piller = req.path.split("/").filter(Boolean).at(0) as Piller;

  if (piller === undefined) {
    next(new AppError("NOT_FOUND", null, "Piller not specified in the path"));
  } else {
    req.piller = piller
    next()
  }
  }catch(err:any) {
     if (err instanceof AppError) {
      next(err);
    } else {
      next(new AppError("FORBIDDEN", err, undefined));
    }
  }
}