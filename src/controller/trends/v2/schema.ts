import { SchemaObject } from "ajv";
import { ServeCalls, ServeFeatureMetrics } from "../../../types/serve.type";
import {  RankGroupEnum } from "../../../types";
import { RosFeatureMetrics, RosReturnShotTypes } from "../../../types/ros.type";
import { EndrangeFeatureMetrics } from "../../../types/endrange.type";

export const GetTrendsServeOverviewSchema: SchemaObject = {
    type: "object",
    additionalProperties: false,
    required: ["feature"],
    properties: {

        feature: { type: "string", enum: Object.values(ServeFeatureMetrics) },

    }
} as const; 


export const GetTrendsRosOverviewSchema: SchemaObject = {
    type: "object",
    additionalProperties: false,
    required: ["feature"],
    properties: {

        feature: { type: "string", enum: Object.values(RosFeatureMetrics) },

    }
} as const; 


export const GetTrendsEndrangeOverviewSchema: SchemaObject = {
    type: "object",
    additionalProperties: false,
    required: ["feature"],
    properties: {

        feature: { type: "string", enum: Object.values(EndrangeFeatureMetrics) },

    }
} as const; 


export const GetTrendsServeTopPlayersSchema: SchemaObject = {
    type: "object",
    additionalProperties: false,
    required: ["rank_group", "serve_call", "feature"],
    properties: {

        rank_group: { type: "string", enum: Object.values(RankGroupEnum) },
        serve_call: { type: "string", enum: Object.values(ServeCalls) },
        feature: { type: "string", enum: Object.values(ServeFeatureMetrics) },

    }
} as const; 

export const GetTrendsEndrangeTopPlayersSchema: SchemaObject = {
    type: "object",
    additionalProperties: false,
    required: ["rank_group", "feature"],
    properties: {

        rank_group: { type: "string", enum: Object.values(RankGroupEnum) },
        feature: { type: "string", enum: Object.values(EndrangeFeatureMetrics) },

    }
} as const; 


export const GetTrendsRosTopPlayersSchema: SchemaObject = {
    type: "object",
    additionalProperties: false,
    required: ["rank_group", "return_shot_type", "feature"],
    properties: {

        rank_group: { type: "string", enum: Object.values(RankGroupEnum) },
        return_shot_type: { type: "string", enum: Object.values(RosReturnShotTypes) },
        feature: { type: "string", enum: Object.values(RosFeatureMetrics) },

    }
} as const; 