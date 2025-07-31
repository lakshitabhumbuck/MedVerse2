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
import nearbyDoctorRoute from './routes/nearbyDoctor.js'



const app = express()
const port = process.env.PORT || 4000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

connetDB()
connectCloudinary()


app.use(express.json())
app.use(cors())


app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter) 
app.use('/api', nearbyDoctorRoute)


if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../frontend/dist')))
  

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'))
  })
} else {
  app.get('/', (req, res) => {
    res.send('API WORKING...')
  })
}


app.listen(port, () => {
  console.log('Server Running on port', port)
})
