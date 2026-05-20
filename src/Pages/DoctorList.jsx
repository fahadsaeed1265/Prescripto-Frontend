import React, { useContext, useEffect } from 'react'
import { AppContext } from '../Context/Appcontext'




const DoctorList = () => {

    const {doctors,aToken,getAllDoctors} =useContext(AppContext)

useEffect(()=>{
    if(aToken){
        getAllDoctors()
    }
},[aToken] )


  return (







    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
        <h1 className='text-lg font-medium'>All Doctors</h1>

<div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
    {
        doctors.map((item,Index)=>(
            <div className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden coursor-pointer group' key={Index}>

                <img className='bg-indigo-50 group-hover:bg-indigo-500 transition-all duration-500' src={item.image} alt="" />


                <div className='p-4'>
                    <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
                    <p className='text-zinc-600 text-sm'>{item.speciality}</p>
                    <div className='mt-2 flex items-center  gap-1 text-sm'>
                        <input type="checkbox" checked={item.avilable}  />
                        <p>Available </p>
                    </div>
                </div>
                </div>
        ))
    }
</div>

    </div>

  )
}

export default DoctorList