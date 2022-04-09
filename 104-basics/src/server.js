import app from './app.js'
import { connectMongo } from './config/db.js'
import { appConfig } from './config/environment.js'

connectMongo()

// console.log(mongoose.Collection.dbName)

export const server = app.listen(appConfig.PORT, () => {
  console.log(`✔️ App running on port ${appConfig.PORT}!`)
})