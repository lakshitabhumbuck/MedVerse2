import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const token = localStorage.getItem('doctor_token');
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        // Fetch doctor profile
        const { data: docData } = await axios.get(`${backendUrl}/api/doctor/profile`, {
          headers: { token }
        });
        setDoctor(docData.doctor);
        // Fetch appointments
        const { data: apptData } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
          headers: { token }
        });
        setAppointments(apptData.appointments);
      } catch (error) {
        toast.error('Failed to load doctor data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('doctor_token');
    toast.success('Logged out successfully.');
    navigate('/doctor-login');
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userType="doctor" />
      <div className="flex-1 flex flex-col">
        <div className="flex justify-end items-center p-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded shadow transition"
          >
            Logout
          </button>
        </div>
        <main className="p-8 pt-0">
          <h1 className="text-2xl font-bold mb-6">Doctor Dashboard</h1>
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-2">Profile</h2>
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <div className="font-bold text-lg">{doctor?.name}</div>
                <div className="text-gray-600">{doctor?.email}</div>
                <div className="text-gray-600">Speciality: {doctor?.speciality}</div>
                <div className="text-gray-600">Fees: ₹{doctor?.fees}</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Appointments</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appt) => (
                    <tr key={appt._id}>
                      <td className="px-4 py-2">{appt.userData?.name}</td>
                      <td className="px-4 py-2">{appt.slotDate}</td>
                      <td className="px-4 py-2">{appt.slotTime}</td>
                      <td className="px-4 py-2">{appt.cancelled ? 'Cancelled' : appt.isCompleted ? 'Completed' : 'Upcoming'}</td>
                      <td className="px-4 py-2">{appt.payment ? 'Paid' : 'Unpaid'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {appointments.length === 0 && <div className="text-gray-500 text-center py-8">No appointments found.</div>}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard; 