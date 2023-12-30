import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Header from './HeaderAdmin'

function ManageUsers() {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('')

  const resetForm = () => {
    setUsername('')
    setEmail('')
    setPassword('')
    setPhone('')
    setRole('')
  }
  useEffect(() => {
    fetchUsers()
  }, [])
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/users')
      setUsers(response.data)
    } catch (error) {
      console.error(error)
    }
  }
  const editUser = async () => {
    try {
      if (selectedUser) {
        const response = await axios.patch(
          `http://localhost:3000/api/users/${selectedUser.id}`,
          { user: { username, email, phone, role } }
        )
        console.log(response.data)
        fetchUsers()
        setSelectedUser(null)
        resetForm()
      }
    } catch (error) {
      console.error(error)
    }
  }
  const deleteUser = async () => {
    try {
      if (selectedUser) {
        const response = await axios.delete(
          `http://localhost:3000/api/users/${selectedUser.id}`
        )
        // console.log(response.data)
        fetchUsers()
        setSelectedUser(null)
        resetForm()
      } else {
        // Hiển thị thông báo lỗi hoặc xử lý một cách phù hợp
      }
    } catch (error) {
      console.error(error)
      alert('đăng nhập rồi hẵng xoá user nhớ đăng nhập là admin nhé')
      window.location.href = '/login'
    }
  }
  const handleUserSelect = (user) => {
    setSelectedUser(user)
    setUsername(user.username)
    setEmail(user.email)
    setPhone(user.phone)
    setRole(user.role)
  }

  return (
    <div>
      <Header />
      <div className='relative bg-zinc-900 h-screen pt-20 font-[inherit] px-4'>
        <h1 className='absolute text-4xl font-bold mb-8 left-10 text-white'>Quản lý người dùng</h1><br />
        <form>
          <div className='flex gap-x-4 text-lg mt-8'>
            <div>
              <label htmlFor='username' className='block font-medium text-white'>
                Username
              </label>
              <input 
                type='text'
                value={username}
                placeholder='Username'
                onChange={(e) => setUsername(e.target.value)}
                className='h-9 rounded-lg px-2'
              />
            </div>

            <div>
              <label htmlFor='email' className='block font-medium text-white'>
                Email
              </label>
              <input
                type='text'
                value={email}
                placeholder='Email'
                onChange={(e) => setEmail(e.target.value)}
                className='h-9 rounded-lg px-2'  
              />
            </div>

            <div>
              <label htmlFor='phone' className='block font-medium text-white'>
                Phone
              </label>
              <input
                type='text'
                value={phone}
                placeholder='Phone'
                onChange={(e) => setPhone(e.target.value)}
                className='h-9 rounded-lg px-2'  
              />
            </div>

            <div>
              <label htmlFor=' Role' className='block font-medium text-white'>
                Role
              </label>
              <input
                type='text'
                value={role}
                placeholder='Role'
                onChange={(e) => setRole(e.target.value)}
                className='h-9 rounded-lg px-2'  
              />
            </div>

            <div>
              <label></label><br/>
              <button
                type='submit'
                className='w-auto p-1 px-4  text-white rounded-lg bg-gradient-to-br from-purple-600 to-blue-500'
                onClick={() => editUser(selectedUser.id, { username, email, phone, role })}
              >
                Submit
              </button>
            </div>
          </div>
        </form>

        <table className='text-white mt-4 w-full border-2 border-white rounded'>
          <thead className='text-2xl'>
            <tr className=' border-2 border-white text-left'>
              <th className='px-4 py-2'>#</th>
              <th className='px-4 py-2'>Username</th>
              <th className='px-4 py-2'>Email</th>
              <th className='px-4 py-2'>Phone</th>
              <th className='px-4 py-2'>Role</th>
              <th className='px-4 py-2'>Action</th>
            </tr>
          </thead>
          <tbody className='text-xl font-normal'>
            {users.map((user) => (
              <tr key={user.id} className='even:bg-neutral-900 odd:bg-neutral-800'>
                <td className='px-4'>{user.id}</td>
                <td className='px-4'>{user.username}</td>
                <td className='px-4'>{user.email}</td>
                <td className='px-4'>{user.phone}</td>
                <td className='px-4'>{user.role}</td>
                <td className='px-4'>
                  <button
                    className='bg-green-500 hover:bg-green-700 text-white font-normal py-2 px-4 rounded-full my-1.5'
                    onClick={() => handleUserSelect(user)}
                  >
                    Edit
                  </button>
                  &ensp;
                  <button
                    className='bg-red-500 hover:bg-red-700 text-white font-normal py-2 px-4 rounded-full my-1.5'
                    onClick={() => deleteUser(selectedUser.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageUsers