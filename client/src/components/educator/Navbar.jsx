import React from 'react'
import { Link } from 'react-router-dom'; // ⬅️ FIX 1: Must import Link if you are using it
import { assets, dummyEducatorData } from '../../assets/assets'

// ⬅️ FIX 2: Corrected import. The Clerk hook is 'useUser', not 'userUser'.
import { UserButton, useUser } from '@clerk/clerk-react' 

const Navbar = () => {
    // ⬅️ FIX 3: Corrected hook usage. Call useUser() to get the user object.
    const { user } = useUser(); 
    
    // NOTE: dummyEducatorData is declared but not used inside the return, so it's fine.
    // const educatorData = dummyEducatorData; 

    return (
        <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3'>
            <Link to='/'>
                <img src={assets.logo} alt="logo" className='w-28 lg:w-32'/>
            </Link>
            
            <div className='flex items-center gap-5 text-gray-500 relative'>
                {/* Check if user is available. Clerk's useUser hook provides 'user' 
                  which may be null if loading or logged out.
                */}
                <p>Hi! {user ? user.fullName : 'Developers'}</p>
                
                {/* If user is logged in, show UserButton. 
                  Otherwise, show a placeholder profile image.
                */}
                {user ? <UserButton afterSignOutUrl='/' /> : <img className='max-w-8' src={assets.profile_img}/>}
            </div>
        </div>
    )
}

export default Navbar