"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const routes_1 = __importDefault(require("./routes"));
const error_1 = require("./middleware/error");
const requestContext_1 = require("./middleware/requestContext");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const openapi_1 = require("./docs/openapi");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(requestContext_1.requestContext);
//OpenAPI docs
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapi_1.openapiSpec));
app.get("/openapi.json", (_req, res) => res.json(openapi_1.openapiSpec));
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api", routes_1.default);
app.use(error_1.notFound);
app.use(error_1.errorHandler);
exports.default = app;
