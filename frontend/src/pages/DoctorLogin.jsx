import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const DoctorLogin = () => {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    
    if (email === 'lakshita@gmail.com' && password === 'lakshita@123') {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        // This API call will be properly implemented in the next step
        const { data } = await axios.post(`${backendUrl}/api/doctor/login`, { email, password });
        
        if (data.success) {
          localStorage.setItem('doctor_token', data.token);
          toast.success('Login Successful!');
          navigate('/doctor/dashboard'); // Redirect to doctor dashboard
        } else {
          toast.error(data.message || 'Login failed.');
        }

      } catch (error) {
        toast.error('An error occurred. Please try again.');
        console.error("Login Error:", error);
      } finally {
        setLoading(false);
      }
      return;
    }
    
    // Fallback for non-demo users
    toast.error('Invalid credentials for this demo.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Doctor Portal Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your dashboard to manage appointments and patients.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password-for-doctor" className="sr-only">Password</label>
              <input
                id="password-for-doctor"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Are you a patient? Login here.
            </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin; 
