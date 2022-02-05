import dotenv from 'dotenv'
/* 
  As app.js using the environment variables, we have to configure dotenv before importing app.js
*/
dotenv.config({ path: './config.env' })

import app from './app.js'

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`App running on port ${port}`)
})