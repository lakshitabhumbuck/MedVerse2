import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'
import connetDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

// -------- app config ----------
const app = express()
const port = process.env.PORT || 4000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

connetDB()
connectCloudinary()

// -------- middlewares ---------
app.use(express.json())
app.use(cors())

// ------ api endpoints ------
app.use('/api/admin', adminRouter) // localhost:4000/api/admin/add-doctor
app.use('/api/doctor', doctorRouter) // localhost:4000/api/admin/list
app.use('/api/user', userRouter) // localhost:4000/api/doctor/register

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../frontend/dist')))
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'))
  })
} else {
  app.get('/', (req, res) => {
    res.send('API WORKING...')
  })
}

// -------- port listen -------
app.listen(port, () => {
  console.log('Server Running on port', port)
})
