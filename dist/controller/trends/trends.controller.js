"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSelectors = getSelectors;
exports.getTopPlayers = getTopPlayers;
const postgres_db_1 = require("../../services/postgres_db");
const respond_1 = require("../../utils/respond");
const getTopPlayers_schema_1 = require("./schemas/getTopPlayers.schema");
const sql_1 = require("../../services/sql");
const error_type_1 = require("../../types/error.type");
/**
    Gets the unique year, tournament id, and population values from the competition match table
*/
async function getSelectors(req, res) {
    try {
        const sql = (0, sql_1.loadSql)("trends/fetch_selectors.sql");
        const { rows } = await (0, postgres_db_1.query)(sql);
        return (0, respond_1.sendOk)(res, rows);
    }
    catch (err) {
        throw new error_type_1.AppError("DB_ERROR", err, undefined);
    }
}
async function getTopPlayers(req, res) {
    try {
        const b = req.body;
        // Resolve ONLY from allow-lists (prevents injection)
        const table = getTopPlayers_schema_1.TABLES[b.table];
        const filterId = getTopPlayers_schema_1.FILTERS[b.filter_feature];
        const featureExp = getTopPlayers_schema_1.FEATURES[b.feature];
        const rankingBracket = getTopPlayers_schema_1.RANKING_BRACKETS[b.ranking_bracket ?? "All"];
        const sqlTpl = (0, sql_1.loadSql)("trends/fetch_top_n.sql");
        // const sqlPerct = loadSql("trends/fetch_percentiles.sql");
        // const sqlDistr = loadSql("trends/fetch_distribution.sql");
        let sql = (0, sql_1.renderSql)(sqlTpl, {
            TABLE: table,
            FILTER_ID: filterId,
            FEATURE_EXPR: featureExp,
        });
        const params = [rankingBracket[0], rankingBracket[1], b.year, b.pop, b.lower_value, b.upper_value];
        const { rows: top_n_rows } = await (0, postgres_db_1.query)(sql, params);
        // sql = renderSql(sqlPerct, {
        //   TABLE: table,
        //   FILTER_ID: filterId,
        //   FEATURE_EXPR: featureExp,
        // });
        // const { rows: percentile_rows } = await query(sql, params);
        // top_n_rows.forEach((it: any, i: number) => { it.percentile = percentile_rows[0]['percentiles'][i] });
        // sql = renderSql(sqlDistr, {
        //   TABLE: table,
        //   FILTER_ID: filterId,
        //   FEATURE_EXPR: featureExp,
        // });
        // const {rows: distribution_rows} = await query(sql,params);
        return (0, respond_1.sendOk)(res, {
            "top_players": top_n_rows,
            // "distribution": distribution_rows[0]
        });
    }
    catch (err) {
        throw new error_type_1.AppError("DB_ERROR", err, undefined);
    }
}
