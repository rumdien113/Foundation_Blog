import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import axios from 'axios';
import Header from './Header';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addUser = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/users', {
        user: { username, email, password, phone, role },
      });
      console.log(response.data);
      fetchUsers();
      setUsername('');
      setEmail('');
      setPassword('');
      setPhone('');
      setRole('');
    } catch (error) {
      console.error(error);
    }
  };

  const editUser = async () => {
    try {
      if (selectedUser) {
        const response = await axios.patch(
          `http://localhost:3000/api/users/${selectedUser.id}`,
          { user: { username, email, phone, role } }
        );
        console.log(response.data);
        fetchUsers();
        setSelectedUser(null);
        setUsername('');
        setEmail('');
        setPassword('');
        setPhone('');
        setRole('');
      } else {
        // Hiển thị thông báo lỗi hoặc xử lý một cách phù hợp
      }
    } catch (error) {
      console.error(error);
    }
  };
  const deleteUser = async () => {
    try {
      if (selectedUser) {
        const response = await axios.delete(
          `http://localhost:3000/api/users/${selectedUser.id}`
        );
        console.log(response.data);
        fetchUsers();
        setSelectedUser(null);
        setUsername('');
        setEmail('');
        setPassword('');
        setPhone('');
        setRole('');
      } else {
        // Hiển thị thông báo lỗi hoặc xử lý một cách phù hợp
      }
    } catch (error) {
      console.error(error);
      alert("đăng nhập rồi hẵng xoá user nhớ đăng nhập là admin nhé");
      window.location.href = "/login"
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setUsername(user.username);
    setEmail(user.email);
    setPhone(user.phone);
    setRole(user.role);
  };

  return (
    <div className="container mx-auto p-4">
      <Header />
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="form-control mb-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control mb-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control mb-2"
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="form-control mb-2"
        />
        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="form-control mb-2"
        />
        {selectedUser ? (
          <>
            <button
              onClick={() =>
                editUser(selectedUser.id, { username, email, phone, role })
              }
              className="btn btn-primary"
            >
              Update User
            </button>
            <button
              onClick={() => deleteUser(selectedUser.id)}
              className="btn btn-danger ml-2"
            >
              Delete User
            </button>
          </>
        ) : (
          <button onClick={addUser} className="btn btn-success">
            Add User
          </button>
        )}
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              onClick={() => handleUserSelect(user)}
              className="pointer"
            >
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageUsers;