import { useState } from 'react';
import React from 'react';
import axios from 'axios';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/users/sign_in', {
        user: {
          email,
          password,
        },
      });

      const { role, user_id } = response.data;
      localStorage.setItem('role', role);
      localStorage.setItem('user_id', user_id);
      if (role === 'Admin') {
        window.location.href = '/homeadmin';
      } else if (role === 'User') {
        window.location.href = '/homeuser';
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <div className="">
      <div className="card p-4 w-150 min-w-md">
        <h2 className="text-center font-weight-bold mb-4">Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="form-label mb-2 font-weight-bold">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              className="form-control"
              value={email}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label mb-2 font-weight-bold">Mật khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={password}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Đăng nhập
          </button>
        </form>
        <p className="mt-3">
          Chưa có tài khoản? <a href="/register">Đăng ký</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
