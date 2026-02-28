import { Router } from "express";
import { getPlayerProfile } from "../../controller/player/v2/player.controller";

const router = Router();


router.get('/:playerid', getPlayerProfile)
export default router;