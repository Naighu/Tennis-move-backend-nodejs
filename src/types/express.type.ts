import { JwtPayload } from "jsonwebtoken";
import { Piller } from ".";

declare global {
  namespace Express {
    interface Request {
      piller?: Piller,
      user?: {
        sub: string;
        email: string;
        raw?: JwtPayload;
      };
    }
  }
}
