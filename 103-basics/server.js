import dotenv from 'dotenv'
/* 
  As app.js using the environment variables, we have to configure dotenv before importing app.js
*/
dotenv.config({ path: './config.env' })

import app from './app.js'

export const getPort = () => {
  if (process.env.NODE_ENV === 'local') {
    return 5000
  } else if (process.env.NODE_ENV === 'production') {
    return process.env.PORT || 8000
  } else if (process.env.NODE_ENV === 'test') {
    return 4900
  } else {
    return 5000
  }
}

const PORT = getPort()

const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`)
})

export default server