import React, { useState } from 'react'
import axios from 'axios'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleInputChange = (event) => {
    const { name, value } = event.target

    if (name === 'email') {
      setEmail(value)
    } else if (name === 'password') {
      setPassword(value)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
  
    try {
      const response = await axios.post('http://localhost:3000/users/sign_in', {
        user: {
          email,
          password,
        },
      })
  
      const { role, user_id} = response.data
      localStorage.setItem('role', role)
      localStorage.setItem('user_id', user_id)
  
      if (role === 'Admin') {
        window.location.href = '/homeadmin'
      } else if (role === 'User') {
        window.location.href = '/homeuser'
      }
    } catch (error) {
      alert('Đăng nhập thất bại, vui lòng kiểm tra lại email hoặc password')
      console.log(error.response.data)
    }
  }

  return (
    <section className=''>
      <div className='font-[inherit]'>
        <div className='gap-6 flex h-full flex-wrap items-center justify-center lg:justify-between'>
          {/* component left */}
          <div className='mb-12 md:mb-0 md:w-8/12 lg:w-6/12'>
            <img 
              src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg" 
              alt="phone image"
              className='w-full'
            />
          </div>
          {/* component right */}
          <div className='md:w-8/12 lg:ml-6 lg:w-5/12'>
            <form onSubmit={handleSubmit}>
              {/* NAME */}
              <div className='relative mb-6'>
                <span className='font-sans text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500'>
                  Blogger
                </span>
              </div>
              {/* EMAIL INPUT */}
              <div className='form-field mb-6 font-medium'>
                <label 
                  htmlFor='email'
                  className = 'form-label pointer-events-none left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-blue-800 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:text-blue-800 peer-focus:bg-white peer-focus:px-1 peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[1.15rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:peer-focus:text-primary   '
                >Email
                </label>
                <input 
                  type = 'text' id = 'email' name = 'email' value={email} placeholder=' ' onChange={handleInputChange}
                  className='form-input peer mt-1 block w-full px-5 py-2 text-xl bg-white border border-slate-500 rounded-lg ease-linear shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none peer-focus-within:inline-block peer-focus-within:top-0 peer-focus-within:p-4'
                />
              </div>
              {/* PASSWORD INPUT */}
              <div className='form-field mb-6 font-medium'>
                <label 
                  htmlFor='password'
                  className = 'form-label pointer-events-none left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-blue-800 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:text-blue-800 peer-focus:bg-white peer-focus:px-1 peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[1.15rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-nonedark:peer-focus:text-primary'
                >Password
                </label>
                <input 
                  type = 'password' id = 'password' name = 'password' value={password} placeholder=' ' onChange={handleInputChange}
                  className='form-input peer mt-1 block w-full px-5 py-2 text-xl bg-white border border-slate-500 rounded-lg ease-linear shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none peer-focus-within:inline-block peer-focus-within:top-0 peer-focus-within:p-4'
                />
              </div>
              {/* SUBMIT BUTTON */}
              <button type='submit' className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 w-full overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                <span className="relative px-5 py-2 w-full transition-all text-xl ease-in duration-75 text-black hover:text-white bg-white bg-gray-900 rounded-md group-hover:bg-opacity-0">
                    Sign in
                </span>
              </button>

              <p className="mb-0 mt-2 pt-1 text-sm font-medium">
                Don't have an account?
                <a href="/register" className="text-blue-500 transition duration-150 ease-in-out hover:text-blue-700 focus:text-blue-700 active:text-blue-700"> Register </a>
              </p>

              <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
                <p className="mx-4 mb-0 text-center font-semibold dark:text-neutral-600">
                  OR
                </p>
              </div>

            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LoginForm  