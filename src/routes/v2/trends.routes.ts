import { Router } from "express";
import { getEndrangeSelectors, getRosSelectors, getServeSelectors, getTopPlayers, getTrendsOverview } from "../../controller/trends/v2/trends.controller";
import { validateAjv } from "../../middleware/validateAjv";
import { GetTrendsEndrangeTopPlayersSchema, GetTrendsEndrangeOverviewSchema, GetTrendsRosOverviewSchema, GetTrendsServeOverviewSchema, GetTrendsRosTopPlayersSchema, GetTrendsServeTopPlayersSchema } from "../../controller/trends/v2/schema";
import { Piller } from "../../types";

const router = Router();

router.get("/selectors/serve", getServeSelectors);
router.get("/selectors/ros", getRosSelectors);
router.get("/selectors/endrange", getEndrangeSelectors);


const pillars = [
  {
    name: "serve",
    overviewSchema: GetTrendsServeOverviewSchema,
    topPlayersSchema: GetTrendsServeTopPlayersSchema,
  },
  {
    name: "endrange",
    overviewSchema: GetTrendsEndrangeOverviewSchema,
    topPlayersSchema: GetTrendsEndrangeTopPlayersSchema,
  },
  {
    name: "ros",
    overviewSchema: GetTrendsRosOverviewSchema,
    topPlayersSchema: GetTrendsRosTopPlayersSchema,
  },
];

pillars.forEach(({ name, overviewSchema, topPlayersSchema }) => {
  router.get(
    `/${name}/overview`,
    validateAjv({ query: overviewSchema }),
    getTrendsOverview
  );

  router.get(
    `/${name}/top-players`,
    validateAjv({ query: topPlayersSchema }),
    getTopPlayers
  );
});

export default router;
