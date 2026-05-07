import React from 'react'
import Hero from '../../components/student/Hero'
import CoursesSection from '../../components/student/CoursesSection'
import TestimonialsSection from '../../components/student/TestimonialsSection'
import CalToAction from '../../components/student/CalToAction'
import LandingAuth from '../../components/student/LandingAuth'
import Footer from '../../components/student/Footer'
import { useAuth } from '../../context/AuthContext'

const Home = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className='flex flex-col items-center space-y-7 text-center'>
     <Hero/>
     <CoursesSection/>
     <TestimonialsSection/>
     {!isAuthenticated && <LandingAuth/>}
     <CalToAction/>
     <Footer/>
    </div>
  )
}

export default Home