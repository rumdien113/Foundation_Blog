import React, { useState } from 'react';
import axios from 'axios';
import Header from './Header';

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [banner, setBanner] = useState(null);
  const [introduction, setIntroduction] = useState('');
  const [content, setContent] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');

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
  
    // Lấy user_id từ localStorage
    const userId = localStorage.getItem('user_id');
    formData.append('user_id', userId);
  
    try {
      const response = await axios.post('http://localhost:3000/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const bannerUrl = 'http://localhost:3000' + response.data.bannerUrl;
      setBannerUrl(bannerUrl);
      console.log(bannerUrl);
      alert("Success! không có bug nhé");
    } catch (error) {
      console.log(error.response.data);
      alert(' Server lỗi rồi cu ơi :))');
      //window.location.href= '/login';
    }
  };
  

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Đăng bài viết</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="form-label">
              Tiêu đề
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              value={title}
              onChange={handleTitleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="banner" className="form-label">
              Banner
            </label>
            <input
              type="file"
              id="banner"
              name="banner"
              accept="image/*"
              onChange={handleBannerChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="introduction" className="form-label">
              Giới thiệu
            </label>
            <textarea
              id="introduction"
              name="introduction"
              rows="3"
              className="form-control"
              value={introduction}
              onChange={handleIntroductionChange}
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="form-label">
              Nội dung
            </label>
            <textarea
              id="content"
              name="content"
              rows="5"
              className="form-control"
              value={content}
              onChange={handleContentChange}
            ></textarea>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
          >
            Đăng bài
          </button>
        </form>
        {bannerUrl && (
          <div className="mt-4">
            <h3 className="text-lg font-bold">Banner đã tải lên:</h3>
            <img src={bannerUrl} alt="Banner" className="mt-2 img-fluid" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostForm;
