
import express from 'express'
import doctorModel from '../models/doctorModel.js' 

const router = express.Router()

router.post('/nearby-doctor', async (req, res) => {
  try {
    const { latitude, longitude } = req.body

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Coordinates missing' })
    }


    const nearbyDoctor = await doctorModel.findOne({

      city: { $regex: /delhi/i }
    })

    if (!nearbyDoctor) {
      return res.status(404).json({ message: 'No nearby doctor found' })
    }

    res.json({ doctor: {
      name: nearbyDoctor.name,
      speciality: nearbyDoctor.speciality,
      city: nearbyDoctor.city,
      id: nearbyDoctor._id
    } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
