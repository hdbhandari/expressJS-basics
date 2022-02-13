import express from 'express'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'

import postRoutes from './routes/postRoutes.js'
/* 
  Idea is to configure app from app.js and share this config with server.js to start the app
*/

const app = express()

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  app.use(morgan('dev'))
}
/* To parse data comming from requests */
app.use(express.json())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/* To serve static content */
app.use('/public', express.static(`${__dirname}/static`))

app.use('/api/v1/posts', postRoutes)

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

export default app

