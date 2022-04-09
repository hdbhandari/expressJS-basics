import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'
import morgan from 'morgan'
export const __filename = fileURLToPath(import.meta.url)
export const __dirname = path.dirname(__filename)

dotenv.config({
  path: `./${process.env.NODE_ENV}.env`
})

export const appConfig = {
  "NODE_ENV": process.env.NODE_ENV,
  "DB_CONNECTION": process.env.DB_CONNECTION,
  "HOST": process.env.HOST,
  "PORT": process.env.PORT,
}

export const enableLogs = (app) => {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    app.use(morgan('dev'))
  } else {
    console.log("Logger not enabled as it is not development env")
  }
}