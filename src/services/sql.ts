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
export function renderSql(
  template: string,
  parts: { TABLE: string; FILTER_ID: string; FEATURE_EXPR: string }
): string {
  // Very strict: only allow safe characters in identifiers/expressions.
  const ident = /^[a-zA-Z_][a-zA-Z0-9_]*$/; // for table/column
  if (!ident.test(parts.TABLE)) throw new Error("Unsafe TABLE");
  if (!ident.test(parts.FILTER_ID)) throw new Error("Unsafe FILTER_ID");
  // FEATURE_EXPR can include operators/arrows; restrict to a vetted list externally.
  if (!parts.FEATURE_EXPR) throw new Error("Missing FEATURE_EXPR");

  return template
    .replaceAll("{{TABLE}}", parts.TABLE)
    .replaceAll("{{FILTER_ID}}", parts.FILTER_ID)
    .replaceAll("{{FEATURE_EXPR}}", parts.FEATURE_EXPR);
}
