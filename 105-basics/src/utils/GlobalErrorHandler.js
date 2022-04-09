import AppError from "./AppError.js"

/* This is global error handler middleware by express JS */
const globalErrorHandler = (err, req, res, next) => {
  let updatedErr = { ...err }

  console.log('😲 Error occured: \n', JSON.stringify(err, null, 2))

  if (updatedErr.code === 11000) updatedErr = handleDuplicateFieldsDB(updatedErr)
  // To validate category || max, min validation errrs
  // if (updatedErr.errors?.type?.name === 'ValidatorError' || updatedErr.errors?.name?.name === 'ValidatorError') updatedErr = handleValidationErrorDB(updatedErr)
  console.log("updatedErr.name: ", updatedErr.name)
  console.log("updatedErr.code: ", updatedErr.code)
  console.log('😲 Error occured: \n', JSON.stringify(updatedErr, null, 2))

  if (updatedErr.name === 'ValidationError') updatedErr = handleValidationErrorDB(updatedErr)
  if (updatedErr.name === 'CastError') updatedErr = handleCastErrorDB(updatedErr)

  updatedErr.statusCode = updatedErr.statusCode || 500
  updatedErr.status = updatedErr.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    devEnvError(updatedErr, res)
  } else if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
    prodEnvError(updatedErr, res)
  } else {
    console.log('🟥 NODE_ENV not set properly, or not handled properly! 🟥')
  }
}

const devEnvError = (err, res) => {
  res
    .status(err.statusCode)
    .json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack
    })
}

const prodEnvError = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('💥 ERROR', JSON.stringify(err, null, 2))

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    })
  }
}


const handleCastErrorDB = (err) => {
  console.log("Cast Error")
  const message = `Invalid ${err.path}: ${err.value}.`
  /* By throwing AppError, we will making it an operational Error */
  return new AppError(message, 400)
}

const handleDuplicateFieldsDB = err => {
  // const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
  console.log("Duplicate field Error")
  const value = err.keyValue.name

  const message = `Duplicate field value: '${value}'. Please use another value!`
  return new AppError(message, 400)
}

const handleValidationErrorDB = err => {
  // const errors = Object.values(err.errors).map(el => el.message)
  // const message = `Invalid input data. ${errors.join('. ')}`
  console.log("Validation Error")
  const message = err.errors.type?.message || err.errors?.name?.message
  return new AppError(message, 400)
}


export default globalErrorHandler