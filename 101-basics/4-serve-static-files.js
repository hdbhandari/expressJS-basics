import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()

/* 
  https://github.com/nodejs/help/issues/2907#issuecomment-757446568 
  https://dmitripavlutin.com/javascript-import-meta/
*/

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/* 
whenever we write app.use, it means we are using middleware
Here, we are using an alias(public) to the folder named static
__dirname will give us the path where app.js is located
*/
app.use("/public", express.static(path.join(__dirname, "static")))

app.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "index.html"))
})

const PORT = 5000
app.listen(PORT, () => {
  console.log("Express server started")
})