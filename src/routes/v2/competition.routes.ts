import { Router } from "express";

import { validateAjv } from "../../middleware/validateAjv";
import { competitionGetAtheletesBodySchema, competitionGetAvailableCameraAnglesBodySchema, competitionGetMatchPrimaryKeyBodySchema, competitionGetSelectedVideosBodySchema, competitionGetTableDataBodySchema } from "../../controller/competition/v2/schemas";

import { getAthletes, getSelectedVideos, getTableData, getMatchPrimaryKeys, getAvailableCameraAngles, getPopulation } from "../../controller/competition/v2/competition.controller";
import { Piller } from "../../types";
const router = Router();

router.get("/populations" , getPopulation);


router.get("/athletes", validateAjv({ query: competitionGetAtheletesBodySchema }), getAthletes);
router.get("/match-ids", validateAjv({ query: competitionGetMatchPrimaryKeyBodySchema }), getMatchPrimaryKeys);


router.get("/table-data/:piller", validateAjv({
    query: competitionGetTableDataBodySchema, params: {
        type: "object",
        required: ["piller"],
        properties: {
            piller: { type: "string", enum: Object.values(Piller) },
        }
    }}), getTableData);

router.get("/camera-angles", validateAjv({ query: competitionGetAvailableCameraAnglesBodySchema }), getAvailableCameraAngles);

router.get("/video", validateAjv({ query: competitionGetSelectedVideosBodySchema }), getSelectedVideos);




export default router;