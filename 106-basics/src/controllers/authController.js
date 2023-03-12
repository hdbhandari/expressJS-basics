import crypto from 'crypto'
import { promisify } from 'util'
import jwt from 'jsonwebtoken'
import handleAsyncError from '../utils/handleAsyncError.js'
import AppError from '../utils/AppError.js'

import User from '../models/userModel.js'
import sendEmail from '../utils/sendEmail.js'

const _signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

const _createSendToken = (user, statusCode, res) => {
  const token = _signToken(user._id)

  /* Setting up JWT Token in HTTP Cookie */
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true
  }
  /* Only in case of production environment, setting up secure cookie i.e. HTTPS */
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

  res.cookie('jwt', token, cookieOptions)

  /* 
    Remove password from Output 
    or
    (Try to) set select: false in Mongoose model
  */
  user.password = undefined

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  })
}

export const signup = handleAsyncError(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  })

  _createSendToken(newUser, 201, res)
})

export const login = handleAsyncError(async (req, res, next) => {
  const { email, password } = req.body

  /* 1) check if e-mail and password exists in req */
  if (!email || !password) {
    return next(new AppError('Please provide email and Password', 400))
  }

  /* 2) Check if user exists and password is correct */
  const user = await User.findOne({ email }).select('+password')

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401))
  }

  /* 3) If all ok, send token to the client */
  _createSendToken(user, 200, res)
})

export const protect = handleAsyncError(async (req, res, next) => {
  /* 1) Check if token is there in req */
  let token
  if (req.headers.authorization && req.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    )
  }

  /* 2) Verification token */
  // TODO : not able to understand this syntax
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  /* 3) Check if user still exists */
  const currentUser = await User.findById(decoded.id)
  if (!currentUser) {
    return next(new AppError('The user does not exists'), 401)
  }

  /* 4) Check if user changed password after the token was issued */
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('Passwords updated, please login again!', 401))
  }

  /* 5) Grant access */
  req.user = currentUser
  next()
})

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    /* roles ['admin', 'lead-guide']. role='user' */
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      )
    }
    next()
  }
}

export const forgotPassword = handleAsyncError(async (req, res, next) => {
  /* 1) Get user based on Posted email */
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return next(
      new AppError('No user exists', 404)
    )
  }

  /* 2) Generate the random reset token */
  const resetToken = User.findOne({ email: req.body.email })
  await user.save({ validateBeforeSave: false })

  /* 3) Send it to user's email */
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 minutes)',
      message: message
    })

    res.status(200).json({
      status: 'success',
      message: 'Token sent to Email!'
    })
  } catch (err) {
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save({ validateBeforeSave: false })

    return next(
      new AppError(`There was an error sending the email. Try again later! ${err.message}`),
      500
    )
  }
})

export const resetPassword = handleAsyncError(async (req, res, next) => {
  /* 1) Get the user based on token */
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  })

  /* 2) If token has not expired, and there is user, set the new password */
  if (!user) {
    return next(
      new AppError('Token is expired', 400)
    )
  }
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined

  /* 3) Update changedPasswordAt property for the user */
  /* 4) Log the user in, send JWT */
  _createSendToken(user, 200, res)
})

export const updatePassword = handleAsyncError(async (req, res, next) => {
  /* 1) Get user from collection */
  const user = await User.findById(req.user.id).select('+password')

  /* 2) Check if posted current is correct */
  if (!(await User.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401))
  }

  /* 3) If so, update password */
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  await user.save()
  // User.findByIdAndupdate() will not work as intended

  /* 4) Log user in, send JWT */
  _createSendToken(user, 200, res)
})