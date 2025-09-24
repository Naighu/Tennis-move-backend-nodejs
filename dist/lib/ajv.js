"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ajv = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
exports.ajv = new ajv_1.default({
    coerceTypes: true, // "2024" -> 2024, "100" -> 100
    useDefaults: true, // apply defaults from schema
    removeAdditional: "all", // strip unexpected fields
    allErrors: true, // collect all errors
});
(0, ajv_formats_1.default)(exports.ajv);
