import express from 'express'
import { } from '../controllers/js'
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword
} from '../controllers/authController.js'
import { createUser, deleteMe, deleteUser, getAllUsers, getUser, updateMe, updateUser } from '../controllers/userController'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)

router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:token', resetPassword)

router.patch(
  '/updateMyPassword',
  protect,
  updatePassword
)

router.patch('/updateMe', protect, updateMe)
router.delete('/deleteMe', protect, deleteMe)

router
  .route('/')
  .get(getAllUsers)
  .post(createUser)

router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser)

export default router