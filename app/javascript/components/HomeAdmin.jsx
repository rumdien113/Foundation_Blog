import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Header from './HeaderAdmin'

const HomeAdmin = () => {
  const [posts, setPosts] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const [newComment, setNewComment] = useState('')
  const [selectedComment, setSelectedComment] = useState(null)
  const [currentUserRole, setCurrentUserRole] = useState(null)
  const [users, setUsers] = useState({})
  
  useEffect(() => {
    fetchPosts()
    getCurrentUser()
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
  const handlePostClick = (post) => {
    setSelectedPost(post)
    fetchComments(post.id)
  }
  const fetchComments = (postId) => {
    axios
      .get(`http://localhost:3000/api/posts/${postId}/show_comments`)
      .then((response) => {
        const comments = response.data
        setSelectedPost((prevPost) => ({
          ...prevPost,
          comments: comments.map((comment) => ({
            ...comment,
            user: users[comment.user_id], // Lấy thông tin người dùng từ state users
          })),
        }))

        // Lấy danh sách user_ids từ các bình luận để lấy thông tin người dùng
        const user_ids = comments.map((comment) => comment.user_id)
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
                }))
              })
              .catch((error) => {
                console.log(error.response.data)
              })
          }
        })
      })
      .catch((error) => {
        console.log(error.response.data)
      })
  }
  const handleCommentChange = (event) => {
    setNewComment(event.target.value)
  }
  useEffect(() => {
    const role = localStorage.getItem('role')
    setCurrentUserRole(role)
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
    <div className='bg-zinc-900 h-full'>
      <Header/>
      <div className='w-9/12 mx-auto py-4 pt-20 font-mono'>
          {posts.map((post) => (
            <div key={post.id} className='mb-4 p-6 border border-gray-300 rounded'>
              <h3 className='text-3xl font-bold text-white' onClick={() => handlePostClick(post)}>{post.title}</h3>
              <p className='text-slate-400'>{post.introduction}</p>
              <p className='mt-4 text-white'>{post.content}</p>
              {post.banner && <img src={'http://localhost:3000' + post.banner.url} alt='Banner' className='mt-4 object-fill w-96' />}
              {selectedPost && selectedPost.id === post.id && (
                <>
                  <div className='mt-4'>
                    <h3 className='text-white'>Bình luận:</h3>
                    {selectedPost.comments ? (
                      selectedPost.comments.map((comment) => (
                        <div key={comment.id} onClick={() => handleCommentSelect(comment)}>
                          <p className='text-white'>
                            {comment.user && comment.user.username}: {comment.content}
                          </p>
                          {selectedComment && selectedComment.id === comment.id && (
                            <div className='w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600'>
                              <div className='px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800'>
                                  <textarea id='comment' rows='2' placeholder='Viết bình luận của bạn ở đây...' 
                                    value={selectedComment.content} 
                                    onChange={(e) => setSelectedComment({ ...selectedComment, content: e.target.value })}
                                    className='w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400'>
                                  </textarea>
                              </div>
                              <div class='flex flex-row items-center gap-4 px-3 py-2 mt-2 border-t dark:border-gray-600'>
                                  <button type='submit' onClick={() => handleCommentEdit(comment.id, selectedComment.content)}
                                    className='inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800'>
                                      Lưu
                                  </button>
                                  <button type='submit' onClick={() => handleDeleteClick(comment)}
                                    className='inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800'>
                                      Xóa
                                  </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p>Không có bình luận</p>
                    )}
                  </div>

                  <div className='w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600'>
                    <div className='px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800'>
                        <label htmlFor='comment' className='sr-only'>Your comment</label>
                        <textarea id='comment' rows='2' placeholder='Viết bình luận của bạn ở đây...' value={newComment} onChange={handleCommentChange}
                          className='w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400'></textarea>
                    </div>
                    <div class='flex items-center justify-between px-3 py-2 border-t dark:border-gray-600'>
                        <button type='submit' onClick={handleCommentSubmit}
                          className='inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800'>
                            Bình luận
                        </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
    </div> 
  )
}

export default HomeAdmin