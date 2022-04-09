# Introduction

- In this project I am developing APIs for Product Management

## References for Code

- [Jonas Schmedtmann](https://www.udemy.com/user/jonasschmedtmann/)'s Course [Node.js, Express, MongoDB & More: The Complete Bootcamp 2022](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/), Section #8, On [Udemy](https://www.udemy.com/)
- [WeDeploy](https://github.com/wedeploy-examples/supermarket-web-example) for Products JSON and Images
- [Setting Node app for multiple environments](https://medium.com/geekculture/node-js-environment-variables-setting-node-app-for-multiple-environments-51351b51c7cd)

## Code references for Jest Tests

- [https://learn.coderslang.com/](https://learn.coderslang.com/0005-how-to-test-node.js-backend-with-supertest/)
- [https://rahmanfadhil.com/](https://rahmanfadhil.com/test-express-with-supertest/)
- [Jest did not exit one second after the test run has completed using express](https://stackoverflow.com/a/61372180/3110474)
- [Mongoose Close Connection](https://stackoverflow.com/a/16000730/3110474)
- [Jest: Better way to disable console inside unit tests](https://stackoverflow.com/a/8813951/3110474)
- [Configuring code coverage in Jest, the right way](https://www.valentinog.com/blog/jest-coverage/)

## Todo

- Mongoose Aggregation pending

## Notes

- Was getting this warning: "Consider running Jest with `--detectOpenHandles` to troubleshoot this issue" and hence added --detectOpenHandles

- `--detectOpenHandles` Attempt to collect and print open handles preventing Jest from exiting cleanly. Use this in cases where you need to use --forceExit in order for Jest to exit to potentially track down the reason. This implies --runInBand, making tests run serially. Implemented using async_hooks. This option has a significant performance penalty and should only be used for debugging
