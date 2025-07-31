//

import Razorpay from 'razorpay'

// Validate Razorpay keys
const validateRazorpayKeys = () => {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret) {
    throw new Error('Razorpay keys are not set in environment variables')
  }

  return { keyId, keySecret }
}

const { keyId, keySecret } = validateRazorpayKeys()

const razorpayInstance = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
})

export default razorpayInstance
