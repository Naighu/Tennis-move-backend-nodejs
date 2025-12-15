import type { OpenAPIObject } from "openapi3-ts/oas31";

export const openapiSpec: OpenAPIObject = {
  openapi: "3.1.0",
  info: { title: "Tennis Move API", version: "1.0.0" },
  servers: [{ url: "http://localhost:4000" }],
  tags: [
    { name: "Trends", description: "Trends endpoints" },
    { name: "Competition", description: "Competition endpoints" },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: { type: "apiKey", in: "header", name: "X-API-Key" },
    },
    schemas: {
      ApiSuccess: {
        type: "object",
        properties: {
          ok: { type: "boolean", const: true },
          data: {}, // generic
          meta: {
            type: "object",
            properties: {
              timestamp: { type: "string", format: "date-time" },
              requestId: { type: "string" },
            },
          },
        },
        required: ["ok"],
        additionalProperties: true,
      },
      ApiError: {
        type: "object",
        properties: {
          ok: { type: "boolean", const: false },
          error: {
            type: "object",
            properties: {
              code: { type: "string" },
              message: { type: "string" },
              details: {},
            },
            required: ["code", "message"],
          },
          meta: {
            type: "object",
            properties: {
              timestamp: { type: "string", format: "date-time" },
              requestId: { type: "string" },
            },
          },
        },
        required: ["ok", "error"],
        additionalProperties: true,
      },

      // NEW: request schema for win-percentage
      TrendsGetWinPercentageRequest: {
        type: "object",
        additionalProperties: false,
        required: ["player_ids"],
        properties: {
          player_ids: {
            type: "array",
            items: { type: "string" },
            minItems: 1,
            uniqueItems: true,
            example: ["ATPD994", "ATPMM58"],
          },
        },
      },
    },

    parameters: {
      // Shared query params
      YearParam: {
        name: "year",
        in: "query",
        required: true,
        schema: { type: "integer" },
        description: "Season year (e.g., 2025)",
      },
      TournamentIdParam: {
        name: "tid",
        in: "query",
        required: true,
        schema: { type: "integer" },
        description: "Tournament ID",
      },
      PopulationParam: {
        name: "pop",
        in: "query",
        required: true,
        schema: { type: "string", minLength: 1 },
        description: "Population code (e.g., MS, WS)",
      },
      // Trends-specific
      TableParam: {
        name: "table",
        in: "query",
        required: true,
        schema: { type: "string" },
        description: "Source table (e.g., competition_serves)",
      },
      RankingBracketParam: {
        name: "ranking_bracket",
        in: "query",
        required: false,
        schema: { type: "string" },
        description: "Ranking bucket (e.g., Top 10)",
      },
      FeatureParam: {
        name: "feature",
        in: "query",
        required: true,
        schema: { type: "string" },
        description: "Feature/metric name (e.g., fast_arm_ms)",
      },
      FilterFeatureParam: {
        name: "filter_feature",
        in: "query",
        required: false,
        schema: { type: "string" },
        description: "Optional filter feature (e.g., serve_speed_kph_filt)",
      },
      LowerValueParam: {
        name: "lower_value",
        in: "query",
        required: false,
        schema: { type: "number" },
        description: "Lower bound for filter",
      },
      UpperValueParam: {
        name: "upper_value",
        in: "query",
        required: false,
        schema: { type: "number" },
        description: "Upper bound for filter",
      },

      // Competition/video-specific
      AthleteIdParam: {
        name: "player_id",
        in: "query",
        required: false,
        schema: { type: "string" },
        description: "Competition player identifier",
      },
      ReferenceMatchIdParam: {
        name: "reference_match_id",
        in: "query",
        required: false,
        schema: { type: "string" },
        description: "Reference match identifier",
      },
    },
  },

  paths: {
    "/api/v1/trends/selectors": {
      get: {
        tags: ["Trends"],
        summary: "Get selectors for trends",
        security: [{ ApiKeyAuth: [] }],
        responses: {
          "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } },
          "400": { description: "Bad Request", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
        },
      },
    },

    "/api/v1/competition/selectors": {
      get: {
        tags: ["Competition"],
        summary: "Get selectors for competition",
        security: [{ ApiKeyAuth: [] }],
        responses: {
          "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } },
          "400": { description: "Bad Request", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
        },
      },
    },

    "/api/v1/competition/athletes": {
      get: {
        tags: ["Competition"],
        summary: "List athletes by tournament/year/population",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          { $ref: "#/components/parameters/YearParam" },
          { $ref: "#/components/parameters/PopulationParam" },
          { $ref: "#/components/parameters/TournamentIdParam" },

        ],
        responses: {
          "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } },
          "400": { description: "Bad Request", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
        },
      },
    },

    "/api/v1/competition/table-data": {
      get: {
        tags: ["Competition"],
        summary: "Get competition table data (by year/tournament/population/feature)",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          { $ref: "#/components/parameters/TableParam" },
          { $ref: "#/components/parameters/ReferenceMatchIdParam" },
          { $ref: "#/components/parameters/AthleteIdParam" },
        ],
        responses: {
          "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } },
          "400": { description: "Bad Request", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
        },
      },
    },

    "/api/v1/competition/video": {
      get: {
        tags: ["Competition"],
        summary: "Get selected competition videos",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          { name: "match", in: "query", schema: { type: "string" }, required: true },
          { name: "source", in: "query", schema: { type: "string" }, required: true },
          { name: "camera", in: "query", schema: { type: "string" }, required: true },
          { name: "selected_row", in: "query", schema: { type: "string" }, required: true },
        ],
        responses: {
          "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } },
          "400": { description: "Bad Request", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
        },
      },
    },

    "/api/v1/competition/match-id": {
      get: {
        tags: ["Competition"],
        summary: "Get match id",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          { $ref: "#/components/parameters/YearParam" },
          { $ref: "#/components/parameters/PopulationParam" },
          { $ref: "#/components/parameters/AthleteIdParam" },
          { $ref: "#/components/parameters/TournamentIdParam" },

        ],
        responses: {
          "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } },
          "400": { description: "Bad Request", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
        },
      },
    },

    "/api/v1/trends/top-players": {
      get: {
        tags: ["Trends"],
        summary: "Top rows by feature",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          { $ref: "#/components/parameters/TableParam" },
          { $ref: "#/components/parameters/YearParam" },
          { $ref: "#/components/parameters/RankingBracketParam" },
          { $ref: "#/components/parameters/FeatureParam" },
          { $ref: "#/components/parameters/FilterFeatureParam" },
          { $ref: "#/components/parameters/LowerValueParam" },
          { $ref: "#/components/parameters/UpperValueParam" },
          { $ref: "#/components/parameters/PopulationParam" },
        ],
        responses: {
          "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } },
          "400": { description: "Bad Request", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
        },
      },
    },


     "/api/v1/trends/distribution": {
      get: {
        tags: ["Trends"],
        summary: "Top rows by feature",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          { $ref: "#/components/parameters/TableParam" },
          { $ref: "#/components/parameters/YearParam" },
          { $ref: "#/components/parameters/RankingBracketParam" },
          { $ref: "#/components/parameters/FeatureParam" },
          { $ref: "#/components/parameters/FilterFeatureParam" },
          { $ref: "#/components/parameters/LowerValueParam" },
          { $ref: "#/components/parameters/UpperValueParam" },
          { $ref: "#/components/parameters/PopulationParam" },
        ],
        responses: {
          "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } },
          "400": { description: "Bad Request", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
        },
      },
    },

    "/api/v1/trends/video": {
      get: {
        tags: ["Trends"],
        summary: "Get selected competition videos",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          { name: "selected_row", in: "query", schema: { type: "string" }, required: true },
          { name: "source", in: "query", schema: { type: "string" }, required: true },
          { name: "camera", in: "query", schema: { type: "string" }, required: true },
        ],
        responses: {
          "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } },
          "400": { description: "Bad Request", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
        },
      },
    },

    "/api/v1/trends/win-percentage": {
      post: {
        tags: ["Trends"],
        summary: "Get win percentage for a set of players",
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TrendsGetWinPercentageRequest" },
            },
          },
        },
        responses: {
          "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } },
          "400": { description: "Bad Request", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
        },
      },
    },
  },
};
