import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const PostUpdateForm = ({ postId }) => {
  const [title, setTitle] = useState('');
  const [banner, setBanner] = useState(null);
  const [introduction, setIntroduction] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = () => {
    axios
      .get(`http://localhost:3000/api/posts/${postId}`)
      .then((response) => {
        const post = response.data;
        setTitle(post.title);
        setIntroduction(post.introduction);
        setContent(post.content);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleBannerChange = (event) => {
    setBanner(event.target.files[0]);
  };

  const handleIntroductionChange = (event) => {
    setIntroduction(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('banner', banner);
    formData.append('introduction', introduction);
    formData.append('content', content);
    const userId = localStorage.getItem('user_id');
    formData.append('user_id', userId);

    try {
      const response = await axios.put(`http://localhost:3000/api/posts/${postId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Updated post:', response.data);
      // Thực hiện các hành động sau khi cập nhật thành công (nếu có)
      window.location.reload();
    } catch (error) {
      console.log(error.response.data);
      alert('Vui lòng đăng nhập trước khi thực hiện bất cứ quy trình nào ');
      window.location.href= '/login';
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <h2 className='text-2xl font-bold mb-4'>Cập nhật bài viết</h2>
      <form onSubmit={handleSubmit}>
        <div className='form-field mb-6'>
          <label htmlFor='title' className='block mb-2 text-lg font-medium text-gray-900 dark:text-white'>Tiêu đề</label>
          <input type='text' id='title' name='title' value={title} onChange={handleTitleChange}
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
          />
        </div>
        <div className='form-field mb-6'>
          <label htmlFor='banner' className='block mb-2 text-lg font-medium text-gray-900 dark:text-white'>Banner</label>
          <input className="block w-full text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            type='file' id='banner' name='banner' accept='image/*' onChange={handleBannerChange}
          />
        </div>
        <div className='form-field mb-6'>
          <label htmlFor='introduction' className='block mb-2 text-lg font-medium text-gray-900 dark:text-white'>
            Giới thiệu
          </label>
          <textarea id='introduction' name='introduction' rows='3' value={introduction} onChange={handleIntroductionChange}
            className="block w-full text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          ></textarea>
        </div>
        <div className='form-field mb-6'>
          <label htmlFor='content' className='block mb-2 text-lg font-medium text-gray-900 dark:text-white'>Nội dung</label>
          <textarea id='content' name='content' rows='5' value={content} onChange={handleContentChange}
            className='block p-2.5 w-full text-base text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
          </textarea>
        </div>
        <button type='submit'
          className='inline-flex items-center mt-4 py-2.5 px-4 text-md font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800'
        >
          Cập nhật
        </button>
      </form>
    </div>
  );
};

PostUpdateForm.propTypes = {
  postId: PropTypes.number.isRequired,
};

export default PostUpdateForm;
