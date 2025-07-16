import express from 'express'
import {
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentComplete,
  appointmentCancel,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile
} from '../controllers/doctorController.js'
import authDoctor from '../middlewares/authDoctor.js'

const doctorRouter = express.Router()

// --- Public Routes ---
doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', loginDoctor)

// --- Protected Routes (to be added later) ---
// doctorRouter.get('/profile', authDoctor, getDoctorProfile)
// doctorRouter.put('/profile', authDoctor, updateDoctorProfile)
// doctorRouter.get('/appointments', authDoctor, getDoctorAppointments)

doctorRouter.get('/appointments', authDoctor, appointmentsDoctor)
doctorRouter.post('/complete-appointment', authDoctor, appointmentComplete)
doctorRouter.post('/cancel-appointment', authDoctor, appointmentCancel)
doctorRouter.get('/dashboard', authDoctor, doctorDashboard)
doctorRouter.get('/profile', authDoctor, doctorProfile)
doctorRouter.post('/update-profile', authDoctor, updateDoctorProfile)

export default doctorRouter
