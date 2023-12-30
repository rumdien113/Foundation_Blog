import React, { useState, useEffect } from 'react'
import axios from 'axios'
import HeaderAdmin from './HeaderAdmin'
import HeaderUser from './HeaderUser'

const Profile = () => {
    const [user, setUser] = useState({})
    const role = localStorage.getItem('role')

    useEffect(() => {
        fetchUser()
    }, [])

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/users/current', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setUser(response.data)
            console.log(user)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className='screen'>
            {role === 'Admin' ? <HeaderAdmin/> : <HeaderUser/>}
            <div className='px-12 bg-zinc-900 grid h-screen pt-20 font-mono'>
                
            </div>
        </div>
    )
}

export default Profile