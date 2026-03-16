import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/respond";
import { AppError } from "../types/error.type";
import jwt, { JwtHeader, SigningKeyCallback } from "jsonwebtoken";

import jwksClient from "jwks-rsa";


// Replace with your Cognito domain
const COGNITO_DOMAIN =  process.env.COGNITO_DOMAIN

// JWKS client
const client = jwksClient({
  jwksUri: `${COGNITO_DOMAIN}/.well-known/jwks.json`,
});

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      next(new AppError("AUTH_REQUIRED", "Missing Authorization header", undefined));
      return;
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(
      token,
      getKey,
      {
        algorithms: ["RS256"],
        issuer: COGNITO_DOMAIN,
      },
      (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid token" });
        (req as any).user = decoded; // attach decoded payload to request
        next();
      }
    );




  } catch (err: any) {
    if (err instanceof AppError) {
      next(err);
    } else {
      next(new AppError("AUTH_REQUIRED", err, undefined));
    }
  }
}



// Get the public signing key
function getKey(header: JwtHeader, callback: SigningKeyCallback) {
  if (!header.kid) {
    return callback(new Error("No KID in token header"));
  }

  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    const signingKey = key!.getPublicKey();
    callback(null, signingKey);
  });
}

