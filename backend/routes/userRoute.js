import express from 'express'
import {
  getProfile,
  loginUser,
  registerUser,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  // paymentRazorpay, // Disabled
  // verifyRazorpay, // Disabled
  paymentXendit,
  verifyXendit
} from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

userRouter.get('/get-profile', authUser, getProfile)
userRouter.post(
  '/update-profile',
  upload.single('image'),
  authUser,
  updateProfile
)
userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.get('/appointments', authUser, listAppointment)
userRouter.post('/cancel-appointment', authUser, cancelAppointment)
// userRouter.post('/payment-razorpay', authUser, paymentRazorpay) // Disabled
// userRouter.post('/verify-razorpay', authUser, verifyRazorpay) // Disabled
userRouter.post('/payment-xendit', authUser, paymentXendit)
userRouter.post('/verify-xendit', authUser, verifyXendit)

export default userRouter
