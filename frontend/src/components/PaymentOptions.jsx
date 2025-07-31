import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'

// --- Data for Mock UI ---
const SUGGESTED_BANKS = [
  { name: 'Bank of Baroda - Retail Banking', icon: 'https://cdn.iconscout.com/icon/free/png-256/bank-of-baroda-2-569399.png', sub: 'For Individuals' },
  { name: 'Canara Bank', icon: 'https://cdn.iconscout.com/icon/free/png-256/canara-bank-569403.png', sub: '' },
  { name: 'Punjab National Bank - Retail Banking', icon: 'https://cdn.iconscout.com/icon/free/png-256/punjab-national-bank-569446.png', sub: 'For Individuals' },
  { name: 'PNB (Erstwhile-United Bank of India)', icon: 'https://cdn.iconscout.com/icon/free/png-256/pnb-569445.png', sub: '' },
  { name: 'IDBI', icon: 'https://cdn.iconscout.com/icon/free/png-256/idbi-bank-569421.png', sub: '' },
];
const ALL_BANKS = [
  { name: 'Airtel Payments Bank', icon: 'https://cdn.iconscout.com/icon/free/png-256/airtel-569391.png' },
  { name: 'Axis Bank', icon: 'https://cdn.iconscout.com/icon/free/png-256/axis-bank-569393.png' },
  { name: 'HDFC Bank', icon: 'https://cdn.iconscout.com/icon/free/png-256/hdfc-bank-569418.png' },
];

const PAY_LATER_OPTIONS = [
  { name: 'LazyPay', icon: 'https://cdn.iconscout.com/icon/free/png-256/lazypay-569427.png' },
  { name: 'ICICI', icon: 'https://cdn.iconscout.com/icon/free/png-256/icici-bank-569420.png' },
  { name: 'ePayLater', icon: 'https://asset.brandfetch.io/idqBE_2G8F/ideP8a1L3I.png' },
  { name: 'Kotak Mahindra Bank', icon: 'https://cdn.iconscout.com/icon/free/png-256/kotak-mahindra-bank-569426.png' },
  { name: 'Amazon Pay Later', icon: 'https://cdn.iconscout.com/icon/free/png-256/amazon-pay-569392.png' },
];
const WALLET_OPTIONS = [
  { name: 'Mobikwik', icon: 'https://cdn.iconscout.com/icon/free/png-256/mobikwik-569439.png' },
  { name: 'Airtel Payments Bank', icon: 'https://cdn.iconscout.com/icon/free/png-256/airtel-569391.png' },
  { name: 'Ola Money (Postpaid + Wallet)', icon: 'https://cdn.iconscout.com/icon/free/png-256/ola-569442.png' },
  { name: 'JioMoney', icon: 'https://cdn.iconscout.com/icon/free/png-256/jio-569425.png' },
];

const PaymentOptions = ({ appointmentId, amount, onPaymentSuccess, onClose }) => {
  const [paymentStep, setPaymentStep] = useState('gatewaySelection') // gatewaySelection, options, demoBank, success
  const [loadingXendit, setLoadingXendit] = useState(false)
  
  // States for Razorpay mock
  const [selectedTab, setSelectedTab] = useState('cards')
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [demoResult, setDemoResult] = useState(null)
  const [search, setSearch] = useState('')

  // --- Xendit Payment Handler ---
  const handleXenditPayment = async () => {
    setLoadingXendit(true)
    try {
      const token = localStorage.getItem('token')
      const backendUrl = import.meta.env.VITE_BACKEND_URL
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-xendit`,
        { appointmentId },
        { headers: { token } }
      )

      if (data.success && data.invoice?.invoice_url) {
        toast.success('Redirecting to Xendit for payment...')
        window.open(data.invoice.invoice_url, '_blank')
        onPaymentSuccess() // This will refresh the appointments list in the background
        onClose() // Close the modal
      } else {
        toast.error(data.message || 'Failed to create Xendit invoice.')
      }
    } catch (error) {
      console.error('Xendit payment error:', error)
      toast.error(error.response?.data?.message || 'An error occurred with Xendit payment.')
    } finally {
      setLoadingXendit(false)
    }
  }

  // --- Razorpay ---
  const handleProviderClick = (provider) => {
    setSelectedProvider(provider)
    setPaymentStep('demoBank')
  }
  const handleDemoResult = (result) => {
    setDemoResult(result)
    if (result === 'success') {
      setTimeout(() => {
        setPaymentStep('success')
        setTimeout(() => {
          onPaymentSuccess()
        }, 5000) // Wait 5s after showing payment successful
      }, 10000) // Wait 10s after clicking success
    } else {
      setTimeout(() => {
        setPaymentStep('options')
        setSelectedProvider(null)
        setDemoResult(null)
      }, 1500)
    }
  }

  const LeftPanel = () => (
    <div className="w-1/3 bg-[#1a237e] p-8 text-white flex flex-col justify-between relative">
      <div>
        <h2 className="text-xl font-semibold mb-6">Appointment Payment</h2>
        <div className="bg-white/10 p-4 rounded-lg">
          <p className="text-sm text-gray-300">Price Summary</p>
          <p className="text-3xl font-bold mt-1">₹{amount}</p>
        </div>
        <div className="bg-white/10 p-4 rounded-lg mt-4 flex justify-between items-center cursor-pointer">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            <span className="text-sm">Using as +91 86...</span>
          </div>
          <span className="text-xl">&gt;</span>
        </div>
      </div>
      <div className="absolute left-0 bottom-0 w-full p-4">
        <svg width="100%" height="100" viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-1.5,80.5L50.5,15L80,44.5L111,1.5L161.5,58.5V80.5H-1.5Z" fill="#FFF" fillOpacity="0.05"/>
        </svg>
        <div className="absolute left-8 bottom-8 text-xs text-white opacity-80 flex items-center">
          Secured by <img src="/src/assets/razorpay_logo.png" alt="Razorpay" className="h-4 ml-1" />
        </div>
      </div>
    </div>
  )

  const RightPanel = () => {
    if (paymentStep === 'demoBank') return <DemoBankPage />
    if (paymentStep === 'success') return <PaymentSuccessScreen />

    return (
      <div className="w-2/3 p-8 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <button className="text-gray-600 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <h3 className="text-lg font-semibold text-gray-700">Payment Options</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
        </div>
        <div className="flex-grow flex">
          <TabMenu />
          <TabContent />
        </div>
      </div>
    )
  }

  const TabMenu = () => (
    <div className="w-1/3 border-r border-gray-200">
      <TabButton id="cards" name="Cards" icons={['https://img.icons8.com/color/24/000000/visa.png', 'https://img.icons8.com/color/24/000000/mastercard-logo.png']} />
      <TabButton id="netbanking" name="Netbanking" icons={['https://img.icons8.com/color/24/000000/bank-building.png']} />
      <TabButton id="wallet" name="Wallet" icons={['https://img.icons8.com/color/24/000000/paytm.png', 'https://img.icons8.com/color/24/000000/phonepe.png']} />
      <TabButton id="paylater" name="Pay Later" icons={['https://img.icons8.com/color/24/000000/lazy-pay.png']} />
    </div>
  )

  const TabButton = ({ id, name, icons }) => (
    <div onClick={() => setSelectedTab(id)} className={`p-4 flex items-center cursor-pointer ${selectedTab === id ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
      {name}
      <span className="ml-auto flex">
        {icons.map(icon => <img src={icon} className="h-5 ml-1" alt="" />)}
      </span>
    </div>
  )

  const TabContent = () => {
    const components = {
      cards: <CardsUI />,
      netbanking: <NetbankingUI />,
      wallet: <WalletUI />,
      paylater: <PayLaterUI />,
    }
    return <div className="w-2/3 pl-8">{components[selectedTab]}</div>
  }

  const CardsUI = () => (
    <>
      <h4 className="text-md font-semibold text-gray-800 mb-4">Add a new card</h4>
      <div className="space-y-4">
        <input type="text" placeholder="Card Number" className="w-full p-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none" />
        <div className="flex space-x-4">
          <input type="text" placeholder="MM / YY" className="w-1/2 p-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none" />
          <input type="text" placeholder="CVV" className="w-1/2 p-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none" />
        </div>
        <div className="flex items-center">
          <input id="save-card" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
          <label htmlFor="save-card" className="ml-2 block text-sm text-gray-700">Save this card as per RBI guidelines</label>
        </div>
      </div>
      <button onClick={() => handleProviderClick({name: 'Card Payment', icon: 'https://img.icons8.com/color/48/000000/bank-card-back-side.png'})} className="w-full bg-slate-800 text-white font-bold py-3 px-4 rounded-md mt-8 hover:bg-slate-900">
        Continue
      </button>
    </>
  )

  const NetbankingUI = () => (
    <>
      <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search for Banks" className="w-full p-3 border border-gray-200 rounded-md mb-4 focus:ring-1 focus:ring-blue-500 outline-none" />
      <div className="mb-2 text-gray-500 font-semibold text-sm">Suggested Banks</div>
      <OptionList options={SUGGESTED_BANKS.filter(b => b.name.toLowerCase().includes(search.toLowerCase()))} />
      <div className="mt-4 mb-2 text-gray-500 font-semibold text-sm">All Banks</div>
      <div className="max-h-40 overflow-y-auto">
        <OptionList options={ALL_BANKS.filter(b => b.name.toLowerCase().includes(search.toLowerCase()))} />
      </div>
    </>
  )

  const WalletUI = () => <OptionList options={WALLET_OPTIONS} />
  const PayLaterUI = () => <OptionList options={PAY_LATER_OPTIONS} />

  const OptionList = ({ options }) => (
    <div className="rounded-lg border border-gray-100 divide-y divide-gray-100">
      {options.map((opt) => (
        <div key={opt.name} onClick={() => handleProviderClick(opt)} className="flex items-center justify-between p-3 hover:bg-blue-50 cursor-pointer">
          <div className="flex items-center">
            <img src={opt.icon} alt={opt.name} className="h-6 w-6 mr-3 object-contain" />
            <div>
              <div className="font-medium text-gray-800 text-sm">{opt.name}</div>
              {opt.sub && <div className="text-xs text-gray-500">{opt.sub}</div>}
            </div>
          </div>
          <span className="text-gray-400 text-xl">&gt;</span>
        </div>
      ))}
    </div>
  )

  const DemoBankPage = () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white p-8">
      <img src={selectedProvider?.icon} alt={selectedProvider?.name} className="h-12 mb-4 object-contain" />
      <h2 className="text-xl font-bold mb-2 text-center">Welcome to {selectedProvider?.name}</h2>
      <p className="text-gray-600 text-center mb-6">This is just a demo bank page.<br/>You can choose whether to make this payment successful or not.</p>
      <div className="flex gap-6">
        <button onClick={() => handleDemoResult('success')} className="bg-green-500 text-white px-8 py-2 rounded-md text-lg hover:bg-green-600">Success</button>
        <button onClick={() => handleDemoResult('failure')} className="bg-red-500 text-white px-8 py-2 rounded-md text-lg hover:bg-red-600">Failure</button>
      </div>
      {demoResult && <p className={`mt-6 font-bold text-lg ${demoResult === 'success' ? 'text-green-600' : 'text-red-600'}`}>Payment {demoResult}!</p>}
    </div>
  )

  const PaymentSuccessScreen = () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-green-500 text-white p-8 text-center">
      <p className="text-lg mb-2">You will be redirected in 5 seconds</p>
      <h1 className="text-3xl font-bold mb-4">Payment Successful</h1>
      <svg className="w-16 h-16 mb-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2l4-4"/></svg>
      <div className="bg-white text-gray-800 rounded-lg p-6 w-full max-w-sm shadow-xl">
        <div className="font-semibold flex justify-between">Appointment Payment <span>₹{amount}</span></div>
        <p className="text-xs text-gray-500 mt-2 text-left">Jun 30, 2025, 5:32 PM</p>
        <div className="mt-4 text-xs text-gray-400 text-left border-t pt-2">
          Visit razorpay.com/support for queries
        </div>
      </div>
    </div>
  )

  const GatewaySelectionUI = () => (
    <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl p-8">
      <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">Choose a Payment Method</h2>
      <div className="flex justify-center gap-8">
        <div onClick={() => setPaymentStep('options')} className="flex flex-col items-center justify-center p-6 border rounded-lg cursor-pointer hover:bg-gray-50 hover:shadow-xl transition-all w-64 h-48 text-center">
          <img src="/src/assets/razorpay_logo.png" alt="Razorpay" className="h-12 mb-4" />
          <span className="font-semibold text-lg text-gray-700">Razorpay</span>
        </div>
        <button
          onClick={handleXenditPayment}
          disabled={loadingXendit}
          className="flex flex-col items-center justify-center p-6 border rounded-lg cursor-pointer hover:bg-gray-50 hover:shadow-xl transition-all w-64 h-48 text-center disabled:opacity-50 disabled:cursor-wait"
        >
          {loadingXendit ? (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <span className="font-semibold text-lg text-gray-700">Processing...</span>
            </>
          ) : (
            <>
              <img src="https://www.xendit.co/wp-content/uploads/2021/03/xendit-logo.svg" alt="Xendit" className="h-10 mb-4" />
              <span className="font-semibold text-lg text-gray-700">Xendit</span>
            </>
          )}
        </button>
      </div>
      <div className="text-center mt-8">
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Cancel</button>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 font-sans">
      {paymentStep === 'gatewaySelection' ? (
        <GatewaySelectionUI />
      ) : (
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[600px] flex overflow-hidden">
          <LeftPanel />
          <RightPanel />
        </div>
      )}
    </div>
  )
}

export default PaymentOptions 
