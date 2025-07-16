import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaPills, FaBell, FaFileMedical, FaUpload, FaUserCircle, FaFilePdf, FaFileImage } from 'react-icons/fa';

// Sample data for vitals
const vitalsData = [
  { date: '2024-06-01', Hemoglobin: 13.5, Glucose: 90 },
  { date: '2024-06-10', Hemoglobin: 13.8, Glucose: 95 },
  { date: '2024-06-20', Hemoglobin: 14.0, Glucose: 100 },
  { date: '2024-07-01', Hemoglobin: 13.7, Glucose: 92 },
];

// Sample medicine inventory
const sampleMedicines = [
  { name: 'Metformin', dose: '500mg', time: '8:00 AM', reminder: true },
  { name: 'Atorvastatin', dose: '10mg', time: '9:00 PM', reminder: false },
];

// Sample documents
const sampleDocs = [
  { name: 'Blood Test Report.pdf', url: '#', type: 'pdf' },
  { name: 'Prescription_June2024.jpg', url: '#', type: 'image' },
];

const UserDashboard = () => {
  const [docs, setDocs] = useState(sampleDocs);
  const [uploading, setUploading] = useState(false);

  // Simulate upload
  const handleUpload = (e) => {
    setUploading(true);
    setTimeout(() => {
      setDocs([
        ...docs,
        {
          name: e.target.files[0].name,
          url: '#',
          type: e.target.files[0].type.includes('pdf') ? 'pdf' : 'image',
        },
      ]);
      setUploading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-10 px-2 sm:px-0">
      {/* Dashboard Header */}
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4 mb-10 p-6 bg-white/80 rounded-2xl shadow-xl border border-purple-100 animate-fade-in">
        <FaUserCircle className="text-purple-400" size={64} />
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-1">Welcome Back!</h1>
          <p className="text-lg text-gray-500 font-medium">Here's your health snapshot and tools.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Lab Vitals Tracking & Charts */}
        <section className="bg-white/90 rounded-2xl shadow-lg border border-blue-100 p-6 animate-fade-in-up relative overflow-hidden">
          <div className="absolute -top-8 -right-8 opacity-10 text-blue-300 text-[8rem] pointer-events-none select-none">
            <FaFileMedical />
          </div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-blue-700">
            <FaFileMedical className="text-blue-400" /> Lab Vitals Tracking & Charts
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={vitalsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Hemoglobin" stroke="#a78bfa" strokeWidth={3} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Glucose" stroke="#f472b6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </section>

        {/* Divider */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200" />
          <span className="text-gray-400 font-bold tracking-widest text-xs">HEALTH TOOLS</span>
          <div className="flex-1 h-0.5 bg-gradient-to-l from-blue-200 via-purple-200 to-pink-200" />
        </div>

        {/* Medicine Inventory Management */}
        <section className="bg-white/90 rounded-2xl shadow-lg border border-pink-100 p-6 animate-fade-in-up">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-pink-700">
            <FaPills className="text-pink-400" /> My Medications
          </h2>
          <ul className="divide-y">
            {sampleMedicines.map((med, idx) => (
              <li key={idx} className="py-3 flex items-center justify-between group hover:bg-pink-50 rounded-lg transition">
                <div>
                  <span className="font-semibold text-gray-700">{med.name}</span> <span className="text-sm text-gray-400">({med.dose})</span>
                  <span className="ml-4 text-gray-600 font-mono bg-pink-100 px-2 py-0.5 rounded text-xs">{med.time}</span>
                </div>
                {med.reminder ? (
                  <span className="flex items-center gap-1 text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full text-xs animate-pulse">
                    <FaBell className="mr-1" /> Reminder On
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-gray-400 bg-gray-100 px-2 py-1 rounded-full text-xs">No Reminder</span>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-4 text-sm text-gray-400 italic">* Reminders are sent daily at the specified time.</div>
        </section>

        {/* Divider */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-0.5 bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200" />
          <span className="text-gray-400 font-bold tracking-widest text-xs">DOCUMENTS</span>
          <div className="flex-1 h-0.5 bg-gradient-to-l from-pink-200 via-purple-200 to-blue-200" />
        </div>

        {/* Secure Document Storage & Viewing */}
        <section className="bg-white/90 rounded-2xl shadow-lg border border-purple-100 p-6 animate-fade-in-up">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-purple-700">
            <FaUpload className="text-purple-400" /> My Health Docs
          </h2>
          <label className="flex items-center gap-3 cursor-pointer mb-4">
            <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-purple-200 bg-purple-50 text-purple-700 font-semibold shadow-sm hover:bg-purple-100 transition ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}>
              <FaUpload /> {uploading ? 'Uploading...' : 'Upload Document'}
            </span>
          </label>
          <ul className="divide-y">
            {docs.map((doc, idx) => (
              <li key={idx} className="py-3 flex items-center gap-4 group hover:bg-purple-50 rounded-lg transition">
                {doc.type === 'pdf' ? (
                  <FaFilePdf className="text-red-400 text-xl" />
                ) : (
                  <FaFileImage className="text-blue-400 text-xl" />
                )}
                <span className="font-medium text-gray-700 flex-1 truncate">{doc.name}</span>
                {doc.type === 'pdf' ? (
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-purple-600 underline font-semibold hover:text-purple-800 transition">View PDF</a>
                ) : (
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-purple-600 underline font-semibold hover:text-purple-800 transition">View Image</a>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default UserDashboard; 