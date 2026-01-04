module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/testSetup.js'],
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: ['server.js'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  testTimeout: 30000
};
