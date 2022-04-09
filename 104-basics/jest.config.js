const config = async () => {
  return {
    verbose: true,
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