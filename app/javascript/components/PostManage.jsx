import React, { useState, useEffect } from 'react'
import axios from 'axios'
import PostUpdateForm from './PostUpdateForm'
import Header from './HeaderAdmin'

const PostManage = () => {
  const [posts, setPosts] = useState([])
  const [selectedPostId, setSelectedPostId] = useState(null)
  const [comments, setComments] = useState([])

  const token = localStorage.getItem('token')

  // Tạo headers chứa token
  const headers = {
    Authorization: `Bearer ${token}`,
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = () => {
    axios
      .get('http://localhost:3000/api/posts')
      .then((response) => {
        setPosts(response.data)
      })
      .catch((error) => {
        console.log(error.response.data)
      })
  }

  const fetchComments = (postId) => {
    axios
      .get(`http://localhost:3000/api/posts/${postId}/show_comments`)
      .then((response) => {
        setComments(response.data)
      })
      .catch((error) => {
        console.log(error.response.data)
      })
  }

  const handleDeletePost = (postId) => {
    axios
      .delete(`http://localhost:3000/api/posts/${postId}`)
      .then((response) => {
        console.log(response.data)
        setSelectedPostId(null)
        fetchPosts()
        //alert('Success! không có bug nhé')
      })
      .catch((error) => {
        console.log(error.response.data)
        // Xử lý lỗi nếu cần
      })
  }

  const handleDeleteComment = (commentId) => {
    axios
      .delete(`http://localhost:3000/api/comments/${commentId}`, { headers })
      .then((response) => {
        console.log(response.data)
        setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId))
      })
      .catch((error) => {
        console.log(error.response.data)
      })
  }

  const handleDeleteAllComments = (postId) => {
    if (postId) {
      axios
        .delete(`http://localhost:3000/api/posts/${postId}/delete_all_comments`)
        .then((response) => {
          console.log(response.data)
          setComments([])
          fetchComments(postId)
          alert('Success! không có bug nhé') // Fetch comments again after deletion
        })
        .catch((error) => {
          console.log(error.response.data)
          window.location.href= '/login'
        })
    }
  }

  const handlePostClick = (postId) => {
    setSelectedPostId(postId)
    fetchComments(postId)
  }

  const handlePostUpdate = () => {
    fetchPosts()
    setSelectedPostId(null)
  }

  return (
    <div className='bg-zinc-900 h-full'>
      <Header />
      <div className='w-9/12 mx-auto py-4 font-mono text-white pt-20'>
        <h2 className='mb-4 text-4xl font-bold text-white'>Quản lí bài viết </h2>
        {posts.map((post) => (
          <div key={post.id} className='mb-4 p-6 border border-gray-300 rounded'>
            <h3 className='text-lg font-bold cursor-pointer' onClick={() => handlePostClick(post.id)}>
              {post.title}
            </h3>
            <p className='text-gray-600'>{post.introduction}</p>
            <p className='mt-4'>{post.content}</p>
            {post.banner && (
              <img src={'http://localhost:3000' + post.banner.url} alt='Banner' className='mt-4 object-fill w-96' />
            )}
            <button
              onClick={() => handleDeletePost(post.id)}
              className='inline-flex items-center mt-4 py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800'
            >
              Xoá bài viết
            </button>

            {selectedPostId !== null && selectedPostId === post.id && (
              <div>
                {comments.length > 0 ? (
                  <div>
                    <h4 className='text-lg font-bold mt-4'>Bình luận:</h4>
                    {comments.map((comment) => (
                      <div key={comment.id} className='border border-gray-300 rounded p-2 mt-2'>
                        <p>{comment.content}</p>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className='inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800'
                        >
                          Xoá bình luận
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => handleDeleteAllComments(selectedPostId)}
                      className='inline-flex items-center mt-2 py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800'
                    >
                      Xoá tất cả bình luận
                    </button>
                  </div>
                ) : (
                  <p className='mt-4'>Không có bình luận nào cho bài viết này.</p>
                )}
                <PostUpdateForm postId={post.id} onPostUpdate={handlePostUpdate} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PostManage
