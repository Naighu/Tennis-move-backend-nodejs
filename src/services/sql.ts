import fs from "node:fs";
import path from "node:path";

/** Load and cache .sql files from src/queries */
const SQL_DIR = path.resolve(__dirname, "../queries");
const cache = new Map<string, string>();

export function loadSql(name: string): string {
  if (!cache.has(name)) {
    const p = path.join(SQL_DIR, name);
    const text = fs.readFileSync(p, "utf8");
    cache.set(name, text);
  }
  return cache.get(name)!;
}

/**
 * Render SQL with allow-listed identifiers.
 * Only replaces {{TABLE}}, {{FILTER_ID}}, {{FEATURE_EXPR}}
 * Values MUST still be passed as $1..$n parameters via pg.
 */
type SqlParts = {
  TABLE: string;
  FILTER_ID?: string | null;   // optional / nullable
  FEATURE_EXPR?: string | null; // optional / nullable
};

export function renderSql(template: string, parts: SqlParts): string {
  const IDENT = /^[A-Za-z_][A-Za-z0-9_]*$/; // table/column names only

  // TABLE is mandatory and must be a safe identifier
  if (!IDENT.test(parts.TABLE)) throw new Error("Unsafe TABLE");

  // Validate/normalize optionals
  const hasFilter =
    parts.FILTER_ID != null && parts.FILTER_ID !== "" && IDENT.test(parts.FILTER_ID);
  const filterId = hasFilter ? parts.FILTER_ID! : "";

  const featureExpr = (parts.FEATURE_EXPR ?? "").trim();
  const hasFeature = featureExpr.length > 0; // (validate externally if needed)

  // 1) Basic placeholder replacement
  let sql = template
    .replaceAll("{{TABLE}}", parts.TABLE)
    .replaceAll("{{FILTER_ID}}", filterId)
    .replaceAll("{{FEATURE_EXPR}}", hasFeature ? featureExpr : "");

  // 2) Drop optional blocks if value is missing
  // Mark optional sections in your SQL like:
  //   /*?FILTER_ID*/ AND t.{{FILTER_ID}} BETWEEN $1 AND $2 /*?*/
  //   /*?FEATURE_EXPR*/ , AVG(({{FEATURE_EXPR}})::float) AS avg_val /*?*/
  const dropBlock = (name: "FILTER_ID" | "FEATURE_EXPR") => {
    const re = new RegExp(String.raw`\/\*\?${name}\*\/[\s\S]*?\/\*\?\*\/`, "g");
    sql = sql.replace(re, "");
  };
  if (!hasFilter) dropBlock("FILTER_ID");
  if (!hasFeature) dropBlock("FEATURE_EXPR");

  // 3) Tidy up common leftovers (dangling AND/WHERE, extra spaces/commas)
  sql = sql
    // WHERE 1=1 AND -> WHERE
    .replace(/\bWHERE\s+1\s*=\s*1\s+AND\b/gi, "WHERE ")
    // Remove empty WHERE or "WHERE 1=1" with nothing after it
    .replace(/\bWHERE\s+1\s*=\s*1\s*(?=$|GROUP|ORDER|LIMIT|OFFSET|;)/gi, "")
    .replace(/\bWHERE\s*(?=$|GROUP|ORDER|LIMIT|OFFSET|;)/gi, "")
    // Remove ", )" → ")"
    .replace(/,\s*\)/g, ")")
    // Collapse multiple ANDs/spaces
    .replace(/\s+AND\s+(?=AND\b)/gi, " AND ")
    .replace(/\s{2,}/g, " ")
    .trim();

  return sql;
}
