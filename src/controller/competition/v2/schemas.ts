import { SchemaObject } from "ajv";
import { CameraAngle, populationEnum } from "../../../types";




export const competitionGetAtheletesBodySchema: SchemaObject = {
    type: "object",
    additionalProperties: false,
    required: ["year", "pop"],
    properties: {

        year: { type: "integer", minimum: 1900, maximum: 2100 },
        pop: { type: "string", enum: populationEnum },

    }
} as const;

export const competitionGetMatchPrimaryKeyBodySchema: SchemaObject = {
    type: "object",
    additionalProperties: false,
    required: ["year", "pop", "player_id","tid"],
    properties: {

        year: { type: "integer", minimum: 1900, maximum: 2100 },
        pop: { type: "string", enum: populationEnum },
        tid: { type: "integer" },
        player_id: { type: "string" },
    }
} as const;

export const competitionGetTableDataBodySchema: SchemaObject = {
    type: "object",
    additionalProperties: false,
    required: ["primary_key", "piller"],
    properties: {
        primary_key: { type: "string" },
        piller: { type: "string" },
    }
} as const;

export const competitionGetSelectedVideosBodySchema: SchemaObject = {
    type: "object",
    additionalProperties: false,
    required: ["video_key","primary_key","camera_angle"],
    properties: {
        video_key: { type: "string" },
        primary_key: { type: "string" },
        camera_angle: { type: "string", enum: Object.values(CameraAngle) },
    }
} as const;