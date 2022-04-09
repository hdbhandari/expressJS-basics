import 'dotenv/config'
import app from './app.js'
import { connectMongo } from './config/db.js'
import { appConfig } from './config/environment.js'

connectMongo()

export const server = app.listen(appConfig.PORT, () => {
  console.log(`✔️ App running on port ${appConfig.PORT} and in '${appConfig.NODE_ENV}' environment.`)
})

process.on('unhandledRejection', err => {
  console.log('🥵 unhandledRejection event Fired, Shutting down the server.')
  console.log(err.name, err.message)
  console.log(err.stack)
  server.close(() => {
    process.exit(1)
  })
})