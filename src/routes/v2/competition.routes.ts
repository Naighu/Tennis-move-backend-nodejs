import { Router } from "express";

import { validateAjv } from "../../middleware/validateAjv";
import { competitionGetAtheletesBodySchema, competitionGetMatchPrimaryKeyBodySchema, competitionGetSelectedVideosBodySchema, competitionGetTableDataBodySchema } from "../../controller/competition/v2/schemas";

import { getAthletes, getSelectors, getSelectedVideos, getTableData, getMatchPrimaryKeys } from "../../controller/competition/v2/competition.controller";
import { Piller } from "../../types";
const router = Router();

router.get("/selectors" , getSelectors);

router.get("/athletes", validateAjv({ query: competitionGetAtheletesBodySchema }), getAthletes);
router.get("/match-ids", validateAjv({ query: competitionGetMatchPrimaryKeyBodySchema }), getMatchPrimaryKeys);

router.post("/table-data/:piller", validateAjv({
    query: competitionGetTableDataBodySchema, params: {
        type: "object",
        required: ["piller"],
        properties: {
            piller: { type: "string", enum: Object.values(Piller) },
        }
    }}), getTableData);
router.get("/video", validateAjv({ query: competitionGetSelectedVideosBodySchema }), getSelectedVideos);




export default router;