import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const [state, setState] = useState('Sign Up')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Patient')
  const navigate = useNavigate()

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      if (state === 'Sign Up') {
        const response = await fetch('https://localhost:7244/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            Name: name,
            email: email,
            password: password,
            role: role
          }),
        })
        const data = await response.json()
        if (!response.ok) {
          alert(data.message || 'Registration failed')
          return
        }
        alert('Account created! Please log in.')
        setState('Login')

      } else {
        const res = await fetch("https://localhost:7244/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const text = await res.text();

        if (!res.ok) {
          alert(text.replace(/"/g, ""));
          return;
        }

        const data = JSON.parse(text);
        localStorage.setItem('token', data.token)
        localStorage.setItem('role', data.role)
        localStorage.setItem('name', data.name)

        if (data.role === 'Doctor') {
          navigate('/doctor/dashboard')
        } else {
          navigate('/Doctors')
        }
      }
    } catch (err) {
      console.error(err)
      alert('Network error, try again.')
    }
  }

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>

      {/* ── Form Card ── */}
      <div className='bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md'
        style={{ margin: '40px 20px' }}>

        {/* Title */}
        <div className='text-center mb-6'>
          <div className='w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <span className='text-3xl'>🏥</span>
          </div>
          <h2 className='text-2xl font-bold text-gray-800'>
            {state === 'Sign Up' ? 'Create Account' : 'Welcome Back!'}
          </h2>
          <p className='text-gray-400 text-sm mt-1'>
            {state === 'Sign Up'
              ? 'Join us to book appointments easily'
              : 'Login to manage your appointments'}
          </p>
        </div>

        <form onSubmit={onSubmitHandler} className='flex flex-col gap-4'>

          {/* Name — Sign Up only */}
          {state === 'Sign Up' &&
            <div>
              <label className='text-sm font-medium text-gray-600 mb-1 block'>
                Full Name
              </label>
              <input
                className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all'
                type="text"
                placeholder='Enter your full name'
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </div>
          }

          {/* Email */}
          <div>
            <label className='text-sm font-medium text-gray-600 mb-1 block'>
              Email Address
            </label>
            <input
              className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all'
              type="email"
              placeholder='Enter your email'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className='text-sm font-medium text-gray-600 mb-1 block'>
              Password
            </label>
            <input
              className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all'
              type="password"
              placeholder='Enter your password'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>

          {/* Role Selection — Sign Up only */}
          {state === 'Sign Up' &&
            <div>
              <label className='text-sm font-medium text-gray-600 mb-2 block'>
                I am a:
              </label>
              <div className='flex gap-3'>

                <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all
                  ${role === 'Patient'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                  <input
                    type="radio" name="role" value="Patient"
                    checked={role === 'Patient'}
                    onChange={() => setRole('Patient')}
                    className='hidden'
                  />
                  <span>🤒</span>
                  <span className='text-sm font-medium'>Patient</span>
                </label>

                <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all
                  ${role === 'Doctor'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                  <input
                    type="radio" name="role" value="Doctor"
                    checked={role === 'Doctor'}
                    onChange={() => setRole('Doctor')}
                    className='hidden'
                  />
                  <span>👨‍⚕️</span>
                  <span className='text-sm font-medium'>Doctor</span>
                </label>

              </div>
            </div>
          }

          {/* Submit Button */}
          <button
            className='cursor-pointer w-full py-3 rounded-xl text-white font-medium text-sm mt-2 transition-all hover:opacity-90 hover:shadow-lg'
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
            {state === 'Sign Up' ? 'Create Account' : 'Login'}
          </button>

        </form>

        {/* Toggle Sign Up / Login */}
        <p className='text-center text-sm text-gray-400 mt-4'>
          {state === 'Sign Up'
            ? <>Already have an account?{' '}
                <span
                  onClick={() => setState('Login')}
                  className='text-indigo-500 font-medium cursor-pointer hover:underline'>
                  Login Here
                </span>
              </>
            : <>New here?{' '}
                <span
                  onClick={() => setState('Sign Up')}
                  className='text-indigo-500 font-medium cursor-pointer hover:underline'>
                  Sign Up Here
                </span>
              </>
          }
        </p>

      </div>
    </div>
  )
}

export default Login