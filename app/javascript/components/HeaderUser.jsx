import { useState } from 'react'
import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import home from '../../assets/images/home'
import write from '../../assets/images/write'
import logout from '../../assets/images/logout'

const Header = () => {
  const handleLogout = async () => {
    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }
    localStorage.removeItem('token')
      localStorage.removeItem('user_id')
      localStorage.removeItem('role')
      window.location.href = '/login'

    try {
      await axios.delete('http://localhost:3000/api/logout', { headers })
      
     
    } catch (error) {
      console.log(error.response.data)
    }
  }

  return (
    <nav className="bg-zinc-800 w-screen items-center">
      <div className="w-full flex relative">
        <div className="w-full" id="">
          <ul className="flex justify-center m-2 gap-40 text-white">
            <li className="p-2">
              <a className="" href="/homeuser">
                <img src={home} width={40} height={40} alt="Trang chu" />
              </a>
            </li>
            <li className="p-2">
              <a className="" href="/post">
                <img src={write} width={40} height={40} alt="Tao bai viet" />
              </a>
            </li>
          </ul>
        </div>
        <button onClick={handleLogout} className="absolute right-0 p-4">
          <img src={logout} width={40} height={40} alt="logout" />
        </button>
      </div>
    </nav>
  )
}

export default Header
