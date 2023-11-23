import { sampleUtilMethod } from "../";

describe("Utility Method Unit Tests", () => {
  describe("sampleUtilMethod", () => {
    it("should return 1", () => {
      const result = sampleUtilMethod();
      expect(result).toBe(1);
    });
  });
});
