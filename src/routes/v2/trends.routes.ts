import { Router } from "express";
import { getEndrangeSelectors, getPlayerTrendsStat, getRosSelectors, getServeSelectors, getTopPlayers, getTrendsOverview } from "../../controller/trends/v2/trends.controller";
import { validateAjv } from "../../middleware/validateAjv";
import { GetTrendsEndrangeTopPlayersSchema, GetTrendsEndrangeOverviewSchema, GetTrendsRosOverviewSchema, GetTrendsServeOverviewSchema, GetTrendsRosTopPlayersSchema, GetTrendsServeTopPlayersSchema, GetTrendsServePlayerStatSchema, GetTrendsEndrangePlayerStatSchema, GetTrendsRosPlayerStatSchema } from "../../controller/trends/v2/schema";
import { Piller } from "../../types";
import { pillerMiddleware } from "../../controller/trends/v2/middleware/piller_middleware";

const router = Router();

router.get("/selectors/serve", getServeSelectors);
router.get("/selectors/ros", getRosSelectors);
router.get("/selectors/endrange", getEndrangeSelectors);


const pillars = [
  {
    name: Piller.SERVE,
    overviewSchema: GetTrendsServeOverviewSchema,
    topPlayersSchema: GetTrendsServeTopPlayersSchema,
    playerStatSchema: GetTrendsServePlayerStatSchema
  },
  {
    name: Piller.END_RANGE,
    overviewSchema: GetTrendsEndrangeOverviewSchema,
    topPlayersSchema: GetTrendsEndrangeTopPlayersSchema,
    playerStatSchema: GetTrendsEndrangePlayerStatSchema

  },
  {
    name: Piller.RETURN_OF_SERVE,
    overviewSchema: GetTrendsRosOverviewSchema,
    topPlayersSchema: GetTrendsRosTopPlayersSchema,
    playerStatSchema: GetTrendsRosPlayerStatSchema

  },
];

pillars.forEach(({ name, overviewSchema, topPlayersSchema,playerStatSchema }) => {
  router.get(
    `/${name}/overview`,
    pillerMiddleware,
    validateAjv({ query: overviewSchema }),
    getTrendsOverview
  );

  router.get(
    `/${name}/top-players`,
    pillerMiddleware,
    validateAjv({ query: topPlayersSchema }),
    getTopPlayers
  );

  router.get(`/${name}/player-stat`, pillerMiddleware, validateAjv({query: playerStatSchema}), getPlayerTrendsStat)
});

export default router;
