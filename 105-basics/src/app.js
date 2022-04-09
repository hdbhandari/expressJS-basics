import express from 'express'
import { enableLogs, __dirname } from './config/environment.js'
import productRoutes from './routes/productRoutes.js'
import AppError from './utils/AppError.js'
import globalErrorHandler from './utils/GlobalErrorHandler.js'

const app = express()
app.use(express.json())

enableLogs(app)

/* 
  - To serve static content
  - static folder is in parallel to src, so that code is separate from static content  
*/
// console.log(path.resolve(__dirname, '../'))
app.use('/public', express.static(`${__dirname}, '../')}/static`))
// http://localhost:5000/public/assets/images/0.jpg

app.use('/api/v1/products', productRoutes)

/* 
  Handle all the routes which are not configured
*/
app.all('*', (req, res, next) => {
  next(new AppError(`The given endpoint ${req.originalUrl} is not found on ${req.protocol}://${req.headers.host}`, 404))
})

app.use(globalErrorHandler)

export default app