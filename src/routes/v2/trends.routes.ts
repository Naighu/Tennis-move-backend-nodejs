import { Router } from "express";
import { getEndrangeSelectors, getRosSelectors, getServeSelectors, getTopPlayers } from "../../controller/trends/v2/trends.controller";
import { validateAjv } from "../../middleware/validateAjv";
import { GetTrendsEndrangeTopPlayersSchema, GetTrendsRosTopPlayersSchema, GetTrendsServeTopPlayersSchema } from "../../controller/trends/v2/schema";
import { Piller } from "../../types";

const router = Router();

router.get("/selectors/serve", getServeSelectors);
router.get("/selectors/ros", getRosSelectors);
router.get("/selectors/endrange", getEndrangeSelectors);


router.get(`/top-players/serve`, validateAjv({
    query: GetTrendsServeTopPlayersSchema
}), getTopPlayers);

router.get(`/top-players/endrange`, validateAjv({
    query: GetTrendsEndrangeTopPlayersSchema
}), getTopPlayers);


router.get(`/top-players/ros`, validateAjv({
    query: GetTrendsRosTopPlayersSchema
}), getTopPlayers);





export default router;
