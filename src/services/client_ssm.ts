import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { log } from "console";
import jwt, { JwtHeader, JwtPayload } from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";
import { AppError } from "../types/error.type";

let jwksCache: any | null = null;

const USER_POOL_REGION = process.env.USER_POOL_REGION;
const JWKS_SSM_PARAMETER_NAME = process.env.JWKS_SSM_PARAMETER_NAME;

export async function getJwks(): Promise<any> {
  if (jwksCache) {
    return jwksCache;
  }
  const rawJson = process.env.JWKS_SSM_KEY;
  if (!rawJson) throw new Error("JWKS_SSM_KEY is not set");
  jwksCache = JSON.parse(rawJson)
  return jwksCache;
  // if (!USER_POOL_REGION) {
  //   throw new Error("USER_POOL_REGION environment variable not set.");
  // }

  // if (!JWKS_SSM_PARAMETER_NAME) {
  //   throw new Error("JWKS_SSM_PARAMETER_NAME environment variable not set.");
  // }

  // try {
  //   const ssmClient = new SSMClient({
  //     region: USER_POOL_REGION,
  //   });

  //   const command = new GetParameterCommand({
  //     Name: JWKS_SSM_PARAMETER_NAME,
  //     WithDecryption: true,
  //   });

  //   const response = await ssmClient.send(command);

  //   if (!response.Parameter?.Value) {
  //     throw new Error("SSM parameter value is empty.");
  //   }

  //   jwksCache = JSON.parse(response.Parameter.Value);
  //   console.log("Successfully fetched and cached JWKS.");

  //   return jwksCache;
  // } catch (err) {
  //   console.error("Error fetching JWKS from SSM:", err);
  //   throw new Error("Could not fetch JWKS for token validation from internal store");
  // }
}




export async function verifyJwt(token: string): Promise<JwtPayload> {
  const decoded = jwt.decode(token, { complete: true });

  if (!decoded || typeof decoded === "string") {
    throw new AppError("VALIDATION_ERROR", "Invalid JWT");
  }

  const { kid } = decoded.header as JwtHeader;

  const jwks = await getJwks();
  const key = jwks.keys.find((k: any) => k.kid === kid);

  if (!key) {
    throw new AppError("VALIDATION_ERROR", "Invalid JWT");
  }
  
  if (key.kid != kid) {
    throw new AppError("VALIDATION_ERROR", "Invalid JWT");
  }

  const pem = jwkToPem(key);

  return jwt.verify(token, pem, {
    algorithms: ["RS256"],
  }) as JwtPayload;
}
