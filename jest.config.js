/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'], // This tells Jest to look for .test.ts files ONLY inside the tests folder

  // --- Coverage settings ---
  collectCoverage: true,
  // collectCoverageFrom: [
  //   "src/**/*.ts",        // include all source files
  //   "!src/**/*.d.ts",     // ignore type definitions
  //   "!src/**/index.ts"    // optional: ignore barrel files
  // ],
  coverageDirectory: "coverage",
  coverageReporters: ["html"],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',}, // This helps Jest understand your absolute paths if you use them
  
  verbose: true,
  forceExit: true,
  clearMocks: true,
};