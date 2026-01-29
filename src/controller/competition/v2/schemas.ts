import { SchemaObject } from "ajv";
import { CameraAngles, PopulationCategory } from "../../../types";




export const competitionGetAtheletesBodySchema: SchemaObject = {
    type: "object",
    additionalProperties: false,
    required: ["year", "pop", "tournament_name"],
    properties: {

        year: { type: "integer", minimum: 1900, maximum: 2100 },
        pop: { type: "string", enum: Object.keys(PopulationCategory)  },
        tournament_name: { type: "string" },
    }
} as const;

export const competitionGetMatchPrimaryKeyBodySchema: SchemaObject = {
    type: "object",
    additionalProperties: false,
    required: ["year", "pop", "player_id"],
    properties: {

        year: { type: "integer", minimum: 1900, maximum: 2100 },
        pop: { type: "string", enum: Object.keys(PopulationCategory) },
        player_id: { type: "string" },
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