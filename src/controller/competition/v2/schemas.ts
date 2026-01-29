import { SchemaObject } from "ajv";
import { CameraAngles, PopulationCategory } from "../../../types";




export const competitionGetAtheletesBodySchema: SchemaObject = {
    type: "object",
    additionalProperties: false,
    required: [ "pop"],
    properties: {
        pop: { type: "string", enum: Object.values(PopulationCategory) },
    }
} as const;

export const competitionGetMatchPrimaryKeyBodySchema: SchemaObject = {
    type: "object",
    additionalProperties: false,
    required: [ "pop", "player_name"],
    properties: {
        pop: { type: "string", enum: Object.values(PopulationCategory) },
        player_name: { type: "string" },
    }
} as const;


export const competitionGetTableDataBodySchema: SchemaObject = {
    type: "object",
    additionalProperties: false,
    required: ["primary_key"],
    properties: {
        primary_key: { type: "string" },
    }
} as const;

export const competitionGetAvailableCameraAnglesBodySchema: SchemaObject = {
    type: "object",
    additionalProperties: false,
    required: ["primary_key"],
    properties: {
        primary_key: { type: "string" },
    }
} as const;

export const competitionGetSelectedVideosBodySchema: SchemaObject = {
    type: "object",
    additionalProperties: false,
    required: ["video_key","primary_key","camera_angle"],
    properties: {
        video_key: { type: "string" },
        primary_key: { type: "string" },
        camera_angle: { type: "string", enum: Object.values(CameraAngles).map(angle => angle.angle) },
    }
} as const;