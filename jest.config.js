export default {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['jest-extended'],
  roots: [
    '<rootDir>/src',
  ],
  testMatch: [
    '**/__tests__/**/*.test.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
	},

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {

  }
};
