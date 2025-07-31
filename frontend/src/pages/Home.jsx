import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import axios from 'axios'

const LocationPopup = ({ onClose }) => {
  const [step, setStep] = useState('detecting')
  const [coords, setCoords] = useState(null)
  const [error, setError] = useState(null)
  const [doctor, setDoctor] = useState(null)

  useEffect(() => {
    if (step === 'detecting') {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setCoords({ lat: latitude, lon: longitude })
          setStep('showCoords')

          try {
            // Send coords to backend and get nearby doctor
            const res = await axios.post('/api/nearby-doctor', {
              latitude,
              longitude,
            })
            setDoctor(res.data.doctor) // assuming backend sends doctor object
          } catch (err) {
            console.error('Error fetching doctor:', err)
          }
        },
        (err) => {
          setError('Location access denied or failed.')
          setStep('showCoords')
        }
      )
    }

    if (step === 'showCoords') {
      const timer = setTimeout(() => setStep('suggestDoctor'), 6000)
      return () => clearTimeout(timer)
    }

    if (step === 'suggestDoctor') {
      const timer = setTimeout(() => onClose(), 6000)
      return () => clearTimeout(timer)
    }
  }, [step, onClose])

  return (
    <div style={{ position: 'fixed', bottom: 40, right: 40, zIndex: 1000 }}>
      <div className="flex flex-col items-center justify-center w-80 h-80 bg-white border-4 border-blue-400 shadow-2xl rounded-full p-6 animate-pop-in relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold">×</button>

        {step === 'detecting' && (
          <div className="flex flex-col items-center justify-center h-full">
            <svg className="animate-spin mb-4" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            <div className="text-blue-700 text-lg font-semibold">Detecting your location...</div>
            <div className="text-xs text-gray-500 mt-2">Please wait...</div>
          </div>
        )}

        {step === 'showCoords' && (
          <div className="flex flex-col items-center justify-center h-full">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 2"/></svg>
            <div className="text-green-700 text-lg font-semibold">
              {error ? 'Location Error' : 'Location Detected!'}
            </div>
            <div className="text-base mt-2 font-mono text-gray-700">
              {error ? <span className="text-red-500">{error}</span> : <>
                {coords?.lat.toFixed(4)}° N<br />{coords?.lon.toFixed(4)}° E
              </>}
            </div>
          </div>
        )}

        {step === 'suggestDoctor' && doctor && (
          <div className="flex flex-col items-center justify-center h-full">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M16 12a4 4 0 11-8 0 4 4 0 018 0zM12 16v2"/></svg>
            <div className="text-purple-700 text-lg font-semibold">Nearby Doctor</div>
            <div className="mt-2 text-xl font-bold text-gray-800">{doctor.name}</div>
            <div className="text-sm text-gray-600">{doctor.speciality}, {doctor.city}</div>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-semibold shadow hover:bg-blue-600 transition">
              View Profile
            </button>
          </div>
        )}
      </div>
    </div>
  )
};

export default LocationPopup



const LocationButton = () => {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <>
      <button
        onClick={() => setShowPopup(true)}
        style={{position: 'fixed', bottom: 40, right: 40, zIndex: 999}}
        className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition-transform"
        title="Detect Location"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
      </button>
      {showPopup && <LocationPopup onClose={() => setShowPopup(false)} />}
    </>
  );
};

const CHATBOT_QA = [
  { q: 'What is MedVerse?', a: 'MedVerse is an online doctor appointment platform connecting patients with top doctors.' },
  { q: 'How do I book an appointment?', a: 'Just select a doctor, choose a time slot, and confirm your booking online.' },
  { q: 'Is my data secure?', a: 'Yes, your data is encrypted and privacy is our top priority.' },
  { q: 'Can I consult doctors online?', a: 'Absolutely! We offer both in-person and online consultations.' },
  { q: 'How do I pay for appointments?', a: 'You can pay securely online using various payment methods.' },
  { q: 'Can I cancel or reschedule?', a: 'Yes, appointments can be cancelled or rescheduled from your dashboard.' },
  { q: 'What if I miss my appointment?', a: 'You can rebook or contact support for assistance.' },
  { q: 'How do I contact support?', a: 'Use the contact form or chat with us here for help.' },
  { q: 'Are the doctors verified?', a: 'All doctors on MedVerse are verified professionals.' },
  { q: 'Can I view my appointment history?', a: 'Yes, your full appointment history is available in your profile.' },
];

const ChatbotPopup = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I am MedVerse Assistant. Here are some common questions, or you can ask your own below:' }
  ]);
  const [showQuestions, setShowQuestions] = useState(true);
  const [input, setInput] = useState('');
  const chatRef = React.useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, showQuestions]);

  const handleQuestionClick = (qa) => {
    setMessages(prev => [
      ...prev,
      { from: 'user', text: qa.q },
      { from: 'bot', text: qa.a }
    ]);
    setShowQuestions(false);
  };

  const handleBack = () => {
    setShowQuestions(true);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    // Find answer
    const found = CHATBOT_QA.find(qa => qa.q.toLowerCase() === input.trim().toLowerCase());
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { from: 'bot', text: found ? found.a : "Sorry, I can only answer specific questions. Try asking about MedVerse, booking, payment, or support!" }
      ]);
    }, 700);
    setInput('');
    setShowQuestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div style={{position: 'fixed', bottom: 100, right: 30, zIndex: 1000}}>
      <div className="w-[480px] h-[540px] bg-white border-4 border-purple-400 shadow-2xl rounded-2xl flex flex-col p-0 overflow-hidden animate-pop-in relative">
        <button onClick={onClose} className="absolute top-3 right-5 text-gray-400 hover:text-gray-700 text-xl font-bold z-10">×</button>
        <div className="bg-gradient-to-br from-purple-400 to-blue-400 text-white text-lg font-bold text-center py-4">MedVerse Chatbot</div>
        <div ref={chatRef} className="flex-1 px-6 py-3 overflow-y-auto custom-scrollbar" style={{maxHeight: '340px'}}>
          {messages.map((msg, i) => (
            <div key={i} className={`mb-3 flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-2xl px-4 py-2 max-w-[70%] text-sm shadow ${msg.from === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-purple-100 text-purple-900'}`}>{msg.text}</div>
            </div>
          ))}
          {showQuestions && (
            <div className="mt-2 grid grid-cols-1 gap-2">
              {CHATBOT_QA.map((qa, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuestionClick(qa)}
                  className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg border border-blue-200 transition shadow-sm text-sm font-medium"
                >
                  {qa.q}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 bg-white flex items-center gap-2 border-t">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
          />
          <button onClick={handleSend} className="bg-purple-500 hover:bg-purple-600 text-white rounded-full px-4 py-2 font-bold text-sm transition">Send</button>
        </div>
        {!showQuestions && (
          <button onClick={handleBack} className="absolute left-5 bottom-5 bg-purple-100 text-purple-700 px-4 py-2 rounded-full shadow hover:bg-purple-200 font-semibold text-sm transition">← Back</button>
        )}
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c4b5fd;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
        }
      `}</style>
    </div>
  );
};

const ChatbotButton = () => {
  const [showChat, setShowChat] = useState(false);
  return (
    <>
      <button
        onClick={() => setShowChat(true)}
        style={{position: 'fixed', bottom: 120, right: 40, zIndex: 999}}
        className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-400 text-white rounded-full shadow-2xl flex items-center justify-center text-3xl hover:scale-110 transition-transform border-4 border-white"
        title="Chat with us"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </button>
      {showChat && <ChatbotPopup onClose={() => setShowChat(false)} />}
    </>
  );
};

const Home = () => {
  return (
    <div>
      <Header />
      <SpecialityMenu />
      <TopDoctors />
      <Banner />
      <LocationButton />
      <ChatbotButton />
    </div>
  )
}

export default Home
