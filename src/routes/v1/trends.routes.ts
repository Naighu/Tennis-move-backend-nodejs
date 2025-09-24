import { Router } from "express";

import { validateAjv } from "../../middleware/validateAjv";
import { TrendsTopPlayersBodySchema } from "../../controller/trends/schemas/getTopPlayers.schema";
import { getTopPlayers,getSelectors } from "../../controller/trends/trends.controller";
const router = Router();

router.post("/top-players",validateAjv({ body: TrendsTopPlayersBodySchema }),getTopPlayers);
router.get("/selectors",getSelectors);


export default router;
