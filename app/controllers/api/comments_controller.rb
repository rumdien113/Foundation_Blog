class Api::CommentsController < ApplicationController
  include Devise::Controllers::Helpers
  skip_before_action :verify_authenticity_token, only: [:create, :update, :destroy, :destroy_all, :get_comments_by_post]
  before_action :authenticate_user!, only: [:create ,:update, :destroy]

  def index
    comments = Comment.all
    render json: comments, status: :ok
  end

  def create
    comment = Comment.new(comment_params)
  
    # Kiểm tra xem người dùng đã đăng nhập hay chưa
    if user_signed_in?
      # Gán user_id cho bình luận nếu người dùng đã đăng nhập
      comment.user_id = current_user.id
    end
  
    # Lưu bình luận
    if comment.save
      # Trả về bình luận đã lưu và mã trạng thái 201 (Created)
      render json: comment_with_user(comment), status: :ok
    else
      # Trả về lỗi và mã trạng thái 422 (Unprocessable Entity)
      render json: { errors: comment.errors.full_messages }, status: :unprocessable_entity
    end
  end
  

  def show
    comment = Comment.find(params[:id])
    render json: comment.to_json, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Comment not found' }, status: :not_found
  end
  
  def destroy
    comment = Comment.find(params[:id])
  
    if comment.user_id == current_user.id || current_user.Admin?
      if comment.destroy
        render json: { message: 'Xoá bình luận thành công' }, status: :ok
      else
        render json: { message: 'Xoá không thành công' }, status: :unprocessable_entity
      end
    else
      render json: { error: "Không thể xoá bình luận của người khác" }, status: :forbidden
    end
  end
  


  def destroy_all
    if current_user && current_user.Admin?
      post_id = params[:id]
      Comment.where(post_id: post_id).destroy_all
      render json: { message: 'All comments deleted successfully' }, status: :ok
    else
      render json: { error: 'Không có quyền truy cập. Chỉ Admin mới có thể xoá tất cả các bình luận.' }, status: :forbidden
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Bài viết không tồn tại' }, status: :not_found
  end
  def get_comments_by_post
    post_id = params[:post_id]
    comments = Comment.where(post_id: post_id)
    render json: comments, include: :user, status: :ok
  end

  def update
    comment = Comment.find(params[:id])

    if comment.user == current_user
      if comment.update(comment_params)
        render json: { message: 'Cập nhật bình luận thành công' }, status: :ok
      else
        render json: { errors: comment.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { error: 'Bạn không có quyền sửa bình luận này' }, status: :forbidden
    end
  end

  private

  def comment_params
    params.require(:comment).permit(:content, :post_id, :user_id)
  end

  def comment_with_user(comment)
    {
      id: comment.id,
      content: comment.content,
      post_id: comment.post_id,
      user: {
        id: comment.user.id,
        username: comment.user.username
      }
    }
  end
end
