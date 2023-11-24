import { catchControllerError } from "../error";
import { Response } from "express";

describe("Utility Method catchControllerError Unit Tests", () => {
  it("should call next with correct error message", async () => {
    const mockStatusFn = jest.fn();
    const mockNextFn = jest.fn();

    catchControllerError({
      operation: "Test Operation",
      statusCode: 400,
      error: {
        message: "Invalid amount value",
      } as Error,
      response: {
        status: mockStatusFn,
      } as unknown as Response,
      errorMessagePrefix: "Creation failed",
      next: mockNextFn,
    });

    expect(mockStatusFn).toHaveBeenCalledWith(400);
    expect(mockNextFn).toHaveBeenCalledWith(
      new Error("Creation failed. Invalid amount value.")
    );
  });
});
