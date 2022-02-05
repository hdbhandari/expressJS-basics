/* 
  Simple server with Routes, Optional Routes and Query Params
    - /
    - /home
    - /home?param1=val1&param2=val2
    - /user/himanshu/bhandari/India?id=90&param=ok
*/

import express from 'express'

const app = express()

/* Simple Route */
app.get('/', (req, res) => {
  res.send("ok, server running")
})
/* Print Query Params */
app.get('/home', (req, res) => {
  const queryParams = req.query
  console.log(queryParams)
  res.send(`ok, server running at home with query params: ${JSON.stringify(req.query)}`)
})

/* Param and Optional Param */
app.get('/user/:firstName/:lastName/:country?', (req, res) => {
  console.log("Params: ", req.params)
  res.send(`Welcome ${req.params.firstName} ${req.params.lastName} From ${req.params.country}`)
})

const PORT = 5000
app.listen(PORT, () => { console.log("Express server started!") })