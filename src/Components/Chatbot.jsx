import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const responses = {
  greetings: {
    patterns: ['hi', 'hello', 'hey', 'salam', 'assalam', 'good morning', 'good evening', 'good afternoon'],
    response: "Hello! 👋 Welcome to Prescripto. I'm your health assistant. How can I help you today?\n\nYou can ask me about:\n• Booking appointments\n• Finding doctors\n• Payments\n• Cancellations\n• Symptoms"
  },
  booking: {
    patterns: ['book', 'appointment', 'schedule', 'reserve', 'how to book', 'booking'],
    response: "📅 **To book an appointment:**\n\n1. Go to 'All Doctors' from the navbar\n2. Browse or filter by speciality\n3. Click on a doctor\n4. Select your preferred date & time slot\n5. Click 'Book an Appointment'\n\nMake sure you're logged in before booking!"
  },
  payment: {
    patterns: ['pay', 'payment', 'easypaisa', 'fee', 'fees', 'online payment', 'how to pay'],
    response: "💳 **How to pay:**\n\n1. Go to 'My Appointments' from your profile\n2. Find your booked appointment\n3. Click 'Pay Online' button\n4. Enter your Easypaisa number\n5. Confirm payment\n\nWe currently support **Easypaisa** payments. 📱"
  },
  cancel: {
    patterns: ['cancel', 'cancellation', 'delete appointment', 'remove appointment'],
    response: "❌ **To cancel an appointment:**\n\n1. Go to 'My Appointments'\n2. Find the appointment you want to cancel\n3. Click 'Cancel Appointment'\n4. Confirm the cancellation\n\n⚠️ Please cancel at least a few hours before your scheduled time."
  },
  doctors: {
    patterns: ['doctors', 'find doctor', 'available doctors', 'which doctor', 'doctor list', 'all doctors'],
    response: "👨‍⚕️ **Finding a doctor:**\n\nVisit 'All Doctors' from the navbar to browse our verified doctors. You can filter by speciality such as:\n\n• Neurologist\n• Cardiologist\n• Dermatologist\n• General Physician\n• Orthopedic\n• Gynecologist\n• Pediatrician\n• Psychiatrist\n• And more!"
  },
  register: {
    patterns: ['register', 'sign up', 'create account', 'new account', 'join', 'how to register'],
    response: "✅ **Creating an account:**\n\n1. Click 'Create Account' in the navbar\n2. Enter your full name, email & password\n3. Select your role (Patient or Doctor)\n4. Click 'Create Account'\n\nAlready have an account? Just click Login! 😊"
  },
  login: {
    patterns: ['login', 'log in', 'signin', 'sign in', 'cant login', 'forgot password'],
    response: "🔐 **To login:**\n\n1. Click 'Create Account' button in navbar\n2. Switch to 'Login' tab\n3. Enter your email & password\n4. Click Login\n\nIf you forgot your password, please contact our support. 📧"
  },
  profile: {
    patterns: ['profile', 'edit profile', 'update profile', 'change photo', 'my profile'],
    response: "👤 **Managing your profile:**\n\n1. Click your profile icon in navbar\n2. Select 'My Profile'\n3. Click 'Edit' button\n4. Update your details or photo\n5. Click 'Save Information'\n\nKeep your profile updated for better service! ✨"
  },
  doctor_register: {
    patterns: ['doctor register', 'register as doctor', 'join as doctor', 'doctor signup', 'i am a doctor'],
    response: "👨‍⚕️ **Joining as a Doctor:**\n\n1. Create an account and select 'Doctor' role\n2. Login to your doctor dashboard\n3. Fill in your profile details\n4. Submit for admin approval\n5. Once approved, patients can book with you!\n\n⏳ Approval usually takes 24 hours."
  },
  contact: {
    patterns: ['contact', 'support', 'help', 'email', 'phone', 'reach'],
    response: "📞 **Contact & Support:**\n\nVisit our **Contact** page from the navbar for full details.\n\nOur team is available to help you with any issues regarding bookings, payments, or technical problems. 💬"
  },
  about: {
    patterns: ['about', 'what is prescripto', 'tell me about', 'who are you', 'this app'],
    response: "🏥 **About Prescripto:**\n\nPrescripto is a modern doctor appointment booking platform that connects patients with verified doctors.\n\n✅ Verified doctors\n✅ Easy online booking\n✅ Easypaisa payments\n✅ Multiple specialities\n✅ Email confirmations\n\nOur mission is to make healthcare accessible for everyone! 💙"
  },

  // ── Symptoms ──────────────────────────────────────
  headache: {
    patterns: ['headache', 'head pain', 'migraine', 'head ache', 'head hurts'],
    response: "🤕 **Headache / Migraine:**\n\nYou should consult a **Neurologist**.\n\nCommon causes include stress, dehydration, or migraines. If headache is severe or frequent, please book an appointment soon.\n\n💡 Tip: Rest in a quiet dark room and stay hydrated.",
    specialist: 'Neurologist'
  },
  chest: {
    patterns: ['chest pain', 'heart pain', 'chest ache', 'heart beat', 'palpitation', 'shortness of breath'],
    response: "❤️ **Chest Pain / Heart Issues:**\n\nYou should consult a **Cardiologist**.\n\n⚠️ If chest pain is severe, please seek emergency help immediately!\n\n💡 Avoid stress and heavy physical activity until you see a doctor.",
    specialist: 'Cardiologist'
  },
  skin: {
    patterns: ['skin', 'rash', 'itching', 'acne', 'eczema', 'allergy', 'pimple', 'skin problem'],
    response: "🧴 **Skin Problems:**\n\nYou should consult a **Dermatologist**.\n\nSkin issues like rashes, acne, or eczema are very treatable. Early consultation leads to better results.\n\n💡 Avoid scratching and keep the area clean.",
    specialist: 'Dermatologist'
  },
  fever: {
    patterns: ['fever', 'temperature', 'flu', 'cold', 'cough', 'sore throat', 'runny nose', 'body ache'],
    response: "🌡️ **Fever / Flu / Cold:**\n\nYou should consult a **General Physician**.\n\nMost fevers and flu symptoms resolve in a few days with proper care.\n\n💡 Stay hydrated, rest well, and take paracetamol for fever.",
    specialist: 'General physician'
  },
  joint: {
    patterns: ['joint pain', 'knee pain', 'back pain', 'bone pain', 'arthritis', 'spine', 'muscle pain', 'shoulder pain'],
    response: "🦴 **Joint / Bone / Muscle Pain:**\n\nYou should consult an **Orthopedic** doctor.\n\nJoint and bone issues are very common and highly treatable with proper diagnosis.\n\n💡 Avoid putting strain on the affected area.",
    specialist: 'Orthopedic'
  },
  stomach: {
    patterns: ['stomach', 'abdomen', 'digestion', 'gastric', 'nausea', 'vomiting', 'diarrhea', 'constipation', 'stomach pain', 'acidity'],
    response: "🫁 **Stomach / Digestive Issues:**\n\nYou should consult a **Gastroenterologist**.\n\nDigestive issues are very common and usually easily treated.\n\n💡 Avoid spicy food and eat smaller meals more frequently.",
    specialist: 'Gastroenterologist'
  },
  eyes: {
    patterns: ['eye', 'vision', 'blurry vision', 'eye pain', 'eye infection', 'spectacles', 'glasses'],
    response: "👁️ **Eye Problems:**\n\nYou should consult an **Ophthalmologist** (Eye Specialist).\n\nEye problems should never be ignored as they can worsen quickly.\n\n💡 Avoid rubbing your eyes and reduce screen time.",
    specialist: 'Ophthalmologist'
  },
  mental: {
    patterns: ['anxiety', 'depression', 'stress', 'mental health', 'sleep', 'insomnia', 'panic', 'sad', 'mood'],
    response: "🧠 **Mental Health:**\n\nYou should consult a **Psychiatrist** or **Psychologist**.\n\nMental health is just as important as physical health. Seeking help is a sign of strength! 💪\n\n💡 Talk to someone you trust and practice deep breathing.",
    specialist: 'Psychiatrist'
  },
  child: {
    patterns: ['child', 'baby', 'infant', 'kid', 'children', 'pediatric', 'my son', 'my daughter'],
    response: "👶 **Child Health:**\n\nYou should consult a **Pediatrician**.\n\nChildren need specialized care. A pediatrician is trained specifically for child health issues.\n\n💡 Keep a record of your child's vaccination history.",
    specialist: 'Pediatrician'
  },
  women: {
    patterns: ['pregnancy', 'gynecology', 'periods', 'menstrual', 'women health', 'female', 'ovary', 'uterus'],
    response: "🌸 **Women's Health:**\n\nYou should consult a **Gynecologist**.\n\nRegular checkups are important for women's health at every stage of life.\n\n💡 Don't delay — early consultation always leads to better outcomes.",
    specialist: 'Gynecologist'
  },
  diabetes: {
    patterns: ['diabetes', 'sugar', 'insulin', 'thyroid', 'hormones', 'weight gain', 'weight loss'],
    response: "🩸 **Diabetes / Hormonal Issues:**\n\nYou should consult an **Endocrinologist**.\n\nDiabetes and thyroid conditions are very manageable with proper treatment.\n\n💡 Monitor your diet and maintain a healthy weight.",
    specialist: 'Endocrinologist'
  },
  teeth: {
    patterns: ['teeth', 'tooth', 'dental', 'gums', 'toothache', 'cavity', 'mouth'],
    response: "🦷 **Dental Problems:**\n\nYou should consult a **Dentist**.\n\nDental issues should not be ignored as they can affect overall health.\n\n💡 Brush twice a day and floss regularly.",
    specialist: 'Dentist'
  },
  ear: {
    patterns: ['ear', 'hearing', 'ear pain', 'nose', 'throat', 'tonsil', 'ent'],
    response: "👂 **Ear / Nose / Throat Issues:**\n\nYou should consult an **ENT Specialist**.\n\nEar, nose and throat problems are very common and easily treatable.\n\n💡 Avoid inserting objects into your ear.",
    specialist: 'ENT Specialist'
  },
  urinary: {
    patterns: ['urine', 'urinary', 'kidney', 'bladder', 'prostate', 'uti'],
    response: "🫘 **Urinary / Kidney Issues:**\n\nYou should consult a **Urologist** or **Nephrologist**.\n\nUrinary issues need prompt attention to prevent complications.\n\n💡 Drink plenty of water daily.",
    specialist: 'Urologist'
  },
  default: {
    response: "🤔 I'm not sure about that. Here's what I can help you with:\n\n• 📅 Booking appointments\n• 💳 Online payments\n• ❌ Cancellations\n• 👨‍⚕️ Finding doctors\n• 🤒 Symptom guidance\n• 👤 Profile management\n\nTry asking something like:\n'I have a headache'\n'How do I book an appointment?'\n'How do I pay online?'"
  }
}

const findResponse = (input) => {
  const lower = input.toLowerCase()
  for (const key in responses) {
    if (key === 'default') continue
    const item = responses[key]
    if (item.patterns && item.patterns.some(p => lower.includes(p))) {
      return item
    }
  }
  return responses.default
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: "👋 Hi! I'm Prescripto's health assistant.\n\nHow can I help you today? You can ask me about symptoms, booking appointments, payments, or anything about our platform!"
    }
  ])
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return

    const userMsg = { from: 'user', text: input }
    const matched = findResponse(input)

    const botMsg = {
      from: 'bot',
      text: matched.response,
      specialist: matched.specialist || null
    }

    setMessages(prev => [...prev, userMsg, botMsg])
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage()
  }

  return (
    <>
      {/* ── Floating Button ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl z-50 hover:bg-indigo-700 transition-all'>
        {isOpen ? '✕' : '💬'}
      </button>

      {/* ── Chat Window ── */}
      {isOpen && (
        <div className='fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200'
          style={{ height: '500px' }}>

          {/* Header */}
          <div className='bg-indigo-600 px-4 py-3 flex items-center gap-3'>
            <div className='w-9 h-9 bg-white rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm'>P</div>
            <div>
              <p className='text-white font-semibold text-sm'>Prescripto Assistant</p>
              <p className='text-indigo-200 text-xs'>Always here to help</p>
            </div>
            <div className='ml-auto w-2 h-2 bg-green-400 rounded-full'></div>
          </div>

          {/* Messages */}
          <div className='flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 bg-gray-50'>
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm whitespace-pre-line
                  ${msg.from === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-sm'
                    : 'bg-white text-gray-700 rounded-bl-sm shadow-sm border border-gray-100'
                  }`}>
                  {msg.text}
                  {/* Book button if specialist suggested */}
                  {msg.specialist && (
                    <button
                      onClick={() => { navigate(`/Doctors/${msg.specialist}`); setIsOpen(false) }}
                      className='mt-2 w-full bg-indigo-600 text-white py-1.5 rounded-lg text-xs hover:bg-indigo-700 transition-all'>
                      Book a {msg.specialist} →
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className='px-3 py-3 bg-white border-t border-gray-100 flex gap-2'>
            <input
              type='text'
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Type a message...'
              className='flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200'
            />
            <button
              onClick={sendMessage}
              className='bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-indigo-700 transition-all'>
              ➤
            </button>
          </div>

        </div>
      )}
    </>
  )
}

export default Chatbot