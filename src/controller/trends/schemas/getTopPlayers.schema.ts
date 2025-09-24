import { SchemaObject } from "ajv";
import { populationEnum } from "../../../types";

export const TABLES = {
  competition_serves: "competition_serves",
} as const;

export const FILTERS = {
  serve_speed_kph_filt: "serve_speed_kph_filt",
  game_id: "game_id",
  set_number: "set_number",
  row_id: "row_id",
} as const;

export const FEATURES = {
  fast_arm_ms: "t.results->>'fast_arm_ms'",
  serve_speed: "t.serve_speed",
} as const;

export const RANKING_BRACKETS = {
    "Top 10": [1, 10],
    "Top 50": [11, 50],
    "Top 100": [51, 100],
    "Top 250": [101, 250],
    "250+": [251, 5000],
    "All": [1, 5000]
} as const;

// Derive TS unions from the maps (no duplication)
type TableKey   = keyof typeof TABLES;   // "competition_serves"
type FilterKey  = keyof typeof FILTERS;  // "serve_speed_kph_filt" | ...
type FeatureKey = keyof typeof FEATURES; // "fast_arm_ms" | "serve_speed"
type RankingBracketKey = keyof typeof RANKING_BRACKETS; // "Top 10" | ...

export interface TrendsTopPlayersBody {
  table: TableKey;
  year: number;
  feature: FeatureKey;
  filter_feature: FilterKey;
  lower_value: number;
  upper_value: number;
  pop: string;
  ranking_bracket?: RankingBracketKey;
}



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
