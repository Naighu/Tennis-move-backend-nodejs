import { Response } from "express";
import { 
  sendOk, 
  sendCreated, 
  sendNoContent, 
  sendError 
} from "../../../src/utils/respond";

describe("Unit Test: Utility - respond.ts", () => {
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    // 1. Initialize fresh mocks for every test
    jsonMock = jest.fn();
    sendMock = jest.fn();
    statusMock = jest.fn().mockReturnThis(); // Chainable: res.status(200).json(...)

    mockResponse = {
      status: statusMock,
      json: jsonMock,
      send: sendMock,
      // Your utility relies on this being set by middleware
      locals: { requestId: "test-request-id" } 
    };

    // Fix the Date to a specific value so our tests are predictable
    jest.useFakeTimers().setSystemTime(new Date("2026-03-14T12:00:00Z"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe("sendOk", () => {
    it("should return status 200 and formatted body with timestamp", () => {
      const testData = { user:"test" };
      
      sendOk(mockResponse as Response, testData);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        ok: true,
        data: testData,
        meta: {
          requestId: "test-request-id",
          timestamp: "2026-03-14T12:00:00.000Z"
        }
      });
    });
  });

  describe("sendCreated", () => {
    it("should return status 201", () => {
      sendCreated(mockResponse as Response, { id: 1 });
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ ok: true }));
    });
  });

  describe("sendNoContent", () => {
    it("should return status 204 and empty send", () => {
      sendNoContent(mockResponse as Response);
      expect(statusMock).toHaveBeenCalledWith(204);
      expect(sendMock).toHaveBeenCalled();
    });
  });

  describe("sendError", () => {
    it("should format error body correctly", () => {
      sendError(
        mockResponse as Response, 
        404, 
        "NOT_FOUND", 
        "Resource missing"
      );

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        ok: false,
        error: {
          code: "NOT_FOUND",
          message: "Resource missing",
          details: undefined
        },
        meta: {
          requestId: "test-request-id",
          timestamp: "2026-03-14T12:00:00.000Z"
        }
      });
    });
  });
});