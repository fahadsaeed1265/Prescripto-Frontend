import React from 'react'
import { assets } from '../assets/assets/assets_frontend/assets'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
    const navigate=useNavigate()
    return (
        <div className='md:mx-10'>

            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            {/* leftsection */}

            <div>
                <img onClick={()=>navigate('/')} className='mb-5 w-40' src={assets.logo} alt="" />
                <p className='w-full md:2/3  text-gray-600 leading-6'>Prescripto makes healthcare simple by connecting patients with trusted doctors.
Book appointments easily, manage schedules, and access quality care anytime.
Your health, our priority.</p>
            </div>

            {/* centersection */}

            <div>
                <p className='text-xl font-medium mb-5'>
                    COMPANY
                </p>
                <ul className='flex flex-col gap-2  text-gray-600'>
                 <a href="/Home">
                  <li>Home</li>
                    
                    
                    </a>  
                    <a href="/About">
                    <li>About us</li>
                    
                    </a>

                    <a href="/Contact">
                    <li>Contact us</li>

                    </a>

                  
                </ul>
            </div>
            {/* rightsection */}

            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2  text-gray-600'>
                    <li>0318-64061-18</li>
                    <li>fahad.saeed525250@gmail.com</li>
                </ul>
            </div>

        </div>
        {/* horizanline for footer  */}
        <div>
<hr />
<p className='py-5 text-sm text-center'>Copyright © 2024 Fahad Saeed - All Right Reserved.</p>
        </div>
        </div>
    )
}

export default Footer