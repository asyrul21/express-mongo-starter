import { IsEmail, IsString } from "class-validator";
import { validateRequestBody } from "../validateRequestBody";

export class SampleDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}

describe("Utility Method validateRequestBody Unit Tests", () => {
  it("should throw appropriate error", async () => {
    const sampleRequestBody = {};
    let error: Error | null = null;
    try {
      await validateRequestBody(SampleDto, sampleRequestBody);
    } catch (e) {
      error = e;
    }
    expect(error).not.toBe(null);
    expect(error.message).toBe("name must be a string, email must be an email");
  });

  it("should return request body if validation succeeds", async () => {
    const sampleRequestBody = {
      name: "John",
      email: "john@email.com",
    };
    let result;
    let error: Error | null = null;
    try {
      result = await validateRequestBody(SampleDto, sampleRequestBody);
    } catch (e) {
      error = e;
    }
    expect(error).toBe(null);
    expect(result).toMatchObject(sampleRequestBody);
  });
});
