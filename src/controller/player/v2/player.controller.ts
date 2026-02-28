import { Request, Response } from "express"
import { AppError } from "../../../types/error.type"
import { sendOk } from "../../../utils/respond"
import { fetchATPPlayer } from "./helper/fetch_player_details"


export async function getPlayerProfile(req: Request, res: Response) {
    try {
        const playerId = req.params.playerid


        if (!playerId)
            throw new AppError("NOT_FOUND", "Playerid not found")

       const data = await fetchATPPlayer(playerId)

        return sendOk(res, data)
    } catch (err) {
        console.log(err);

        if (err instanceof AppError) {
            throw err;
        } else {
            throw new AppError("INTERNAL", err, undefined);
        }
    }
}

