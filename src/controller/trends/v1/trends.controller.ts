import { Request, Response } from "express";
import { TrendsTopPlayersBody, FEATURES, FILTERS, TABLES, RANKING_BRACKETS, TrendsGetVideoBody, TrendsGetWinPercentageBody, TrendsDistributionBody } from "./types";
import { loadSql, renderSql } from "../../../services/sql";
import { AppError } from "../../../types/error.type";
import { query } from "../../../services/postgres_db";
import { sendOk } from "../../../utils/respond";
import { presignGet } from "../../../services/s3";
import { AWSKey } from "../../../types";


/**
    Gets the unique year, tournament id, and population values from the competition match table
*/
export async function getSelectors(req: Request, res: Response) {
  try {
    const sql = loadSql("trends/fetch_selectors.sql");
    const { rows } = await query(sql).catch((err) => {
      throw new AppError("DB_ERROR", err, undefined);; // Re-throw the error after logging it
    });
    const out = rows.map(r => r.result);
    if (out.length == 0) {
      return sendOk(res, []);
    } else {
      return sendOk(res, out[0]);
    }

  } catch (err: any) {
    throw new AppError("INTERNAL", err, undefined);
  }
}


export async function getTopPlayers(req: Request, res: Response) {
  try {
    const b = req.query as unknown as TrendsTopPlayersBody;

    // Resolve ONLY from allow-lists (prevents injection)
    const table = TABLES[b.table];
    const filterId = FILTERS[b.filter_feature];
    const featureExp = FEATURES[b.feature];
    const rankingBracket = RANKING_BRACKETS[b.ranking_bracket ?? "All"];

    const sqlRaw = loadSql("trends/fetch_top_n.sql");


    let sql = renderSql(sqlRaw, {
      TABLE: table,
      FILTER_ID: filterId,
      FEATURE_EXPR: featureExp,
    });

    const params = [rankingBracket[0], rankingBracket[1], b.year, b.pop, b.lower_value, b.upper_value];
    const { rows: trends_rows } = await query(sql, params).catch((err) => {
      console.log(err);

      throw new AppError("DB_ERROR", err, undefined);
    });
    return sendOk(res,
      trends_rows);
  } catch (err: any) {

    throw new AppError("INTERNAL", err, undefined);
  }
}


export async function getDistribution(req: Request, res: Response) {
  try {
    const b = req.query as unknown as TrendsDistributionBody;
    const table = TABLES[b.table];
    const filterId = FILTERS[b.filter_feature];
    const featureExp = FEATURES[b.feature];


    const sqlRaw = loadSql("trends/fetch_distribution.sql");


    let sql = renderSql(sqlRaw, {
      TABLE: table,
      FILTER_ID: filterId,
      FEATURE_EXPR: featureExp,
    });

    const distributions: Record<string, unknown> = {}

    for (const key in RANKING_BRACKETS) {
      const rankingBracket = RANKING_BRACKETS[key as keyof typeof RANKING_BRACKETS];
      const params = [rankingBracket[0], rankingBracket[1], b.year, b.pop, b.lower_value, b.upper_value];
      const { rows } = await query(sql, params).catch((err) => {
        console.log(err);

        throw new AppError("DB_ERROR", err, undefined);
      });

      distributions[key] = rows;
    }

    return sendOk(res,
      distributions);
  } catch (err: any) {
    if (err instanceof AppError) {
      throw err;
    } else {
      throw new AppError("INTERNAL", err, undefined);
    }
  }
}



export async function getVideo(req: Request, res: Response) {
  try {
    const b = req.query as unknown as TrendsGetVideoBody;
    const row_id = b.selected_row.split('_')
    const video_key = `match-play/${row_id[1]}/${row_id[2]}/${row_id[3]}/video/${b.source}/${b.camera}/${b.selected_row}.mp4`


    const url = await presignGet(AWSKey.TennisMoveBucket, video_key);

    return sendOk(res, { "url": url });
  } catch (err: any) {
    if (err instanceof AppError) {
      throw err;
    } else {
      throw new AppError("INTERNAL", err, undefined);
    }
  }
}

export async function getWinPercentage(req: Request, res: Response) {
  try {
    const players = req.body.player_ids as unknown as TrendsGetWinPercentageBody;
    const sql = loadSql("trends/fetch_win_percentage.sql");
    const { rows: trends_rows } = await query(sql, [players]).catch((err) => {
      console.log(err);

      throw new AppError("DB_ERROR", err, undefined);
    });
    return sendOk(res,
      trends_rows);

  } catch (err: any) {
    if (err instanceof AppError) {
      throw err;
    } else {
      throw new AppError("INTERNAL", err, undefined);
    }
  }
}