import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/respond";
import { verifyJwt } from "../services/client_ssm";
import { AppError } from "../types/error.type";


export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, 401, "401", "Missing Authorization header");
    }

    const token = authHeader.split(" ")[1];
    const payload = await verifyJwt(token);

    const access_token_sub = payload.sub;
    const user_email = payload.email;

    if (!access_token_sub || !user_email) {
      return sendError(res, 401, "401", "Invalid token: missing subject or email");
    }

    req.user = {
      sub: access_token_sub,
      email: user_email,
      raw: payload,
    };

    next();
  } catch (err: any) {
    if (err instanceof AppError) {
      next(err);
    } else {
      next(new AppError("INTERNAL", err, undefined));
    }
  }
}
