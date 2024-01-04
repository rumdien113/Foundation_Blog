import React from 'react'
import axios from 'axios'
import home from '../../assets/images/home'
import write from '../../assets/images/write'
import profile from '../../assets/images/profile'
import logout from '../../assets/images/logout'

const Header = () => {
  const handleLogout = async () => {
    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }
    
    try {
      await axios.delete('http://localhost:3000/api/logout', { headers })
      localStorage.removeItem('token')
      localStorage.removeItem('user_id')
      localStorage.removeItem('role')
      window.location.href = '/login'
    } catch (error) {
      console.log(error.response.data)
    }
  }

  return (
    <nav className='bg-zinc-800 w-full items-center border-b-2 t-0 z-10 fixed'>
      <div className='w-full flex relative'>
        <div className='w-full' id=''>
          <ul className='flex justify-center m-2 gap-10 md:gap-20 lg:gap-40 text-white text-xl'>
            <li className='p-2'>
              <a className='' href='/homeuser'>
                <img src={home} width={25} height={25} alt='Trang chu' />
              </a>
            </li>
            <li className='p-2'>
              <a className='' href='/postform'>
                <img src={write} width={25} height={25} alt='Tao bai viet' />
              </a>
            </li>
            <li className='p-2'>
              <a className='' href='/profile'>
                <img src={profile} width={25} height={25} alt='Chat bot' />
              </a>
            </li>
          </ul>
        </div>
        <button onClick={handleLogout} className='absolute right-4 p-4'>
          <img src={logout} width={25} height={25} alt='logout' />
        </button>
      </div>
    </nav>
  )
}

export default Header
