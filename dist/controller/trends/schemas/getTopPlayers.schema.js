"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrendsTopPlayersBodySchema = exports.RANKING_BRACKETS = exports.FEATURES = exports.FILTERS = exports.TABLES = void 0;
const types_1 = require("../../../types");
exports.TABLES = {
    competition_serves: "competition_serves",
};
exports.FILTERS = {
    serve_speed_kph_filt: "serve_speed_kph_filt",
    game_id: "game_id",
    set_number: "set_number",
    row_id: "row_id",
};
exports.FEATURES = {
    fast_arm_ms: "t.results->>'fast_arm_ms'",
    serve_speed: "t.serve_speed",
};
exports.RANKING_BRACKETS = {
    "Top 10": [1, 10],
    "Top 50": [11, 50],
    "Top 100": [51, 100],
    "Top 250": [101, 250],
    "250+": [251, 5000],
    "All": [1, 5000]
};
const tableEnum = Object.keys(exports.TABLES);
const filterEnum = Object.keys(exports.FILTERS);
const featureEnum = Object.keys(exports.FEATURES);
const rankingBracketEnum = Object.keys(exports.RANKING_BRACKETS);
exports.TrendsTopPlayersBodySchema = {
    type: "object",
    additionalProperties: false,
    required: ["table", "year", "feature", "filter_feature", "lower_value", "upper_value", "pop"],
    properties: {
        table: { type: "string", enum: tableEnum },
        year: { type: "integer", minimum: 1900, maximum: 2100 },
        feature: { type: "string", enum: featureEnum },
        filter_feature: { type: "string", enum: filterEnum },
        lower_value: { type: "number" },
        upper_value: { type: "number" },
        pop: { type: "string", enum: types_1.populationEnum },
        ranking_bracket: { type: "string", default: "All", enum: rankingBracketEnum },
    }
};
