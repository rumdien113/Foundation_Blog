import React, { useState } from 'react'
import axios from 'axios'

function Register() {
  
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    password_confirmation: '',
    phone: ''
  })

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (formData.password !== formData.password_confirmation) {
      console.log('Xác nhận mật khẩu không khớp')
      return
    }

    if (!formData.email || !formData.username || !formData.password || !formData.phone) {
      console.log('Vui lòng điền đầy đủ thông tin')
      return
    }

    axios
      .post('http://localhost:3000/api/users', { user: formData })
      .then((response) => {
        console.log(response.data)
        alert('Đăng ký thành công! Vui lòng đăng nhập.')
        window.location.href= '/login'
      })
      .catch((error) => {
        console.log(error.response.data)
      })
  }

  return (
    <section className='h-screen w-screen'>
      <div className='container h-full w-full mx-auto py-24 font-[inherit]'>
        <div className='gap-6 flex h-full flex-wrap items-center justify-center lg:justify-between'>
          {/* component left */}
          <div className='mb-12 md:mb-0 md:w-8/12 lg:w-6/12'>
            <img 
              src='https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp'
              alt='Sample image'
              className='w-full'
            />
          </div>
          {/* component right */}
          <div className='md:w-8/12 lg:ml-6 lg:w-5/12'>
            <form onSubmit={handleSubmit}>

              <div className='relative mb-6'>
                <span className='font-sans text-8xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500'>
                  Register
                </span>
              </div>

              <div className='mb-2'>
                <label htmlFor='username'
                  className = 'pointer-events-none left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:text-blue-800 peer-focus:bg-white peer-focus:px-1 peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[1.15rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary'
                >Username <span className='text-red-700'>*</span>
                </label>
                <input type = 'text' id = 'username' name = 'username' value={formData.username} onChange={handleInputChange}
                  className='peer mt-1 block w-full px-5 py-2 text-xl bg-white border border-slate-500 rounded-lg ease-linear shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none peer-focus-within:inline-block peer-focus-within:top-0 peer-focus-within:p-4'
                />
              </div>

              <div className='mb-2'>
                <label htmlFor='email'
                  className = 'pointer-events-none left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:text-blue-800 peer-focus:bg-white peer-focus:px-1 peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[1.15rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary'
                >Email <span className='text-red-700'>*</span>
                </label>
                <input type = 'text' id = 'email' name = 'email' value={formData.email} onChange={handleInputChange}
                  className='peer mt-1 block w-full px-5 py-2 text-xl bg-white border border-slate-500 rounded-lg ease-linear shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none peer-focus-within:inline-block peer-focus-within:top-0 peer-focus-within:p-4'
                />
              </div>

              <div className='mb-2'>
                <label htmlFor='password'
                  className = 'pointer-events-none left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:text-blue-800 peer-focus:bg-white peer-focus:px-1 peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[1.15rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary'
                >Password <span className='text-red-700'>*</span>
                </label>
                <input type = 'password' id = 'password' name = 'password' value={formData.password} onChange={handleInputChange}
                  className='peer mt-1 block w-full px-5 py-2 text-xl bg-white border border-slate-500 rounded-lg ease-linear shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none peer-focus-within:inline-block peer-focus-within:top-0 peer-focus-within:p-4'
                />
              </div>

              <div className='mb-2'>
                <label htmlFor='password_confirmation'
                  className = 'pointer-events-none left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:text-blue-800 peer-focus:bg-white peer-focus:px-1 peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[1.15rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary'
                >Confirm Password <span className='text-red-700'>*</span>
                </label>
                <input type = 'password' id = 'password_confirmation' name = 'password_confirmation' value={formData.password_confirmation} onChange={handleInputChange}
                  className='peer mt-1 block w-full px-5 py-2 text-xl bg-white border border-slate-500 rounded-lg ease-linear shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none peer-focus-within:inline-block peer-focus-within:top-0 peer-focus-within:p-4'
                />
              </div>

              <div className='mb-2'>
                <label htmlFor='phone'
                  className = 'pointer-events-none left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:text-blue-800 peer-focus:bg-white peer-focus:px-1 peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[1.15rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary'
                >Phone number <span className='text-red-700'>*</span>
                </label>
                <input type = 'text' id = 'phone' name = 'phone' value={formData.phone} onChange={handleInputChange}
                  className='peer mt-1 block w-full px-5 py-2 text-xl bg-white border border-slate-500 rounded-lg ease-linear shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none peer-focus-within:inline-block peer-focus-within:top-0 peer-focus-within:p-4'
                />
              </div>

              <button type='submit' className='relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 w-full overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800'>
                <span className='relative px-5 py-2 w-full transition-all text-xl ease-in duration-75 text-black hover:text-white bg-whiterounded-md group-hover:bg-opacity-0'>
                    Sign up
                </span>
              </button>

              <p className='mb-0 mt-2 pt-1 text-sm font-medium'>
              Have an account?
                <a href='/login' className='text-blue-500 transition duration-150 ease-in-out hover:text-blue-700 focus:text-blue-700 active:text-blue-700'> Login </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Register