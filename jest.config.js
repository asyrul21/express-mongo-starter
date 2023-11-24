/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules", "/dist"],
  testMatch: ["**/__test__/**", "**/e2e/**"],
};
