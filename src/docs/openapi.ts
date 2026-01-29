import type { OpenAPIObject } from "openapi3-ts/oas31";

export const openapiSpec: OpenAPIObject = {
  openapi: "3.1.0",
  info: { 
    title: "Tennis Move API", 
    description: "API for tennis performance analytics, covering individual competition data and circuit trends.",
    version: "1.0.0" 
  },
  servers: [{ url: "http://localhost:4000", description: "Local Development Server" }],
  security: [{ BearerAuth: [] }],
  tags: [
    { name: "Competition V1", description: "Legacy match and athlete endpoints" },
    { name: "Competition V2", description: "Pillar-based (Serve, ROS, Endrange) match analysis" },
    { name: "Trends V1", description: "General circuit-wide statistics and leaderboards" },
    { name: "Trends V2", description: "Specialized pillar-based trend analysis" },
  ],
  
  components: {
    securitySchemes: {
      BearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: {
      ApiSuccess: {
        type: "object",
        properties: {
          ok: { type: "boolean", const: true },
          data: { type: "object", description: "The response payload" },
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
              details: { type: "object" },
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
      // Shared
      YearParam: { name: "year", in: "query", required: true, schema: { type: "integer" }, description: "Season year (e.g., 2025)" },
      PopulationParam: { name: "pop", in: "query", required: true, schema: { type: "string", minLength: 1 }, description: "Population code (e.g., MS, WS)" },
      TournamentIdParam: { name: "tid", in: "query", required: true, schema: { type: "integer" }, description: "Numeric Tournament ID" },
      TournamentNameParam: { name: "tournament_name", in: "query", required: true, schema: { type: "string" }, description: "Full name of the tournament" },
      AthleteIdParam: { name: "player_id", in: "query", required: false, schema: { type: "string" }, description: "Unique player identifier" },
      AthleteNameParam: { name: "player_name", in: "query", required: false, schema: { type: "string" }, description: "Player's full name" },
      PrimaryKeyParam: { name: "primary_key", in: "query", required: false, schema: { type: "string" }, description: "Primary key for the specific match record" },
      
      // Feature Specifics
      TableParam: { name: "table", in: "query", required: true, schema: { type: "string" }, description: "Source database table" },
      FeatureParam: { name: "feature", in: "query", required: true, schema: { type: "string" }, description: "Metric name (e.g., fast_arm_ms)" },
      PillerParam: { name: "piller", in: "path", required: true, schema: { type: "string", enum: ["endrange", "serve", "ros"] }, description: "Specific analysis pillar" },
      RankingBracketParam: { name: "ranking_bracket", in: "query", required: false, schema: { type: "string" }, description: "Ranking bucket (top_10, etc.)" },
    },
  },

  paths: {
    // --- COMPETITION V1 ---
    "/api/v1/competition/selectors": {
      get: { tags: ["Competition V1"], summary: "Get legacy competition selectors", responses: { "200": { content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } } },
    },
    "/api/v1/competition/athletes": {
      get: { tags: ["Competition V1"], parameters: [{ $ref: "#/components/parameters/YearParam" }, { $ref: "#/components/parameters/PopulationParam" }, { $ref: "#/components/parameters/TournamentIdParam" }], responses: { "200": { content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } } },
    },
    "/api/v1/competition/table-data": {
      get: { tags: ["Competition V1"], parameters: [{ $ref: "#/components/parameters/TableParam" }, { $ref: "#/components/parameters/AthleteIdParam" }], responses: { "200": { content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } } },
    },
    "/api/v1/competition/match-id": {
      get: { tags: ["Competition V1"], parameters: [{ $ref: "#/components/parameters/YearParam" }, { $ref: "#/components/parameters/PopulationParam" }, { $ref: "#/components/parameters/AthleteIdParam" }, { $ref: "#/components/parameters/TournamentIdParam" }], responses: { "200": { content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } } },
    },
    "/api/v1/competition/video": {
      get: { tags: ["Competition V1"], parameters: [{ name: "match", in: "query", required: true, schema: { type: "string" } }, { name: "selected_row", in: "query", required: true, schema: { type: "string" } }], responses: { "200": { content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } } },
    },

    // --- COMPETITION V2 ---
    "/api/v2/competition/populations": {
      get: { tags: ["Competition V2"], summary: "Fetch populations for v2 flow", responses: { "200": { content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } } },
    },
     "/api/v2/competition/athletes": {
      get: { tags: ["Competition V2"], parameters: [{ $ref: "#/components/parameters/PopulationParam" }], responses: { "200": { content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } } },
    },
    "/api/v2/competition/match-ids": {
      get: { tags: ["Competition V2"], parameters: [{ $ref: "#/components/parameters/PopulationParam" }, { $ref: "#/components/parameters/AthleteNameParam" }], responses: { "200": { content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } } },
    },
    "/api/v2/competition/table-data/{piller}": {
      get: { tags: ["Competition V2"], parameters: [{ $ref: "#/components/parameters/PillerParam" }, { $ref: "#/components/parameters/PrimaryKeyParam" }, { $ref: "#/components/parameters/AthleteIdParam" }], responses: { "200": { content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } } },
    },
    "/api/v2/competition/camera-angles": {
      get: { tags: ["Competition V2"], parameters: [{ $ref: "#/components/parameters/PrimaryKeyParam" }], responses: { "200": { content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } } },
    },
    "/api/v2/competition/video": {
      get: { tags: ["Competition V2"], parameters: [{ $ref: "#/components/parameters/PrimaryKeyParam" }, { name: "video_key", in: "query", required: true, schema: { type: "string" } }], responses: { "200": { content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } } },
    },

    // --- TRENDS V1 ---
    "/api/v1/trends/selectors": {
      get: { tags: ["Trends V1"], responses: { "200": { content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } } },
    },
    "/api/v1/trends/top-players": {
      get: { tags: ["Trends V1"], parameters: [{ $ref: "#/components/parameters/TableParam" }, { $ref: "#/components/parameters/YearParam" }, { $ref: "#/components/parameters/FeatureParam" }], responses: { "200": { content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } } },
    },
    "/api/v1/trends/win-percentage": {
      post: { tags: ["Trends V1"], requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/TrendsGetWinPercentageRequest" } } } }, responses: { "200": { content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } } },
    },

    // --- TRENDS V2 ---
    "/api/v2/trends/selectors/serve": { get: { tags: ["Trends V2"], responses: { "200": { content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } } } },
    "/api/v2/trends/selectors/ros": { get: { tags: ["Trends V2"], responses: { "200": { content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } } } },
    "/api/v2/trends/selectors/endrange": { get: { tags: ["Trends V2"], responses: { "200": { content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } } } },
    "/api/v2/trends/top-players/serve": {
      get: { tags: ["Trends V2"], parameters: [{ name: "serve_call", in: "query", schema: { type: "string" } }, { name: "feature", in: "query", schema: { type: "string" } }], responses: { "200": { content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } } },
    },
    "/api/v2/trends/top-players/ros": {
      get: { tags: ["Trends V2"], parameters: [{ name: "return_shot_type", in: "query", schema: { type: "string" } }, { name: "feature", in: "query", schema: { type: "string" } }], responses: { "200": { content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } } },
    },
    "/api/v2/trends/top-players/endrange": {
      get: { tags: ["Trends V2"], parameters: [{ name: "feature", in: "query", schema: { type: "string" } }], responses: { "200": { content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } } },
    },
  },
};