import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import các thành phần cần thiết
import LoginForm from './LoginForm'; // Đường dẫn đến thành phần LoginForm
import Register from './Register'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} /> 
        <Route path="/register" element={<Register />} /> 
      </Routes>
    </Router>
  );
}

export default App;
