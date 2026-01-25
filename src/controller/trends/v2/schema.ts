import { SchemaObject } from "ajv";
import { ServeCalls, ServeFeatureMetrics } from "../../../types/serve.type";
import {  RankGroupEnum } from "../../../types";

export const GetTrendsTopPlayersSchema: SchemaObject = {
    type: "object",
    additionalProperties: false,
    required: ["rank_group", "serve_call", "feature"],
    properties: {

        rank_group: { type: "string", enum: Object.values(RankGroupEnum) },
        serve_call: { type: "string", enum: Object.values(ServeCalls) },
        feature: { type: "string", enum: Object.values(ServeFeatureMetrics) },

    }
} as const; 