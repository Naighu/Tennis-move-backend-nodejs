import { SchemaObject } from "ajv";
import { populationEnum } from "../../types";
import { FEATURES, FILTERS, RANKING_BRACKETS, TABLES } from "./types";




const tableEnum   = Object.keys(TABLES);
const filterEnum  = Object.keys(FILTERS);
const featureEnum = Object.keys(FEATURES);
const rankingBracketEnum = Object.keys(RANKING_BRACKETS);

export const TrendsTopPlayersBodySchema : SchemaObject= {
  type: "object",
  additionalProperties: false,
  required: ["table","year","feature","filter_feature","lower_value","upper_value","pop"],
  properties: {
    table:          { type: "string", enum: tableEnum },
    year:           { type: "integer", minimum: 1900, maximum: 2100 },
    feature:        { type: "string", enum: featureEnum },
    filter_feature: { type: "string", enum: filterEnum },
    lower_value:    { type: "number" },
    upper_value:    { type: "number" },
    pop:            { type: "string", enum: populationEnum },
    ranking_bracket:{ type: "string", default: "All", enum: rankingBracketEnum },
  }
} as const;


export const TrendsGetVideoBodySchema: SchemaObject = {
    type: "object",
    additionalProperties: false,
    required: ["selected_row", "source", "camera"],
    properties: {

        selected_row: { type: "string" },
        source: { type: "string" },
        camera: { type: "string" },

    }
} as const;