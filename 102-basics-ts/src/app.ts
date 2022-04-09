import express, {
  Request,
  Response,
  NextFunction,
  Application,
  ErrorRequestHandler,
} from "express"
import { Server } from "http"
import createHttpError from "http-errors"
import { config } from "dotenv"

const app: Application = express()

config()

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello from expressJS with TypeScript!")
})

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new createHttpError.NotFound())
})

const errorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(error.status || 500)
  res.send({
    status: error.status || 500,
    message: error.message,
  })
}
app.use(errorHandler)

const PORT: Number = Number(process.env.PORT) || 3000
const server: Server = app.listen(3000, () =>
  console.log("Server is running on Port: " + PORT)
)
