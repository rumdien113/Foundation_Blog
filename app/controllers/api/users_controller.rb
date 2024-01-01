class Api::UsersController < ApplicationController
  include Devise::Controllers::Helpers
  skip_before_action :verify_authenticity_token
  before_action :authenticate_user!, only: [:logout, :update, :destroy]
  DEFAULT_AVATAR = "default_avatar.png"
  def index
    users = User.all.select(:id, :username, :email, :role, :phone, :avatar)
    render json: users.to_json, status: :ok
  end
  
  def create
    user = User.new(user_params)
    user.role = 'User'
    
    # Kiểm tra nếu không có giá trị được truyền vào cho avatar hoặc giá trị truyền vào là null
    if user.avatar.blank? || user.avatar.nil?
      user.avatar = DEFAULT_AVATAR
    end
  
    if user.save
      render json: { message: 'Đăng ký thành công' }
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  def show
    user = User.find(params[:id])
    if user
      render json: user.to_json(only: [:username])
    else
      render json: { error: 'User not found' }, status: :not_found
    end
  end

  def my_profile
    user = current_user
  
    if user 
      render json: {
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar # Giả định sử dụng Paperclip hoặc ActiveStorage để lưu đường dẫn avatar
      }, status: :ok
    else 
      render json: { error: 'User not found' }, status: :not_found
    end
  end
  
  
  def update
    user = User.find(params[:id])
    user.username = params[:username]
    user.email = params[:email]
    user.phone = params[:phone]
  
    # Kiểm tra và xóa ảnh cũ trước khi cập nhật ảnh mới
    user.remove_avatar! if params[:avatar].present?
  
    # Thêm ảnh mới
    user.avatar = params[:avatar] if params[:avatar].present?
  
    if user.save
      render json: { message: 'User updated successfully' }, status: :ok
    else
      render json: { error: 'Failed to update user' }, status: :unprocessable_entity
    end
  end
  
  

  def destroy
    if current_user.Admin? # Sử dụng current_user từ Devise
      user = User.find(params[:id])
      user.destroy
      render json: { message: 'Xoá thành công' }
    else
      render json: { error: 'Không có quyền truy cập. Chỉ Admin mới có thể xoá.' }, status: :forbidden
    end
  end
  
  def logout
    sign_out current_user # Sử dụng Devise để đăng xuất
    render json: { message: 'Đăng xuất thành công' }, status: :ok
  end

  def show_profile
    user = User.find(params[:id])
  
    if user 
      render json: {
        username: user.username,
        email: user.email,
        phone: user.phone,  
        avt: user.avatar
      }, status: :ok
    else 
      render json: { error: 'User not found'}, status: :not_found  
    end
  end

  private

  def user_params
    params.require(:user).permit(:username, :email, :password, :password_confirmation, :phone, :role, :avatar)
  end
  # def default_avatar
  #   Rails.root.join("public/default_avatar.jpg")
  # end
end