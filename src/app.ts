import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";
import { notFound, errorHandler } from "./middleware/error";
import { requestContext } from "./middleware/requestContext";

import swaggerUi from "swagger-ui-express";
import { openapiSpec } from "./docs/openapi";



const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestContext);

//OpenAPI docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.get("/openapi.json", (_req, res) => res.json(openapiSpec));

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
