import { query, withTransaction } from "../../services/postgres_db";
import { Request, Response } from "express";
import { sendOk } from "../../utils/respond";
import { loadSql, renderSql } from "../../services/sql";
import { AppError } from "../../types/error.type";
import { CompetetitionGetAtheletesBody, CompetetitionGetMatchIdsBody, CompetetitionGetSelectedVideosBody, CompetetitionGetTableDataBody } from "./types";
import { presignGet } from "../../services/s3";
import { Bucket } from "../../types/bucket.type";




export async function getSelectors(req: Request, res: Response) {
  try {
    const sql = loadSql("competition/list_selectors.sql");
    const { rows } = await query(sql).catch((err) => {
      throw new AppError("DB_ERROR", err, undefined);; // Re-throw the error after logging it
    });
    const out = rows.map(r => r.result);
    console.log(out);
    
    if (out.length == 0) {
      return sendOk(res, []);
    } else {
      return sendOk(res, out[0]);
    }

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
    console.log("getAthletes called");

    const body = req.query as unknown as CompetetitionGetAtheletesBody;
    const sql = loadSql("competition/list_athletes.sql");
    const params = [body.year,body.tid,body.pop];
    const { rows } = await query(sql, params).catch((err) => {
      throw new AppError("DB_ERROR", err, undefined);; // Re-throw the error after logging it
    });
    return sendOk(res, rows);

  } catch (err: any) {
     if (err instanceof AppError) {
      throw err;
    } else {
      throw new AppError("INTERNAL", err, undefined);
    }
  }
}

export async function getMatchIds(req: Request, res: Response) {
  try {
    const body = req.query as unknown as CompetetitionGetMatchIdsBody;;
    const sql = loadSql("competition/list_rounds.sql");
    const params = [body.year,body.tid, body.pop, body.player_id];
    const { rows } = await query(sql, params).catch((err) => {
      throw new AppError("DB_ERROR", err, undefined);; // Re-throw the error after logging it
    });
    return sendOk(res, rows);

  } catch (err: any) {
    if (err instanceof AppError) {
      throw err;
    } else {
      throw new AppError("INTERNAL", err, undefined);
    }
  }
}
export async function getTableData(req: Request, res: Response) {
  try {
    const body = req.query as unknown as CompetetitionGetTableDataBody;;
    const raw_sql = loadSql("competition/list_table_data.sql");
    const sql = renderSql(raw_sql, {
      TABLE: body.table,
    });
    const params = [body.reference_match_id, body.player_id];
    const { rows } = await query(sql, params).catch((err) => {
      throw new AppError("DB_ERROR", err, undefined); // Re-throw the error after logging it
    });
    return sendOk(res, rows);

  } catch (err: any) {
    throw new AppError("INTERNAL", err, undefined);
  }
}

export async function getSelectedVideos(req: Request, res: Response) {
  try {
    const body = req.query as unknown as CompetetitionGetSelectedVideosBody;;
    const raw_sql = loadSql("competition/fetch_match_metadata.sql");
    
    const { rows } = await query(raw_sql, [body.match]).catch((err) => {
      throw new AppError("DB_ERROR", err, undefined);; // Re-throw the error after logging it
    });
    const metadata = rows.length > 0  ? rows[0] : null;

    if (!metadata) {
      throw new AppError("NOT_FOUND", "No metadata found for the given parameters", undefined);
    }
    
    const video_key = `match-play/${metadata['year']}/${metadata['tournament_id']}/${metadata['match_id']}/video/${body.source}/${body.camera}/${body.selected_row}.mp4`

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