import { query, withTransaction } from "../../services/postgres_db";
import { Request, Response } from "express";
import { sendOk } from "../../utils/respond";
import { TrendsTopPlayersBody, FEATURES, FILTERS, TABLES, RANKING_BRACKETS } from "./schemas/getTopPlayers.schema";
import { loadSql, renderSql } from "../../services/sql";
import { AppError } from "../../types/error.type";

/**
    Gets the unique year, tournament id, and population values from the competition match table
*/
export async function getSelectors(req: Request, res: Response) {
  try {
    const sql = loadSql("trends/fetch_selectors.sql");
    const { rows } = await query(sql);
    return sendOk(res, rows);

  } catch (err: any) {
    throw new AppError("DB_ERROR", err, undefined);
  }
}


export async function getTopPlayers(req: Request, res: Response) {
  try {
    const b = req.body as TrendsTopPlayersBody;

    // Resolve ONLY from allow-lists (prevents injection)
    const table = TABLES[b.table];
    const filterId = FILTERS[b.filter_feature];
    const featureExp = FEATURES[b.feature];
    const rankingBracket = RANKING_BRACKETS[b.ranking_bracket ?? "All"];

    const sqlTpl = loadSql("trends/fetch_top_n.sql");
    const sqlPerct = loadSql("trends/fetch_percentiles.sql");
    const sqlDistr = loadSql("trends/fetch_distribution.sql");

    let sql = renderSql(sqlTpl, {
      TABLE: table,
      FILTER_ID: filterId,
      FEATURE_EXPR: featureExp,
    });

    const params = [rankingBracket[0], rankingBracket[1], b.year, b.pop, b.lower_value, b.upper_value];

    const { rows: top_n_rows } = await query(sql, params);

    sql = renderSql(sqlPerct, {
      TABLE: table,
      FILTER_ID: filterId,
      FEATURE_EXPR: featureExp,
    });
    const { rows: percentile_rows } = await query(sql, params);

    top_n_rows.forEach((it: any, i: number) => { it.percentile = percentile_rows[0]['percentiles'][i] });

    sql = renderSql(sqlDistr, {
      TABLE: table,
      FILTER_ID: filterId,
      FEATURE_EXPR: featureExp,
    });
    const {rows: distribution_rows} = await query(sql,params);

    return sendOk(res, {
      "top_players": top_n_rows,
       "distribution": distribution_rows[0]
    });
  } catch (err: any) {

    throw new AppError("DB_ERROR", err, undefined);
  }
}

