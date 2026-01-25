import { Router } from "express";
import { getEndrangeSelectors, getRosSelectors, getServeSelectors, getTopPlayers } from "../../controller/trends/v2/trends.controller";
import { validateAjv } from "../../middleware/validateAjv";
import { GetTrendsTopPlayersSchema } from "../../controller/trends/v2/schema";
import { Piller } from "../../types";

const router = Router();

router.get("/selectors/serve", getServeSelectors);
router.get("/selectors/ros", getRosSelectors);
router.get("/selectors/endrange", getEndrangeSelectors);


router.get(`/top-players/:piller`, validateAjv({
    query: GetTrendsTopPlayersSchema, params: {
        type: "object",
        required: ["piller"],
        properties: {
            piller: { type: "string", enum: Object.values(Piller) },
        },
    },
}), getTopPlayers);





export default router;
