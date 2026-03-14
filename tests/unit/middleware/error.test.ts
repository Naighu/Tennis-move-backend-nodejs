import { notFound, errorHandler } from "../../../src/middleware/error";
import { AppError, ErrorCatalog, ErrorCode } from "../../../src/types/error.type";

describe("error middleware", () => {
  let req: any;
  let res: any;
  let next: any;

  // Dynamically pick a valid ErrorCode (first one in the catalog)
  const codes = Object.keys(ErrorCatalog) as ErrorCode[];
  const dynamicCode: ErrorCode = codes[0]; // e.g., "VALIDATION_ERROR"

  beforeEach(() => {
    req = {};
    next = jest.fn();

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { requestId: "test-request-id" }
    };

    jest.useFakeTimers().setSystemTime(new Date("2026-03-14T12:00:00Z"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  // -----------------------------
  // notFound
  // -----------------------------
  it("notFound should throw AppError NOT_FOUND", () => {
    expect(() => notFound(req, res)).toThrow(AppError);
  });

  // -----------------------------
  // errorHandler
  // -----------------------------
  it("should handle AppError and return formatted response", () => {
    const err = new AppError(dynamicCode, undefined, "Test message");

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(ErrorCatalog[dynamicCode].status);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: {
        code: dynamicCode,
        message: "Test message",
        details: undefined
      },
      meta: {
        timestamp: "2026-03-14T12:00:00.000Z",
        requestId: "test-request-id"
      }
    });
  });

  it("should wrap unknown errors into INTERNAL AppError", () => {
    const err = new Error("Something broke");

    process.env.NODE_ENV = "production";

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      error: {
        code: "INTERNAL",
        message: "Internal server error",
        details: undefined
      },
      meta: {
        timestamp: "2026-03-14T12:00:00.000Z",
        requestId: "test-request-id"
      }
    });
  });

  it("should include error details in development mode", () => {
    const err = new Error("Boom");
    process.env.NODE_ENV = "development";

    errorHandler(err, req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          details: { err: "Error: Boom" }
        })
      })
    );
  });
});