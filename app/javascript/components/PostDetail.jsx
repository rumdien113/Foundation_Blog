import React, { useState, useEffect } from 'react'
import axios from 'axios'
import HeaderAdmin from './HeaderAdmin'
import HeaderUser from './HeaderUser'

const PostDetail = () => {
  const [posts, setPosts] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const [newComment, setNewComment] = useState('')
  const [selectedComment, setSelectedComment] = useState(null)
  const [currentUserRole, setCurrentUserRole] = useState(null)
  const [users, setUsers] = useState({}) 
  // Khai báo state users để lưu thông tin người dùng

  const role = localStorage.getItem('role')

  useEffect(() => {
    fetchPosts()
    getCurrentUser()
    fetchComments(selectedPost.id)
  }, [])
  const fetchPosts = () => {
    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    axios
      .get('http://localhost:3000/api/posts', { headers })
      .then((response) => {
        setPosts(response.data)
      })
      .catch((error) => {
        console.log(error.response.data)
      })
  }
  const getCurrentUser = () => {
    const token = localStorage.getItem('token')
    if (token) {
      axios
        .get('http://localhost:3000/api/users/current', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setCurrentUser(response.data)
        })
        .catch((error) => {
          console.log(error.response.data)
        })
    }
  }
  const fetchComments = (postId) => {
    axios
      .get(`http://localhost:3000/posts/${postId}/comments`)
      .then(response => {
        setSelectedPost(prevPost => ({
          ...prevPost,
          comments: response.data
        }))
      })
  }
  const handlePostClick = (post) => {
    setSelectedPost(post)
    fetchComments(post.id)
  }
  const handleCommentChange = (event) => {
    setNewComment(event.target.value)
  }
  useEffect(() => {
    const role = localStorage.getItem('role')
    setCurrentUserRole(role)
    fetchComments(selectedPost.id)
  }, [])
  const handleCommentSubmit = () => {
    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }
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
        console.log(response.data)
        setNewComment('')
        fetchComments(selectedPost.id)
      })
      .catch((error) => {
        console.log(error.response.data)
      })
  }
  const handleCommentSelect = (comment) => {
    setSelectedComment(comment)
  }
  const handleCommentEdit = (commentId, newContent) => {
    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

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
        console.log(response.data)
        setSelectedPost((prevPost) => {
          const updatedComments = prevPost.comments.map((comment) => {
            if (comment.id === commentId) {
              comment.content = newContent
            }
            return comment
          })

          return {
            ...prevPost,
            comments: updatedComments,
          }
        })

        setSelectedComment(null)
      })
      .catch((error) => {
        console.log(error.response.data)
        alert('có phải của mình đâu mà sửa hả cậu?')
      })
  }
  const handleDeleteClick = (comment) => {
    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    axios
      .delete(`http://localhost:3000/api/comments/${comment.id}`, {
        headers,
      })
      .then((response) => {
        console.log(response.data)
        alert('Đã xoá bình luận thành công')
        setSelectedPost((prevPost) => {
          const updatedComments = prevPost.comments.filter((c) => c.id !== comment.id)
          return {
            ...prevPost,
            comments: updatedComments,
          }
        })
      })
      .catch((error) => {
        console.log(error.response.data)
        alert('Không phải của mình đừng xoá')
      })
  }

  return (
    <div>
      {role === 'Admin' ? <HeaderAdmin /> : <HeaderUser />}
      <div className='container py-4 pt-20 font-mono'>
        <div className='max-w-md mx-auto p-4'>
          {posts.map((post) => (
            <div key={post.id}  onClick={() => handlePostClick(post)} className='mb-4 p-4 border border-gray-300 rounded'>
              <div className='d-flex justify-content-between'>
                <h3 className='text-lg font-bold'>
                  {post.title}
                </h3>
                <small>{post.createdAt}</small>
              </div>
              <p className='text-gray-600'>{post.introduction}</p>
              {post.banner && <img src={'http://localhost:3000' + post.banner.url} alt='Banner' className='mt-4' />}
              {selectedPost && selectedPost.id === post.id && (
                <div>
                  <h3>Bình luận:</h3>
                  {selectedPost.comments ? (
                    selectedPost.comments.map((comment) => (
                      <div key={comment.id}>
                        <p>
                          {comment.username}: {comment.content}
                        </p>
                        {comment.isEdited && (
                          <small>Đã sửa</small>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>Không có bình luận</p>
                  )}
                  <div>
                    <textarea
                      value={newComment}
                      onChange={handleCommentChange}
                      className='form-control mb-2'
                    />
                    <button onClick={handleCommentSubmit} className='btn btn-primary'>
                      Gửi bình luận
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PostDetail
