import React, { useState, useEffect } from 'react'
import axios from 'axios'
import HeaderAdmin from './HeaderAdmin'
import HeaderUser from './HeaderUser'
import ReactHtmlParser from 'react-html-parser'
import default_avatar from '../../assets/images/default_avatar.png'
import { IoClose } from 'react-icons/io5'
import { IoPersonOutline } from 'react-icons/io5'
import { IoPhonePortraitOutline } from 'react-icons/io5'
import { LuMail } from 'react-icons/lu'

const Profile = () => {
	const [user, setUser] = useState([])
	const [posts, setPosts] = useState([])
	const [selectedPost, setSelectedPost] = useState(null)
  const [newComment, setNewComment] = useState('')
	const [users, setUsers] = useState({}) // Khai báo state users để lưu thông tin người dùng
  const [selectedComment, setSelectedComment] = useState(null)
	const [isOpen, setIsOpen] = useState(false)
	const [isEdit, setIsEdit] = useState(false)

	const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
	const [avatar, setAvatar] = useState(null)

	const role = localStorage.getItem('role')
	const user_id = localStorage.getItem('user_id')

	useEffect(() => {
		fetchUser()
		fetchPosts()
	}, [])

	// lấy thông tin người dùng
	const fetchUser = async () => {
		try {
			const token = localStorage.getItem('token');
			const response = await axios.get(`http://localhost:3000/my_profile`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			})
			setUser(response.data)
		} catch (error) {
			console.error(error)
		}
	}

	// sửa thông tin người dùng
	const handleSubmit = async (user_id, { username, email, phone, avatar }) => {
		try {
		  const formData = new FormData();
		  formData.append('username', username);
		  formData.append('email', email);
		  formData.append('phone', phone);
		  formData.append('avatar', avatar);
	  
		  const response = await axios.put(`/api/users/${user_id}`, formData, {
			headers: {
			  'Content-Type': 'multipart/form-data',
			},
		  });
	  
		  // Xử lý kết quả từ backend (nếu cần)
		  console.log(response.data); // Hiển thị thông tin phản hồi từ server
		} catch (error) {
		  console.error('Error:', error);
		}
	  };

	// lấy tất cả bài viết của người dùng hiện tại
	const fetchPosts = async () => {
		try {
			const response = await axios.get(`http://localhost:3000/posts/my`)
			setPosts(response.data)
		} catch (error) {
			console.error(error)
		}
	}
	
		// Chọn bài viết để xem chi tiết
		const handlePostClick = (post) => {
			setSelectedPost(post)
			fetchComments(post.id)
			setIsOpen(!isOpen)
		}

		const handleEdit = (user) => {
			if (user) {
				setUsername(user.username)
				setEmail(user.email)
				setPhone(user.phone)
			}
			setIsEdit(!isEdit)
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
		<div>
			{role === 'Admin' ? <HeaderAdmin /> : <HeaderUser />}
			<div className='flex flex-col justify-center px-12 bg-zinc-900 h-full pt-20 font-[inherit]'>
				{/* info */}
				<div className='flex max-h-[150px] mx-auto'>
					<img
						src={user && (user.avatar || user.avatar === 'default_avatar') ? 'http://localhost:3000' + user.avatar.url : default_avatar}
						alt='Avatar'
						className='w-[150px] h-[150px] rounded-full mr-24'
					/>
					<div className='grid grid-cols-2 text-white justify-between'>
						<p className='flex items-center text-2xl font-bold'>
							<IoPersonOutline className='mr-2'/>
							{user && user.username}
						</p>
						<p className='flex items-center text-xl'>
							<IoPhonePortraitOutline className='mr-2'/>
							{user && user.email}
						</p>
						<p className='flex items-center text-xl'>
							<LuMail className='mr-2'/>
							{user && user.phone}
						</p>
						<button 
							onClick={() => handleEdit()}
							className='flex text-xl items-center justify-center w-auto h-min my-auto px-4 py-2 text-white bg-[#363636] rounded-lg hover:bg-[#262626]'
						>
							Chỉnh sửa trang cá nhân
						</button>
					</div>
					{/* form edit info */}
					{isEdit && (
					<div className='fixed inset-0 flex items-center justify-center'>
						<div className='w-200 h-200 bg-[#363636] p-8 rounded-xl'>
							<form 
								action=''
								className='grid grid-cols-1 gap-y-4 text-base'	
							>
								{/* title */}
								<h2 className='text-white text-2xl mb-4'>Chỉnh sửa thông tin người dùng</h2>
								{/* username */}
								<div className='flex justify-between'>
									<label htmlFor='username' className='block text-start text-white'>Username</label>
									<input 
										type='text'
										value={username}
										onChange={(e) => setUsername(e.target.value)}
										className='h-9 rounded-lg px-2' 
									/>
								</div>
								{/* email */}
								<div className='flex justify-between'>
									<label htmlFor='email' className='block text-start text-white'>Email</label>
									<input 
										type='text'
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className='h-9 rounded-lg px-2' 
									/>
								</div>
								{/* phone */}
								<div className='flex justify-between'>
									<label htmlFor='phone' className='block text-start text-white'>Phone number</label>
									<input 
										type='text'
										value={phone}
										onChange={(e) => setPhone(e.target.value)}
										className='h-9 rounded-lg px-2' 
									/>
								</div>
								{/* avatar */}
								<div className='flex justify-between'>
									<label htmlFor='avatar' className='block text-start text-white'>Avatar</label>
									<input
										type='file'
										name='avatar'
										className='w-1/2' 
										onChange={(e) => setAvatar(e.target.files[0])}
										hidden
										id='avatar'
									/>
									<label 
										htmlFor='avatar'
										className='w-3/5 rounded-lg p-2 text-center my-auto text-white bg-[#363636] hover:bg-[#262626]'
									>
										Chọn ảnh
									</label>
								</div>
								{/* button */}
								<div className='flex flex-nowrap'>
									<button
										onClick={() => handleSubmit(user_id, { username, email, phone, avatar })}
										className='text-[#0095f6] hover:bg-sky-600/50 rounded-lg px-4 py-2'
									>
										Thay đổi
									</button>
									<button 
										className='text-gray-300 hover:bg-[#262626] rounded-lg px-4 py-2'
										onClick={() => setIsEdit(!isEdit)}
									>
										Hủy
									</button>
								</div>
							</form>
						</div>
					</div>
				)}
				</div>
				{/* post of user */}
				<div className='w-6/12 mx-auto py-4 pt-20'>
          {[...posts].reverse().map((post) => (
            <div
              key={post.id}
              className='mb-4 p-6 border border-gray-300 rounded'
              onClick={() => handlePostClick(post)}
            >
              <h3 className='text-3xl font-bold text-white'>{post.title}</h3>
              <p className='text-slate-400'>{post.introduction}</p>
              <p className='mt-4 text-white'>{ReactHtmlParser(post.content)}{' '}</p>
              {post.banner && <img src={'http://localhost:3000' + post.banner.url} alt='Banner' className='mt-4 w-full' />}
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
                              <div className='flex flex-row items-center gap-4 px-3 py-2 mt-2 border-t dark:border-gray-600'>
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
                    <div className='flex items-center justify-between px-3 py-2 border-t dark:border-gray-600'>
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
		</div>
	)
}

export default Profile