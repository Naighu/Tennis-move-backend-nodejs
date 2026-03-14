import { validateAjv } from "../../../src/middleware/validateAjv";
import { AppError } from "../../../src/types/error.type";

const schema = { type: "object", properties: { name: { type: "string" } }, required: ["name"] };

describe("validateAjv middleware", () => {
  it("calls next() for valid body", () => {
    const req = { body: { name: "Steve" } } as any;
    const res = {} as any;
    const next = jest.fn();

    const middleware = validateAjv({ body: schema });
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("throws AppError for invalid body", () => {
    const req = { body: {} } as any;
    const res = {} as any;
    const next = jest.fn();

    const middleware = validateAjv({ body: schema });

    expect(() => middleware(req, res, next)).toThrow(AppError);
  });
});