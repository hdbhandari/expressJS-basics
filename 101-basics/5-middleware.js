/* 
  Simple server with 2 routes
    - /
    - /home
*/

import express from 'express'
import morgan from 'morgan'

const app = express()

/* Middleware from NPM package for logging API requests */
app.use(morgan('dev'))

/* Custom Middleware */
app.use((req, res, next) => {
  console.log('Hello from middleware 👋')
  next()
})

app.get('/api', (req, res) => {
  res
    .status(200)
    .json({ message: 'get API called successfully 😆' })
})

const PORT = 5000
app.listen(PORT, () => { console.log("Express server started!") })