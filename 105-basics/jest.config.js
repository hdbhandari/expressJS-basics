const config = async () => {
  return {
    verbose: true,
    "testTimeout": 20000,
    "collectCoverage": true,
    "collectCoverageFrom": ["./src/**"],
    "coverageThreshold": {
      "global": {
        "lines": 90
      }
    },
    // "coverageReporters": ["html"]
  }
}

export default config