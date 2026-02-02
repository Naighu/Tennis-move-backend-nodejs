import { Router } from "express";
import { getEndrangeSelectors, getRosSelectors, getServeSelectors, getTopPlayers, getTrendsOverview } from "../../controller/trends/v2/trends.controller";
import { validateAjv } from "../../middleware/validateAjv";
import { GetTrendsEndrangeTopPlayersSchema, GetTrendsEndrangeOverviewSchema, GetTrendsRosOverviewSchema, GetTrendsServeOverviewSchema, GetTrendsRosTopPlayersSchema, GetTrendsServeTopPlayersSchema } from "../../controller/trends/v2/schema";
import { Piller } from "../../types";

const router = Router();

router.get("/selectors/serve", getServeSelectors);
router.get("/selectors/ros", getRosSelectors);
router.get("/selectors/endrange", getEndrangeSelectors);



router.get(`/serve/overview`, validateAjv({
    query: GetTrendsServeOverviewSchema
}), getTrendsOverview);

router.get(`serve/top-players`, validateAjv({
    query: GetTrendsServeTopPlayersSchema
}), getTopPlayers);
router.get(`/endrange/overview`, validateAjv({
    query: GetTrendsEndrangeOverviewSchema
}), getTrendsOverview);
router.get(`/endrange/top-players`, validateAjv({
    query: GetTrendsEndrangeTopPlayersSchema
}), getTopPlayers);

router.get(`/ros/overview`, validateAjv({
    query: GetTrendsRosOverviewSchema
}), getTrendsOverview);
router.get(`/ros/top-players`, validateAjv({
    query: GetTrendsRosTopPlayersSchema
}), getTopPlayers);





export default router;
