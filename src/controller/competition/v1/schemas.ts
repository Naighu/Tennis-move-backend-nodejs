import { SchemaObject } from "ajv";
import { PopulationCategory } from "../../../types";




export const competitionGetAtheletesBodySchema: SchemaObject = {
    type: "object",
    additionalProperties: false,
    required: ["year", "pop"],
    properties: {

        year: { type: "integer", minimum: 1900, maximum: 2100 },
        pop: { type: "string", enum: Object.keys(PopulationCategory) },

    }
} as const;





export const competitionGetMatchIdsBodySchema: SchemaObject = {
    type: "object",
    additionalProperties: false,
    required: ["year", "pop", "player_id"],
    properties: {

        year: { type: "integer", minimum: 1900, maximum: 2100 },
        pop: { type: "string", enum:  Object.keys(PopulationCategory) },
        player_id: { type: "string" },

    }
} as const;

export const competitionGetTableDataBodySchema: SchemaObject = {
    type: "object",
    additionalProperties: false,
    required: ["table", "reference_match_id", "player_id"],
    properties: {

        table: { type: "string" },
        reference_match_id: { type: "string" },
        player_id: { type: "string" },

    }
} as const;

export const competitionGetSelectedVideosBodySchema: SchemaObject = {
    type: "object",
    additionalProperties: false,
    required: ["match", "source", "camera","selected_row"],
    properties: {

        match: { type: "string" },
        source: { type: "string" },
        camera: { type: "string" },
        selected_row: { type: "string" },


    }
} as const;