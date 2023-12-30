import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Header from './HeaderUser'
import { IoClose } from 'react-icons/io5'

const HomeUser = () => {
  const [posts, setPosts] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const [newComment, setNewComment] = useState('')
  const [selectedComment, setSelectedComment] = useState(null)
  const [currentUserRole, setCurrentUserRole] = useState(null)
  const [users, setUsers] = useState({}) // Khai báo state users để lưu thông tin người dùng
  const [isOpen, setIsOpen] = useState(false)

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
    console.log(selectedPost)
    fetchComments(post.id)
    setIsOpen(!isOpen)
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
      <Header />
      <div className='w-6/12 mx-auto py-4 pt-20 font-mono'>
        {[...posts].reverse().map((post) => (
          <div
            key={post.id}
            className='mb-4 p-6 border border-gray-300 rounded'
            onClick={() => handlePostClick(post)}
          >
            <h3 className='text-3xl font-bold text-white'>{post.title}</h3>
            <p className='text-slate-400'>{post.introduction}</p>
            <p className='mt-4 text-white'>{post.content}</p>
            {post.banner && <img src={'http://localhost:3000' + post.banner.url} alt='Banner' className='mt-4 w-full' />}
          </div>
        ))}
        {isOpen && selectedPost && (
          <div className='fixed top-0 bottom-0 left-0 right-0 pt-14 z-100 bg-black'>
            <div className='flex flex-row relative'>
              <IoClose 
                onClick={() => setIsOpen(!isOpen)}
                className='absolute text-white items-center justify-center text-4xl z-30' />
              {/* image */}
              <div className='flex items-center justify-center w-8/12 h-dvh'>
                {selectedPost.banner && 
                  <img 
                    src={'http://localhost:3000' + selectedPost.banner.url}
                    alt='Banner' 
                    className='w-full h-full object-contain items-center justify-center' 
                  />
                }
              </div>
              {/* title */}
              <div className='p-4 w-4/12 h-screen bg-[#242526] border-b-1'>
                <h3 className='text-3xl font-bold text-white'>{selectedPost.title}</h3>
                <p className='text-slate-400'>{selectedPost.introduction}</p>
                <p className='mt-4 text-white'>{selectedPost.content}</p>
              </div>
              {/* comment */}
              {/* <div className='w-4/12 h-screen bg-[#242526]'>
                <div className='flex flex-col justify-between h-full'>
                  <div className='overflow-y-auto'>
                    {selectedPost.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className='mb-4 p-6 border border-gray-300 rounded'
                        onClick={() => handleCommentSelect(comment)}
                      >
                        <p className='text-white'>{comment.content}</p>
                        <p className='text-slate-400'>{comment.user && comment.user.name}</p>
                      </div>
                    ))}
                  </div>
                  <div className='flex flex-col justify-center items-center'>
                    <textarea
                      className='w-10/12 h-20 p-4 border border-gray-300 rounded'
                      placeholder='Viết bình luận...'
                      value={newComment}
                      onChange={handleCommentChange}
                    />
                    <button
                      className='w-10/12 h-10 mt-4 bg-blue-500 text-white rounded'
                      onClick={handleCommentSubmit}
                    >
                      Gửi
                    </button>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        )}
      </div>

    </div>
  )
}

export default HomeUser