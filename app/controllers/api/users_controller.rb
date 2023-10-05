class Api::UsersController < ApplicationController
  include Devise::Controllers::Helpers
  skip_before_action :verify_authenticity_token
  before_action :authenticate_user!, only: [:logout, :update, :destroy]

  def index
    users = User.all.select(:id, :username, :email, :role, :phone)
    render json: users.to_json, status: :ok
  end
  
  

  def create
    user = User.new(user_params)

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
  
  

  def update
    if current_user.Admin? # Sử dụng current_user từ Devise
      user = User.find(params[:id])

      if user.update(user_params)
        render json: { message: 'Cập nhật thành công' }
      else
        render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { error: 'Không có quyền truy cập. Chỉ Admin mới có thể cập nhật.' }, status: :forbidden
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

  def current
    # Sử dụng Devise để lấy thông tin người dùng hiện tại
    if current_user.present?
      render json: { user_id: current_user.id, role: current_user.role }, status: :ok
    else
      render json: { error: 'User not found in session' }, status: :not_found
    end
  end

  private

  def user_params
    params.require(:user).permit(:username, :email, :password, :password_confirmation, :phone, :role)
  end
end
