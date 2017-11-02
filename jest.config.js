module.exports = {
  verbose: true,
  automock: false,
  collectCoverage: true,
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  setupTestFrameworkScriptFile: './node_modules/jest-enzyme/lib/index.js',
  collectCoverageFrom: ['examples/**/*.{js,jsx}'],
  // coverageThreshold: {
  //   global: {
  //     branches: 90,
  //     functions: 90,
  //     lines: 90,
  //     staements: 90,
  //   },
  // },
  notify: true,
  setupFiles: ['./jestSetup.js'],
};
