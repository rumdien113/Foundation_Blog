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
      alert("Vui lòng đăng nhập trước khi thực hiện bất cứ quy trình nào ");
      window.location.href= '/login';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Cập nhật bài viết</h2>
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
