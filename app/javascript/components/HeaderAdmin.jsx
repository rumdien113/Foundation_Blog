import React, { useState } from 'react'
import axios from 'axios'
import home from '../../assets/images/home'
import write from '../../assets/images/write'
import userManage from '../../assets/images/user_manage'
import postManage from '../../assets/images/post_manage'
import profile from '../../assets/images/profile'
import logout from '../../assets/images/logout'
import home_choose from '../../assets/images/home_choose'
import write_choose from '../../assets/images/write_choose'
import userManage_choose from '../../assets/images/user_manage_choose'
import postManage_choose from '../../assets/images/post_manage_choose'

const HeaderAdmin = () => {
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
          <ul className='flex justify-center m-2 gap-40 text-white'>
            <li className='p-2'>
              <a href='/homeadmin'>
                <img src={home} width={25} height={25} alt='Trang chu' />
              </a>
            </li>
            <li className='p-2'>
              <a href='/postform'>
                <img src={write} width={25} height={25} alt='Tao bai viet' />
              </a>
            </li>
            <li className='p-2'>
              <a href='/manageuser'>
                <img src={userManage} width={25} height={25} alt='Quan li nguoi dung' />
              </a>
            </li>
            <li className='p-2'>
              <a href='/listpost'>
              <img src={postManage} width={25} height={25} alt='Quan li bai viet' />
              </a>
            </li>
            <li className='p-2'>
              <a className='' href='/profile'>
                <img src={profile} width={25} height={25} alt='Chat bot' />
              </a>
            </li>
            <li>
              <button onClick={handleLogout} className='fixed p-2 right-4'>
                <img src={logout} width={25} height={25} alt='logout' />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default HeaderAdmin
