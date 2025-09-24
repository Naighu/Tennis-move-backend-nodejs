"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const trends_routes_1 = __importDefault(require("./trends.routes"));
const respond_1 = require("../../utils/respond");
const v1 = (0, express_1.Router)();
//tag responses with API version
v1.use((req, res, next) => {
    res.locals.apiVersion = "v1";
    next();
});
// simple ping for this version
v1.get("/status", (_req, res) => (0, respond_1.sendOk)(res, { version: "v1" }));
// mount feature routers
v1.use("/trends", trends_routes_1.default); // /api/v1/trends
exports.default = v1;
