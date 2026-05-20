import React, { useContext, useState } from 'react'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { data } from 'react-router-dom'

import { useNavigate } from 'react-router-dom'

// Inside your component
const navigate = useNavigate()


const login = () => {


    const [state, setState] = useState('Admin')

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { SetAToken, backednUrl } = useContext(AdminContext)
    //we declare the api for caling the data
//   20th aprill
  
 const onsubmithandler = async (event) => {
    event.preventDefault()

    try {
        if (state === 'Admin') {
            const { data } = await axios.post(
                backendUrl + '/api/admin/login',
                { email, password }
            )
            if (data.success) {
                localStorage.setItem("token", data.token)
                localStorage.setItem("role", "Admin")
                SetAToken(data.token)
                navigate('/admin/dashboard')
            } else {
                alert("Login failed")
            }

        } else {
            const { data } = await axios.post(
                backendUrl + '/api/auth/login',
                { email, password }
            )
            if (data.token) {
                localStorage.setItem("token", data.token)
                localStorage.setItem("role", "Doctor")
                localStorage.setItem("name", data.name)
                SetAToken(data.token)
                navigate('/doctor/dashboard')
            } else {
                alert("Invalid email or password")
            }
        }

    } catch (error) {
        console.error(error)
        alert("Something went wrong!")
    }
}
  
   }
   


    return (
        <form onSubmit={onsubmithandler} className='min-h-[80vh] flex items-center'>

            <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border-rounded-xl text-[#5e5e5e] text-sm shadow-lg'>
                <p className='text-2xl font-semibold m-auto'>
                    <span className='text-indigo-500'>{state}</span>
                    Login
                </p>
                <div className='w-full'>
                    <p >Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2' type="email " required />

                </div>
                <div className='w-full'>
                    <p>Password</p>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2' type="password" required />
                </div>
                <button className='bg-indigo-500 text-white w-full py-2 rounded-md text-base'>Login</button>
                {state === 'Admin'
                    ? <p>Doctor Login? <span className='text-indigo-500 cursor-pointer underline' onClick={() => setState('Doctor')}>Click Here</span></p>
                    : <p>Admin Login? <span className='text-indigo-500 cursor-pointer underline' onClick={() => setState('Admin')}>Click Here</span></p>
                }

            </div>
        </form>

    )


export default login