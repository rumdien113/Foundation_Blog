import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeaderAdmin from './Header';
import HeaderUser from './HeaderUser';

const PostDetail = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [selectedComment, setSelectedComment] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [users, setUsers] = useState({}); // Khai báo state users để lưu thông tin người dùng

  useEffect(() => {
    fetchPosts();
    getCurrentUser();
  }, []);

  const fetchPosts = () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    axios
      .get('http://localhost:3000/api/posts', { headers })
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:3000/api/users/current', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setCurrentUser(response.data);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    fetchComments(post.id);
  };

  const fetchComments = (postId) => {
    axios
      .get(`http://localhost:3000/api/posts/${postId}/show_comments`)
      .then((response) => {
        const comments = response.data;
        setSelectedPost((prevPost) => ({
          ...prevPost,
          comments: comments.map((comment) => ({
            ...comment,
            user: users[comment.user_id], // Lấy thông tin người dùng từ state users
          })),
        }));

        // Lấy danh sách user_ids từ các bình luận để lấy thông tin người dùng
        const user_ids = comments.map((comment) => comment.user_id);
        // Lấy thông tin người dùng từ API hoặc từ dữ liệu hiện có (nếu đã có)
        // Ví dụ: lấy thông tin người dùng từ API
        user_ids.forEach((user_id) => {
          if (!users[user_id]) {
            axios
              .get(`http://localhost:3000/api/users/${user_id}`)
              .then((response) => {
                setUsers((prevUsers) => ({
                  ...prevUsers,
                  [user_id]: response.data, // Lưu thông tin người dùng vào state users
                }));
              })
              .catch((error) => {
                console.log(error.response.data);
              });
          }
        });
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    setCurrentUserRole(role);
  }, []);

  const handleCommentSubmit = () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    axios
      .post(
        `http://localhost:3000/api/comments`,
        {
          comment: {
            content: newComment,
            post_id: selectedPost.id,
          },
        },
        { headers }
      )
      .then((response) => {
        console.log(response.data);
        setNewComment('');
        fetchComments(selectedPost.id);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  const handleCommentSelect = (comment) => {
    setSelectedComment(comment);
  };

  const handleCommentEdit = (commentId, newContent) => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    axios
      .put(
        `http://localhost:3000/api/comments/${commentId}`,
        {
          comment: {
            content: newContent,
          },
        },
        { headers }
      )
      .then((response) => {
        console.log(response.data);
        setSelectedPost((prevPost) => {
          const updatedComments = prevPost.comments.map((comment) => {
            if (comment.id === commentId) {
              comment.content = newContent;
            }
            return comment;
          });

          return {
            ...prevPost,
            comments: updatedComments,
          };
        });

        setSelectedComment(null);
      })
      .catch((error) => {
        console.log(error.response.data);
        alert("có phải của mình đâu mà sửa hả cậu?")
      });
  };

  const handleDeleteClick = (comment) => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    axios
      .delete(`http://localhost:3000/api/comments/${comment.id}`, {
        headers,
      })
      .then((response) => {
        console.log(response.data);
        alert('Đã xoá bình luận thành công');
        setSelectedPost((prevPost) => {
          const updatedComments = prevPost.comments.filter((c) => c.id !== comment.id);
          return {
            ...prevPost,
            comments: updatedComments,
          };
        });
      })
      .catch((error) => {
        console.log(error.response.data);
        alert("Không phải của mình đừng xoá");
      });
  };

  return (
    <div>
      {currentUserRole === 'Admin' ? <HeaderAdmin /> : <HeaderUser />}
      {currentUserRole === 'Admin' ? <div>Đang xem ở chế độ admin</div> : <div>Đang xem ở chế độ user</div>}
      <div className="container py-4">
        <div className="max-w-md mx-auto p-4">
          {posts.map((post) => (
            <div key={post.id} className="mb-4 p-4 border border-gray-300 rounded">
              <h3 className="text-lg font-bold" onClick={() => handlePostClick(post)}>
                {post.title}
              </h3>
              <p className="text-gray-600">{post.introduction}</p>
              {post.banner && <img src={'http://localhost:3000' + post.banner.url} alt="Banner" className="mt-4" />}
              {selectedPost && selectedPost.id === post.id && (
                <>
                  <p className="mt-4">{post.content}</p>
                  <div>
                    <h3>Bình luận:</h3>
                    {selectedPost.comments ? (
                      selectedPost.comments.map((comment) => (
                        <div key={comment.id} onClick={() => handleCommentSelect(comment)}>
                          <p>
                            {comment.user && comment.user.username}: {comment.content}
                          </p>
                          {selectedComment && selectedComment.id === comment.id && (
                            <div>
                              <textarea
                                value={selectedComment.content}
                                onChange={(e) => setSelectedComment({ ...selectedComment, content: e.target.value })}
                                className="form-control mb-2"
                              />
                              <button onClick={() => handleCommentEdit(comment.id, selectedComment.content)} className="btn btn-success me-2">
                                Lưu
                              </button>
                              <button onClick={() => handleDeleteClick(comment)} className="btn btn-danger">
                                Xoá
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p>Không có bình luận</p>
                    )}
                  </div>
                  <div>
                    <textarea value={newComment} onChange={handleCommentChange} className="form-control mb-2" />
                    <button onClick={handleCommentSubmit} className="btn btn-primary">
                      Gửi bình luận
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
