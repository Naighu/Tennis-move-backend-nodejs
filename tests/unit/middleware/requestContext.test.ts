import { requestContext } from "../../../src/middleware/requestContext";

describe("requestContext middleware", () => {
  it("should use x-request-id header if present", () => {
    const req = { headers: { "x-request-id": "abc-123" } } as any;
    const res = { locals: {} } as any;
    const next = jest.fn();

    requestContext(req, res, next);

    expect(res.locals.requestId).toBe("abc-123");
    expect(next).toHaveBeenCalled();
  });

  it("should generate UUID if header is missing", () => {
    const req = { headers: {} } as any;
    const res = { locals: {} } as any;
    const next = jest.fn();

    requestContext(req, res, next);

    expect(res.locals.requestId).toBeDefined();
    expect(next).toHaveBeenCalled();
  });
});