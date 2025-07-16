// Sidebar component copied from admin panel for reuse in frontend
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ userType }) => {
  const location = useLocation();
  // Sidebar links for doctor or admin
  const links = userType === 'doctor' ? [
    { to: '/doctor/dashboard', label: 'Dashboard' },
    { to: '/doctor/profile', label: 'Profile' },
    { to: '/doctor/appointments', label: 'Appointments' },
  ] : [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/doctors', label: 'Doctors' },
    { to: '/admin/appointments', label: 'Appointments' },
    { to: '/admin/patients', label: 'Patients' },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen p-6">
      <div className="text-2xl font-bold mb-8 text-primary">{userType === 'doctor' ? 'Doctor Panel' : 'Admin Panel'}</div>
      <nav className="flex flex-col gap-4">
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`py-2 px-4 rounded transition-all ${location.pathname === link.to ? 'bg-primary text-white' : 'text-gray-700 hover:bg-primary/10'}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar; 