import mongoose from 'mongoose'
import { appConfig } from './environment.js'

export const connectMongo = () => mongoose.connect(appConfig.DB_CONNECTION, {
  useNewUrlParser: true,
}).then((db) => {
  console.log(`✔️ DB Connected to: ${appConfig.DB_CONNECTION}`)
})
