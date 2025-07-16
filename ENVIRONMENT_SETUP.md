# Environment Setup Guide for Prescripto Web App

This guide will help you set up the environment variables needed to run the Prescripto Web App.

## Prerequisites

Before setting up the environment files, you'll need:
1. MongoDB database (local or MongoDB Atlas)
2. Cloudinary account for image uploads
3. Razorpay account for payments
4. Node.js and npm installed

## Backend Environment Setup

1. Navigate to the `backend` folder
2. Create a `.env` file (copy from `env.example`)
3. Fill in the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Cloudinary Configuration (for image uploads)
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key

# Payment Gateway Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CURRENCY=INR

# Admin Configuration
ADMIN_EMAIL=admin@prescripto.com
ADMIN_PASSWORD=admin_password_here

# Server Configuration
PORT=4000
```

### How to get these values:

#### MongoDB URI
- **Local MongoDB**: `mongodb://localhost:27017`
- **MongoDB Atlas**: 
  1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
  2. Create a cluster
  3. Click "Connect" → "Connect your application"
  4. Copy the connection string and replace `<password>` with your database password

#### JWT Secret
- Generate a random string (at least 32 characters)
- You can use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

#### Cloudinary Credentials
1. Go to [Cloudinary](https://cloudinary.com)
2. Sign up/Login
3. Go to Dashboard
4. Copy your Cloud Name, API Key, and API Secret

#### Razorpay Credentials
1. Go to [Razorpay](https://razorpay.com)
2. Sign up/Login
3. Go to Settings → API Keys
4. Generate API keys and copy Key ID and Key Secret

## Frontend Environment Setup

1. Navigate to the `frontend` folder
2. Create a `.env` file (copy from `env.example`)
3. Fill in the following variables:

```env
# Backend API URL
VITE_BACKEND_URL=http://localhost:4000

# Payment Gateway Configuration
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## Admin Environment Setup

1. Navigate to the `admin` folder
2. Create a `.env` file (copy from `env.example`)
3. Fill in the following variables:

```env
# Backend API URL
VITE_BACKEND_URL=http://localhost:4000
```

## Running the Application

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Admin Panel
```bash
cd admin
npm install
npm run dev
```

## Important Notes

1. **Never commit `.env` files to version control**
2. **Keep your JWT_SECRET secure and unique**
3. **Use test credentials for development**
4. **Make sure all three applications are running on different ports**
5. **Backend runs on port 4000 by default**
6. **Frontend and Admin typically run on ports 5173 and 5174 respectively**

## Troubleshooting

- If you get MongoDB connection errors, make sure MongoDB is running
- If Cloudinary uploads fail, check your API credentials
- If payments don't work, verify your Razorpay credentials
- If JWT authentication fails, ensure JWT_SECRET is properly set

## Security Best Practices

1. Use strong, unique passwords for admin accounts
2. Generate cryptographically secure JWT secrets
3. Use environment-specific credentials (dev/staging/prod)
4. Regularly rotate API keys and secrets
5. Monitor API usage and logs 