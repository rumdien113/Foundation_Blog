import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Header from './HeaderUser'
import { IoClose } from 'react-icons/io5'
import ReactHtmlParser from "react-html-parser"

const HomeUser = () => {
  const [posts, setPosts] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const [newComment, setNewComment] = useState('')
  const [selectedComment, setSelectedComment] = useState(null)
  const [currentUserRole, setCurrentUserRole] = useState(null)
  const [users, setUsers] = useState({}) // Khai báo state users để lưu thông tin người dùng
  const [isOpen, setIsOpen] = useState(false)
  const [listUser, setListUser] = useState([])
  const user_id = localStorage.getItem('user_id')

  const handleUserClick = (userId) => {
    // Thực hiện việc chuyển hướng khi click vào người dùng
    window.location.href = `/profile_view/${userId}`;
  }

  const checkAvatar = (url) => {
    const isDefault = /\/uploads\/avt\/\d+\/default_avatar.png$/.test(url)
    return (
      isDefault ? (default_avatar) : (url)
    )
  }

  // Lấy danh sách bài viết và thông tin người dùng hiện tại
  useEffect(() => {
    fetchPosts()
    fetchData()
    getCurrentUser()
  }, [])

  // Lấy danh sách người dùng
  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/users')
      const users = res.data.filter(user => user.id != user_id)
      setListUser(users)
    }
    catch (err) {
      console.log(err)
    }
  }
  
  // Lấy danh sách bài viết
  const fetchPosts = async () => {
    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }
    try {
      const res = await axios.get('http://localhost:3000/api/posts', { headers })
      const posts = res.data
      const chunkSize = 3
      for (let i = 0; i < posts.length; i += chunkSize) {
        setTimeout(() => {
          setPosts(prevPosts => [...prevPosts, ...posts.slice(i, i + chunkSize)])
        }, 2000 * (i / chunkSize))
      }
    } catch (err) {
      console.log(err)
    }
  }

  // Lấy thông tin người dùng hiện tại
  const getCurrentUser = () => {
    const token = localStorage.getItem('token')
    if (token) {
      axios
        .get('http://localhost:3000/api/users/current', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setCurrentUser(response.data)
          console.log(response.data)
        })
        .catch((error) => {
          console.log(error.response.data)
        })
    }
  }

  // Chọn bài viết để xem chi tiết
  const handlePostClick = (post) => {
    setSelectedPost(post)
    fetchComments(post.id)
    setIsOpen(!isOpen)
  }

  // Lấy danh sách bình luận của bài viết
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

  // Lấy danh sách bình luận của bài viết
  const handleCommentChange = (event) => {
    setNewComment(event.target.value)
    fetchComments(selectedPost.id)
  }

  // Lấy role của user từ localStorage
  useEffect(() => {
    const role = localStorage.getItem('role')
    setCurrentUserRole(role)
  }, [])

  // Tạo bình luận
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

  // Chọn bình luận để sửa
  const handleCommentSelect = (comment) => {
    fetchComments(selectedPost.id)
    setSelectedComment(comment)
  }

  // Sửa bình luận
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

  // Xoá bình luận
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
    <div className='bg-[#18191a]'>
      <Header />
      <div className='relative grid sm:grid-cols-1 lg:grid-cols-6 px-8 lg:px-0 grid-flow-col w-full h-full overflow-hidden'>
        {/* list posts */}
        <div className='block col-span-3 col-start-2 mx-auto items-center overflow-y-auto'>
          <div className='w-full py-4 pt-20 font-[inherit]'>
            {[...posts].reverse().map((post) => (
              <div
                key={post.id}
                className='mb-4 pt-[1px] rounded-xl bg-[#242526]'
                onClick={() => handlePostClick(post)}
              >
                <div className='m-6'>
                  <h3 className='text-3xl font-bold text-white'>{post.title}</h3>
                  <p className='text-slate-400'>{post.introduction}</p>
                  <p className='mt-4 text-white'>{ReactHtmlParser(post.content)}{' '}</p>
                </div>
                {post.banner && 
                  <img 
                    src={'http://localhost:3000' + post.banner.url} 
                    alt='Banner' 
                    className='mt-4 w-full rounded-b-xl' 
                  />
                }
              </div>
            ))}
            {isOpen && selectedPost && (
              <div className='fixed top-0 bottom-0 left-0 right-0 pt-14 z-100 bg-black'>
                <div className='flex flex-row relative'>
                  <div className='absolute hover:bg-gray-600/50 p-2 m-2 rounded-full z-30'>
                    <IoClose
                      onClick={() => setIsOpen(!isOpen)}
                      className='text-white hover:text-gray-300 items-center justify-center font-extrabold text-4xl cursor-pointer'
                    />
                  </div>
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
                  {/* title & comment */}
                  <div className='relative p-4 w-4/12 h-screen bg-[#242526]'>
                    {/* title */}
                    <div className='border-b-2 border-gray-700 mb-2'>
                      <h3 className='text-3xl font-bold text-white'>{selectedPost.title}</h3>
                      <p className='text-slate-400'>{selectedPost.introduction}</p>

                      {/* đây nè nha */}
                      <p className='ext-3xl font-bold text-white'>{ReactHtmlParser(selectedPost.content)}{' '}</p>
                    </div>
                    {/* comment */}
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

                    <div className='absolute xl:w-11/12 mb-4 mr-4 bottom-12 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600'>
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
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* list users */}
        {!isOpen && (
          <div className='fixed hidden lg:block col-span-2 col-start-6 max-h-screen top-0'>
            <div className='w-full mx-auto py-4 pt-20 font-[inherit] overflow-y-auto overflow-x-hidden'>
              {listUser.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleUserClick(user.id)}
                  className='flex items-center w-full mb-2 p-1 hover:bg-gray-600/50 rounded cursor-pointer'
                >
                  <img
                    src={checkAvatar(user.avatar.url)}
                    alt='Avatar'
                    className='w-10 h-10 rounded-full mr-4'
                  />
                  <p className='text-xl font-semibold text-white'>{user.username}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomeUser