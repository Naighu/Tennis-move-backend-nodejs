"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestContext = requestContext;
const crypto_1 = require("crypto");
function requestContext(req, res, next) {
    res.locals.requestId = req.headers["x-request-id"] || (0, crypto_1.randomUUID)();
    next();
}
