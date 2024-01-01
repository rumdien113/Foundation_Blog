import React, { useEffect, useState } from 'react';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const pathname = window.location.pathname; // Lấy đường dẫn URL hiện tại
    const segments = pathname.split('/'); // Tách đường dẫn thành mảng các phần từ

    // Lấy id từ phần tử cuối cùng trong mảng
    const userId = segments[segments.length - 1];

    if (userId) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`/api/users/profile/${userId}`);
          const data = await response.json();
          setUserData(data); // Lưu thông tin người dùng vào state
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
    }
  }, []);

  return (
    <div className="container">
      <h1>User Profile</h1>
      {userData ? (
        <div className="user-profile">
          <img src={userData.avatar} alt="Avatar" />
          <h2>{userData.username}</h2>
          <p>Email: {userData.email}</p>
          <p>Phone: {userData.phone}</p>
          {/* Hiển thị các thông tin khác của người dùng */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserProfile;
