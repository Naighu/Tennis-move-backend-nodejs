import { SchemaObject } from "ajv";
import { populationEnum } from "../../../types";




export const competitionGetAtheletesBodySchema: SchemaObject = {
    type: "object",
    additionalProperties: false,
    required: ["year", "pop"],
    properties: {

        year: { type: "integer", minimum: 1900, maximum: 2100 },
        pop: { type: "string", enum: populationEnum },

    }
} as const;





export const competitionGetMatchIdsBodySchema: SchemaObject = {
    type: "object",
    additionalProperties: false,
    required: ["year", "pop", "player_id","piller"],
    properties: {

        year: { type: "integer", minimum: 1900, maximum: 2100 },
        pop: { type: "string", enum: populationEnum },
        player_id: { type: "string" },
        piller: { type: "string" },

    }
} as const;

export const competitionGetTableDataBodySchema: SchemaObject = {
    type: "object",
    additionalProperties: false,
    required: ["sort_key", "reference_match_id"],
    properties: {

        sort_key: { type: "string" },
        reference_match_id: { type: "string" },

    }
} as const;

export const competitionGetSelectedVideosBodySchema: SchemaObject = {
    type: "object",
    additionalProperties: false,
    required: ["video_key","reference_match_id","piller"],
    properties: {
        video_key: { type: "string" },
        reference_match_id: { type: "string" },
        piller: { type: "string" },
    }
} as const;