# How to setup NOdeJS Express with TS

## Link

[https://www.youtube.com/watch?v=xPQH-R8G9Ck]

## Commands

yarn add -D typescript ts-node nodemon
yarn add express
yarn add -D @types/express @types/node
yarn add http-errors
yarn add -D @types/http-errors
yarn add dotenv

npx tsc --init

mkdir src

- src folder will contain TypeScript files

mkdir build

- build folder will contain compiled JS files, ready to be deployed on production

## Setup to build TS to JS in the build folder

- We need to update .tsconfig file

- "include": ["./src"] : To include only src folder for compilation
- "outDir": "./build" : To define production build
- "rootDir": "./src" : To define root directory where code is placed

## Compiling code

`npx tsc`

- If Typescript is installed globally we only need to use tsc or in other words we can remove npx

npx tsc
