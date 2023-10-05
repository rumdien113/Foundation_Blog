module Api
  class PostsController < ApplicationController
    include Devise::Controllers::Helpers

    skip_before_action :verify_authenticity_token
    before_action :authenticate_user!, only: [:create, :update, :destroy]

    before_action :verify_admin_role, only: [:create, :update, :destroy]

    def create
      @post = Post.new(post_params)

      if @post.save
        render json: { bannerUrl: @post.banner.url }, status: :created
      else
        render json: { error: 'Không thể tạo bài viết' }, status: :unprocessable_entity
      end
    end

    def index
      @posts = Post.all
      render json: @posts, status: :ok
    end

    def destroy
      @post = Post.find(params[:id])

      @post.destroy
      render json: {}, status: :no_content
    end

    def show
      begin
        @post = Post.find(params[:id])
        render json: @post, status: :ok
      rescue ActiveRecord::RecordNotFound => e
        Rails.logger.error "Record not found: #{e.message}"
        render json: { error: 'Bài viết không tồn tại' }, status: :not_found
      rescue => e
        Rails.logger.error "Error: #{e.message}"
        render json: { error: 'Có lỗi xảy ra' }, status: :internal_server_error
      end
    end

    def update
      @post = Post.find(params[:id])
    
      if @post.update(post_params)
        @post.reload # Làm mới bài viết để có thông tin mới nhất
    
        if @post.banner.present?
          render json: { bannerUrl: @post.banner.url }, status: :ok
        else
          render json: { error: 'Không thể cập nhật banner của bài viết' }, status: :unprocessable_entity
        end
      else
        render json: { error: 'Không thể cập nhật bài viết' }, status: :unprocessable_entity
      end
    end
    
    

    def show_comments
      begin
        post = Post.find(params[:id])
        comments = post.comments
        # puts comments
        render json: comments.to_json, include: :user, status: :ok
      rescue ActiveRecord::RecordNotFound => e
        Rails.logger.error "Record not found: #{e.message}"
        render json: { error: 'Bài viết không tồn tại' }, status: :not_found
      rescue => e
        Rails.logger.error "Error: #{e.message}"
        render json: { error: 'Có lỗi xảy ra' }, status: :internal_server_error
      end
    end
    

    private

    def post_params
      params.permit(:title, :introduction, :content, :banner)
    end

    def verify_admin_role
      if current_user && current_user.role == 'Admin'
      else
        render json: { error: 'Permission denied' }, status: :forbidden
      end
    end
  end
end
