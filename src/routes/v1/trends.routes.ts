import { Router } from "express";

import { validateAjv } from "../../middleware/validateAjv";
import { TrendsGetVideoBodySchema, TrendsGetWinPercentageSchema, TrendsTopPlayersBodySchema } from "../../controller/trends/v1/schema";
import { getTopPlayers,getSelectors,getVideo, getWinPercentage, getDistribution } from "../../controller/trends/v1/trends.controller";
const router = Router();

router.get("/top-players",validateAjv({ query: TrendsTopPlayersBodySchema }),getTopPlayers);
router.get("/distribution",validateAjv({ query: TrendsTopPlayersBodySchema }),getDistribution);

router.get("/video",validateAjv({ query: TrendsGetVideoBodySchema }),getVideo);

router.get("/selectors",getSelectors);
router.post("/win-percentage", validateAjv ({body: TrendsGetWinPercentageSchema}),getWinPercentage);



export default router;
