import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer className='bg-gray-900 md:px-36 text-left w-full mt-10'>
      <div className='flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30'>
<div className='flex flex-col md:items-start items-center w-full'>
  <img src= {assets.logo_dark} alt="logo"/>
  <p className='mt-6 text-center md:text-left text-sm text-white/80'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.</p>
</div>
<div className='flex flex-col md:items-start items-center w-full'>
  <h2 className='font-semibold text-white mb-5'>Company</h2>
  <ul className='flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2'>
    <li><a href="#">Home</a></li>
    <li><a href="#">About us</a></li>
    <li><a href="#">Contact us</a></li>
    <li><a href="#">Privacy policy</a></li>
    
  </ul>
</div>
<div className='flex flex-col items-center md:items-start w-full'>
  <h2 className='font-semibold text-white mb-5'>Subscribe to our newsletter</h2>
  <p className='text-sm text-white/80'>The latest news, articles, and resources, sent to your inbox weekly.</p>
  <div className='flex mt-3 gap-2 w-full'>
  <input 
    type="email" 
    placeholder='Enter your email' 
    className='flex-1 p-2 rounded-l border border-gray-300 text-white placeholder-white/60 bg-gray-800'
  />
  <button className='bg-blue-600 text-white px-4 rounded-r'>Subscribe</button>
</div>

</div>

      </div>
      <p className='py-4 text-center text-xs md:text-sm text-white/60'>Copyright 2025 @ Edemy. All Rights Reserved.</p>
    </footer>
  )
}

export default Footer
