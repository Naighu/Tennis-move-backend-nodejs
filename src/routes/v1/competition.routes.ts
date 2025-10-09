import { Router } from "express";

import { validateAjv } from "../../middleware/validateAjv";
import { competitionGetAtheletesBodySchema,competitionGetMatchIdsBodySchema, competitionGetSelectedVideosBodySchema, competitionGetTableDataBodySchema } from "../../controller/competition/schemas";

import { getAthletes,getSelectors,getMatchIds,getSelectedVideos,getTableData} from "../../controller/competition/competition.controller";
const router = Router();

router.get("/selectors",getSelectors);

router.get("/athletes",validateAjv({ query: competitionGetAtheletesBodySchema }),getAthletes);
router.get("/match-id",validateAjv({ query: competitionGetMatchIdsBodySchema }),getMatchIds);
router.get("/table-data",validateAjv({ query: competitionGetTableDataBodySchema }),getTableData);
router.get("/video",validateAjv({ query: competitionGetSelectedVideosBodySchema }),getSelectedVideos);




export default router;