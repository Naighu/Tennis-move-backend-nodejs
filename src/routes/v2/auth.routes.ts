import { Router } from "express";
import { login } from "../../controller/auth/v2/auth.controller";
import { AuthGetLoginBodySchema } from "../../controller/auth/v2/schemas";
import { validateAjv } from "../../middleware/validateAjv";

const router = Router();

router.post("/login",validateAjv({ query: AuthGetLoginBodySchema }), login);

export default router;