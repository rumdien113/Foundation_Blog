import React, { useState } from 'react'
import axios from 'axios'
import HeaderAdmin from './HeaderAdmin'
import HeaderUser from './HeaderUser'

const PostForm = () => {
  const [title, setTitle] = useState('')
  const [banner, setBanner] = useState(null)
  const [introduction, setIntroduction] = useState('')
  const [content, setContent] = useState('')
  const [bannerUrl, setBannerUrl] = useState('')
  
  const role = localStorage.getItem('role')

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleBannerChange = (event) => {
    setBanner(event.target.files[0])
  }

  const handleIntroductionChange = (event) => {
    setIntroduction(event.target.value)
  }

  const handleContentChange = (event) => {
    setContent(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
  
    const formData = new FormData()
    formData.append('title', title)
    formData.append('banner', banner)
    formData.append('introduction', introduction)
    formData.append('content', content)
  
    // // Lấy user_id từ localStorage
    // const userId = localStorage.getItem('user_id')
    // formData.append('user_id', userId)
  
    try {
      const response = await axios.post('http://localhost:3000/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      const bannerUrl = 'http://localhost:3000' + response.data.bannerUrl
      setBannerUrl(bannerUrl)
      console.log(bannerUrl)
      alert('Success! không có bug nhé')
    } catch (error) {
      console.log(error.response.data)
      alert(' Server lỗi rồi cu ơi :))')
      //window.location.href= '/login'
    }
  }
  
  return (
    <div>
      {role === 'Admin' ? <HeaderAdmin/> : <HeaderUser/>}
      <div className='pl-96 pr-96 bg-zinc-900 grid h-full h-screen pt-20 font-mono'>
        <h2 className='block mb-2 text-4xl font-medium text-gray-900 dark:text-white'>Đăng bài viết</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-field mb-6'>
            <label htmlFor='title' className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Tiêu đề</label>
            <input type='text' id = 'title' name = 'title' value={title} onChange={handleTitleChange} placeholder='Nhập tiêu đề bài viết'
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            />
          </div>
    
          <div className='form-field mb-6'>
            <label htmlFor='banner' className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Upload file image</label>
            <input className="block w-full text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              type = 'file' id = 'banner' name = 'banner' accept='image/*' placeholder='' onChange={handleBannerChange}
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG or GIF</p>
          </div>

          <div className='mb-4'>
            <label htmlFor='introduction' className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Giới thiệu</label>
            <textarea id='introduction' name='introduction' rows='2' placeholder='Write your thoughts here...' onChange={handleIntroductionChange}
              className='block p-2.5 w-full text-base text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
            </textarea>
          </div>

          <div className='mb-4'>
            <label htmlFor='content' className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Nội dung</label>
            <textarea id='content' name='content' rows='4' placeholder='Write your thoughts here...' value={content} onChange={handleContentChange}
              className='block p-2.5 w-full text-base text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
            </textarea>
          </div>
          
          <button type='submit' className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
            <span className="relative text-lg px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Đăng bài
            </span>
          </button>
        </form>
        {bannerUrl && (
          <div className='mt-4'>
            <h3 className='text-lg font-bold'>Banner đã tải lên:</h3>
            <img src={bannerUrl} alt='Banner' className='mt-2 img-fluid' />
          </div>
        )}
      </div>
    </div>
  )
}

export default PostForm