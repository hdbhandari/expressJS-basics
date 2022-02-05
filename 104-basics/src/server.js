import 'dotenv/config'
import app from './app.js'
import { connectMongo } from './config/db.js'

connectMongo()

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}! 👯`)
})