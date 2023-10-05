import { useState } from 'react';
import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';

const Header = () => {
  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('role');
      window.location.href = '/login';

    try {
      await axios.delete('http://localhost:3000/api/logout', { headers });
      
     
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-success">
      <div className="container">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link text-white" href="/homeuser">
                Trang chủ
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/comment">
                Xem bài viết
              </a>
            </li>
          </ul>
        </div>
        <button onClick={handleLogout} className="btn btn-light">
          Đăng xuất
        </button>
      </div>
    </nav>
  );
};

export default Header;
