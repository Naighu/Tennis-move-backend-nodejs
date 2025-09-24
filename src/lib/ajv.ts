import Ajv from "ajv";
import addFormats from "ajv-formats";

export const ajv = new Ajv({
  coerceTypes: true,      // "2024" -> 2024, "100" -> 100
  useDefaults: true,      // apply defaults from schema
  removeAdditional: "all",// strip unexpected fields
  allErrors: true,        // collect all errors
});
addFormats(ajv);
