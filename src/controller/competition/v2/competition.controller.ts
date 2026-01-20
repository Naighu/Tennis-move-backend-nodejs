import { query, withTransaction } from "../../../services/postgres_db";
import { Request, Response } from "express";
import { sendNoContent, sendOk } from "../../../utils/respond";
import { loadSql, renderSql } from "../../../services/sql";
import { AppError } from "../../../types/error.type";
import { CompetetitionGetAtheletesBody, CompetetitionGetMatchPrimaryKeysBody, CompetetitionGetSelectedVideosBody, CompetetitionGetTableDataBody } from "./types";
import { getObjectStream, presignGet, streamToString } from "../../../services/s3";
import { Bucket } from "../../../types/bucket.type";
import { extractAthletes, extractMatchIds, extractSelectors, fetchMatchList } from "./helpers/extract_match_list";
import { queryDynamoDb } from "../../../services/dyanmo_db";
import { enrichMatchIds } from "./helpers/enrich_match_ids";




export async function getSelectors(req: Request, res: Response) {
  try {

    const matchListObject = await fetchMatchList();

    //Extrac selectors from the match-list object
    const selectors = extractSelectors(matchListObject); return sendOk(res, selectors)

  } catch (err: any) {
    if (err instanceof AppError) {
      throw err;
    } else {
      throw new AppError("INTERNAL", err, undefined);
    }
  }
}

/*
    Selects all athlete names and competition player id values from the list of available athletes who meet an input criteria

    Args:
        year (int, None): The competition year value
        tid (str, None): The tournament id value
        pop (str, None): A string representing a population (MS, WS, BS, or GS)

    Returns:
        JSONResponse: A json response of the athletes names and competition player id values from the athletes table given the desired year, tournament, and population.
*/
export async function getAthletes(req: Request, res: Response) {
  try {

    const body = req.query as unknown as CompetetitionGetAtheletesBody;
    const matchListObject = await fetchMatchList();

    const players = extractAthletes(matchListObject, body.year.toString(), body.tid.toString(), body.pop);
    return sendOk(res, players);

  } catch (err: any) {
    if (err instanceof AppError) {
      throw err;
    } else {
      throw new AppError("INTERNAL", err, undefined);
    }
  }
}


export async function getMatchPrimaryKeys(req: Request, res: Response) {
  try {
    const body = req.query as unknown as CompetetitionGetMatchPrimaryKeysBody;
    const matchListObject = await fetchMatchList();
    const matchIds = extractMatchIds(matchListObject, body.year.toString(), body.tid.toString(), body.player_id.toString(), body.pop.toString());

    return sendOk(res, matchIds);
  } catch (err: any) {
    throw new AppError("INTERNAL", err, undefined);
  }
}

export async function getTableData(req: Request, res: Response) {
  try {

    const body = req.query as unknown as CompetetitionGetTableDataBody;
    const rows = await queryDynamoDb<{ stats: any[] }>({
      TableName: "tennis-move",
      KeyConditionExpression: "primary_key = :pk AND begins_with(sort_key, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": body.primary_key,
        ":skPrefix": `competition#${body.piller}`,
      },
    });
    const result: any[] = [];
    for (const row of rows) {
      result.push(...row.stats);
    }
    return sendOk(res, result);

  } catch (err: any) {
    throw new AppError("INTERNAL", err, undefined);
  }
}

export async function getSelectedVideos(req: Request, res: Response) {
  try {
    const body = req.query as unknown as CompetetitionGetSelectedVideosBody;;
    const year = body.primary_key.split("_")[0];
    const tournament_id = body.primary_key.split("_")[1];
    const match_id = body.primary_key.split("_")[2];
    const video_key = `match-play/${year}/${tournament_id}/${match_id}/video/${body.piller}/camera_main/${body.video_key}.mp4`

    const url = await presignGet(Bucket.TennisMoveResources, video_key);

    return sendOk(res, { "url": url });
  } catch (err: any) {
    if (err instanceof AppError) {
      throw err;
    } else {
      throw new AppError("INTERNAL", err, undefined);
    }
  }
}
