import React from 'react'
import axios from 'axios'
import HeaderAdmin from './HeaderAdmin'
import HeaderUser from './HeaderUser'
import arrow from '../../assets/images/arrow'

const ChatForm = () => {
    const role = localStorage.getItem('role')

    const handleSubmit = async (e) => {

    }

    return (
        <div className='screen'>
            {role === 'Admin' ? <HeaderAdmin/> : <HeaderUser/>}
            <div className='px-12 bg-zinc-900 grid h-screen pt-20 font-mono'>
                <h1 className='text-3xl font-bold text-white text-center'>Chat bot</h1>
                <div className='w-full relative'>
                    {/* get the chat of the client and server */}
                    <form onSubmit={handleSubmit} className='absolute flex bottom-2 p-2 p-2 justify-center mt-auto w-full px-10'>
                        <div className='relative w-9/12'>
                            <input 
                                type = 'text' id = 'message' placeholder='Nhập tin nhắn...'
                                className='block form-input peer mt-1 block w-full px-5 py-2 text-xl bg-white border border-slate-500 rounded-lg ease-linear shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 bg-slate-50 text-slate-500 border-slate-200 shadow-none'
                            />
                            <button type='submit' className='absolute end-2 bottom-[3px]'>
                                <img src={arrow} alt='submit' width={40} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ChatForm