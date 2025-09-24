"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAjv = validateAjv;
const ajv_1 = require("../lib/ajv");
const error_type_1 = require("../types/error.type");
function validateAjv(schemas) {
    // compile once
    const compiled = Object.fromEntries(Object.entries(schemas).map(([k, schema]) => [k, schema ? ajv_1.ajv.compile(schema) : null]));
    return (req, res, next) => {
        for (const target of ["params", "query", "body"]) {
            const v = compiled[target];
            if (!v)
                continue;
            const data = req[target];
            const ok = v(data);
            if (!ok) {
                throw error_type_1.AppError.from("VALIDATION_ERROR", { target, errors: v.errors });
            }
            // Ajv may coerce / apply defaults — keep the coerced data
            req[target] = data;
        }
        next();
    };
}
