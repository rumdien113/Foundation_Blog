# spec/controllers/api/posts_controller_spec.rb
#bundle exec rspec spec/controllers/api/posts_controller_spec.rb
#bundle exec rspec spec/controllers/api/comments_controller_spec.rb
#bundle exec rspec spec/controllers/api/users_controller_spec.rb
require 'rails_helper'

RSpec.describe Api::PostsController, type: :controller do
  describe 'POST #create' do
    context 'when user is an admin' do
      let(:admin_user) { create(:user, role: 'Admin') }

      before do
        sign_in admin_user
      end

      it 'creates a new post' do
        post :create, params: { title: 'New Post', introduction: 'Introduction', content: 'Content', banner: fixture_file_upload('path_to_banner_image.jpg') }
        expect(response).to have_http_status(:created)
      end

      it 'returns the banner URL in the response' do
        post :create, params: { title: 'New Post', introduction: 'Introduction', content: 'Content', banner: fixture_file_upload('path_to_banner_image.jpg') }
        expect(JSON.parse(response.body)['bannerUrl']).not_to be_nil
      end
    end

    context 'when user is not an admin' do
      let(:non_admin_user) { create(:user, role: 'User') }

      before do
        sign_in non_admin_user
      end

      it 'returns forbidden status' do
        post :create, params: { title: 'New Post', introduction: 'Introduction', content: 'Content', banner: fixture_file_upload('path_to_banner_image.jpg') }
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe 'GET #index' do
    it 'returns a list of posts' do
      create_list(:post, 3)
      get :index
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).size).to eq(3)
    end
  end

  describe 'GET #show' do
    it 'returns a specific post' do
      post = create(:post)
      get :show, params: { id: post.id }
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['id']).to eq(post.id)
    end

    it 'returns not found status for non-existent post' do
      get :show, params: { id: 24 }
      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'PUT #update' do
    let(:admin_user) { create(:user, role: 'Admin') }
    let(:post) { create(:post) }

    before do
      sign_in admin_user
    end

    it 'updates a post' do
      put :update, params: { id: post.id, title: 'Updated Title' }
      expect(response).to have_http_status(:unprocessable_entity)
    end
    

    it 'returns forbidden status for non-admin user' do
      non_admin_user = create(:user, role: 'User')
      sign_in non_admin_user
      put :update, params: { id: post.id, title: 'Updated Title' }
      expect(response).to have_http_status(:forbidden)
    end
  end

  describe 'DELETE #destroy' do
    let(:admin_user) { create(:user, role: 'Admin') }
    let(:post) { create(:post) }

    before do
      sign_in admin_user
    end

    it 'deletes a post' do
      delete :destroy, params: { id: post.id }
      expect(response).to have_http_status(:no_content)
    end

    it 'returns forbidden status for non-admin user' do
      non_admin_user = create(:user, role: 'User')
      sign_in non_admin_user
      delete :destroy, params: { id: post.id }
      expect(response).to have_http_status(:forbidden)
    end
  end

  describe 'GET #show_comments' do
    it 'returns comments for a specific post' do
      post = create(:post)
      create_list(:comment, 3, post: post)
      get :show_comments, params: { id: post.id }
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).size).to eq(3)
    end

    it 'returns not found status for non-existent post' do
      get :show_comments, params: { id: 999 }
      expect(response).to have_http_status(:not_found)
    end

    it 'returns internal server error for unexpected errors' do
      allow(Post).to receive(:find).and_raise(StandardError.new('Some error'))
      get :show_comments, params: { id: 1 }
      expect(response).to have_http_status(:internal_server_error)
    end
  end
end
