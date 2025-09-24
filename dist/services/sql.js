"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSql = loadSql;
exports.renderSql = renderSql;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
/** Load and cache .sql files from src/queries */
const SQL_DIR = node_path_1.default.resolve(__dirname, "../queries");
const cache = new Map();
function loadSql(name) {
    if (!cache.has(name)) {
        const p = node_path_1.default.join(SQL_DIR, name);
        const text = node_fs_1.default.readFileSync(p, "utf8");
        cache.set(name, text);
    }
    return cache.get(name);
}
/**
 * Render SQL with allow-listed identifiers.
 * Only replaces {{TABLE}}, {{FILTER_ID}}, {{FEATURE_EXPR}}
 * Values MUST still be passed as $1..$n parameters via pg.
 */
function renderSql(template, parts) {
    // Very strict: only allow safe characters in identifiers/expressions.
    const ident = /^[a-zA-Z_][a-zA-Z0-9_]*$/; // for table/column
    if (!ident.test(parts.TABLE))
        throw new Error("Unsafe TABLE");
    if (!ident.test(parts.FILTER_ID))
        throw new Error("Unsafe FILTER_ID");
    // FEATURE_EXPR can include operators/arrows; restrict to a vetted list externally.
    if (!parts.FEATURE_EXPR)
        throw new Error("Missing FEATURE_EXPR");
    return template
        .replaceAll("{{TABLE}}", parts.TABLE)
        .replaceAll("{{FILTER_ID}}", parts.FILTER_ID)
        .replaceAll("{{FEATURE_EXPR}}", parts.FEATURE_EXPR);
}
