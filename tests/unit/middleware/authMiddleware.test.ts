import { authMiddleware } from "../../../src/middleware/authMiddleware";
import { verifyJwt } from "../../../src/services/client_ssm";
import { AppError } from "../../../src/types/error.type";

jest.mock("../../../src/services/client_ssm");

describe("authMiddleware", () => {
  it("should call next with AppError if Authorization header is missing", async () => {
    const req = { headers: {} } as any;
    const res = {} as any;
    const next = jest.fn();

    await authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.code).toBe("AUTH_REQUIRED");
  });

  it("should set req.user if token is valid", async () => {
    (verifyJwt as jest.Mock).mockResolvedValue({ sub: "123", email: "user@example.com" });

    const req = { headers: { authorization: "Bearer valid-token" } } as any;
    const res = {} as any;
    const next = jest.fn();

    await authMiddleware(req, res, next);

    expect(req.user).toEqual({
      sub: "123",
      email: "user@example.com",
      raw: { sub: "123", email: "user@example.com" },
    });
    expect(next).toHaveBeenCalled();
  });
});