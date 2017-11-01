module.exports = {
  verbose: true,
  collectCoverage: true,
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  collectCoverageFrom: ['examples/**/*.{js,jsx}'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      staements: 90,
    },
  },
  notify: true,
};
