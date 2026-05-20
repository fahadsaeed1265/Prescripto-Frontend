import React from 'react'
import Header from '../Components/Header'
import Speciality from '../Components/SpecialityMenu'
import Topdoctors from '../Components/Topdoctors'
import Banner from '../Components/Banner'

const Home = () => {
  return (
    <div>
   <Header/>
   <Speciality/>
   <Topdoctors/>
   <Banner/>
    </div>
  )
}

export default Home