import { Router } from "express";

import { validateAjv } from "../../middleware/validateAjv";
import { TrendsGetVideoBodySchema, TrendsTopPlayersBodySchema } from "../../controller/trends/schema";
import { getTopPlayers,getSelectors,getVideo } from "../../controller/trends/trends.controller";
const router = Router();

router.get("/top-players",validateAjv({ query: TrendsTopPlayersBodySchema }),getTopPlayers);
router.get("/video",validateAjv({ query: TrendsGetVideoBodySchema }),getVideo);

router.get("/selectors",getSelectors);


export default router;
