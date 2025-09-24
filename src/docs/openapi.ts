import type { OpenAPIObject } from "openapi3-ts/oas31";
import { TrendsTopPlayersBodySchema } from "../controller/trends/schemas/getTopPlayers.schema";

export const openapiSpec: OpenAPIObject = {
  openapi: "3.1.0",
  info: { title: "Trends API", version: "1.0.0" },
  servers: [{ url: "http://localhost:4000" }],
  components: {
    securitySchemes: {
      ApiKeyAuth: { type: "apiKey", in: "header", name: "X-API-Key" },
    },
    schemas: {
      ApiSuccess: {
        type: "object",
        properties: {
          ok: { type: "boolean", const: true },
          data: {},
          meta: {
            type: "object",
            properties: {
              timestamp: { type: "string", format: "date-time" },
              requestId: { type: "string" },
            },
          },
        },
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
          },
          meta: {
            type: "object",
            properties: {
              timestamp: { type: "string", format: "date-time" },
              requestId: { type: "string" },
            },
          },
        },
      },
     
    },
  },
  paths: {
    "/api/v1/trends/selectors" : {
        get: {
            summary: "Get selectors for trends",
            security: [{ ApiKeyAuth: [] }],
            responses: {
              "200": {
                description: "OK",
                content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } },
              },
              "400": {
                description: "Bad Request",
                content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } },
              },
              "401": {
                description: "Unauthorized",
                content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } },
              },
            },
        }
    },
    "/api/v1/trends/top-players": {
      post: {
        summary: "Top rows by feature",
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: TrendsTopPlayersBodySchema,
            },
          },
        },
        responses: {
          "200": {
            description: "OK",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } },
          },
          "400": {
            description: "Bad Request",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } },
          },
          "401": {
            description: "Unauthorized",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } },
          },
        },
      },
    },
  },
};
