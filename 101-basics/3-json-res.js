/* 
  Simple server with 2 routes
    - /
    - /home
*/

import express from 'express'

const app = express()

app.get('/api', (req, res) => {
  res
    .status(200)
    .json({ message: 'get API called successfully 😆' })
})

const PORT = 5000
app.listen(PORT, () => { console.log("Express server started!") })