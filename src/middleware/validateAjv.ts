import { ajv } from "../lib/ajv";
import { Request, Response, NextFunction } from "express";
import type { AnySchema } from "ajv";
import { sendError } from "../utils/respond";
import { AppError } from "../types/error.type";

type Targets = { body?: AnySchema; query?: AnySchema; params?: AnySchema };

export function validateAjv(schemas: Targets) {
  // compile once
  const compiled = Object.fromEntries(
    Object.entries(schemas).map(([k, schema]) => [k, schema ? ajv.compile(schema) : null])
  ) as Record<keyof Targets, ReturnType<typeof ajv.compile> | null>;

  return (req: Request, res: Response, next: NextFunction) => {
    for (const target of ["params", "query", "body"] as const) {
      const v = compiled[target];
      if (!v) continue;
      const data = (req as any)[target];
      const ok = v(data);
      if (!ok) {
        throw AppError.from("VALIDATION_ERROR", { target, errors: v.errors });
      }
      // Ajv may coerce / apply defaults — keep the coerced data
      (req as any)[target] = data;
    }
    next();
  };
}