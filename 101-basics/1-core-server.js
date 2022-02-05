/* 
  Simple server
*/

import express from 'express'

const app = express()
const PORT = 5000

/* 
  'env' variable is set by Express and in addition to 'env' by express, node also sets various environment variables
  Environment variables set by nodeJS are available at process.env.[env_var_name]
*/
app.listen(PORT, () => { console.log(`Express server started in "${app.get('env')}" mode`) })