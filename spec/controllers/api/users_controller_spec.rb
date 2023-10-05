require 'rails_helper'

RSpec.describe Api::UsersController, type: :controller do
  let(:valid_user_params) do
    {
      username: 'testuser',
      email: 'user@example.com',
      password: 'password',
      phone: '1234567890',
      role: 'User'
    }
  end

  let(:invalid_user_params) do
    {
      username: 'testuser12',
      email: 'user888@example.com',
      password: 'password@',
      phone: '12345678990',
      role: nil
    }
  end
#bundle exec rspec spec/controllers/api/users_controller_spec.rb
  describe 'GET #index' do
    it 'returns a list of users' do
      # Create some users for testing
    #   create(:user, username: 'user3')
    #   create(:user, username: 'user4')

      get :index

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).length).to eq(2) # Assuming 2 users were created
    end
  end

  describe 'POST #create' do
    context 'with valid params' do
      it 'creates a new user' do
        post :create, params: { user: valid_user_params }

        expect(response).to have_http_status(:success)
        expect(JSON.parse(response.body)['message']).to eq('Đăng ký thành công')
      end
    end

    context 'with invalid params' do
      it 'returns errors' do
        post :create, params: { user: invalid_user_params }

        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)).to have_key('errors')
      end
    end
  end

  describe 'GET #show' do
    it 'returns user details' do
      user = create(:user)

      get :show, params: { id: user.id }

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to have_key('username')
    end
  end

  describe 'PATCH #update' do
    context 'when an admin user is authenticated' do
      let(:admin_user) { create(:user, role: 'Admin') }
      let(:user_to_update) { create(:user) }
      let(:updated_attributes) { { username: 'UpdatedUsername' } }
  
      before do
        sign_in admin_user
      end
  
      it 'updates the user' do
        patch :update, params: { id: user_to_update.id, user: updated_attributes }
  
        expect(response).to have_http_status(:ok)
        expect(user_to_update.reload.username).to eq('UpdatedUsername')
      end
  
      it 'returns a success message' do
        patch :update, params: { id: user_to_update.id, user: updated_attributes }
  
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)).to include('message' => 'Cập nhật thành công')
      end
  
      it 'returns unprocessable_entity status if user update is invalid' do
        invalid_attributes = { username: nil }
        
        patch :update, params: { id: user_to_update.id, user: invalid_attributes }
  
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)).to include('errors')
      end
    end
  
    context 'when a non-admin user is authenticated' do
      let(:non_admin_user) { create(:user) }
      let(:user_to_update) { create(:user) }
      let(:updated_attributes) { { username: 'UpdatedUsername' } }
  
      before do
        sign_in non_admin_user
      end
  
      it 'returns forbidden status' do
        patch :update, params: { id: user_to_update.id, user: updated_attributes }
  
        expect(response).to have_http_status(:forbidden)
        expect(JSON.parse(response.body)).to include('error' => 'Không có quyền truy cập. Chỉ Admin mới có thể cập nhật.')
      end
    end
  end
  
  describe 'DELETE #destroy' do
    context 'when an admin user is authenticated' do
      let(:admin_user) { create(:user, role: 'Admin') }
      let(:user_to_destroy) { create(:user) }
  
      before do
        sign_in admin_user
      end
  
      it 'deletes the user' do
        delete :destroy, params: { id: user_to_destroy.id }
  
        expect(response).to have_http_status(:ok)
        expect(User.find_by(id: user_to_destroy.id)).to be_nil
      end
  
      it 'returns a success message' do
        delete :destroy, params: { id: user_to_destroy.id }
  
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)).to include('message' => 'Xoá thành công')
      end
    end
  
    context 'when a non-admin user is authenticated' do
      let(:non_admin_user) { create(:user) }
      let(:user_to_destroy) { create(:user) }
  
      before do
        sign_in non_admin_user
      end
  
      it 'returns forbidden status' do
        delete :destroy, params: { id: user_to_destroy.id }
  
        expect(response).to have_http_status(:forbidden)
        expect(JSON.parse(response.body)).to include('error' => 'Không có quyền truy cập. Chỉ Admin mới có thể xoá.')
      end
    end
  end
  

  describe 'POST #logout' do
    it 'logs out the user' do
      user = create(:user)

      sign_in user

      post :logout

      expect(response).to have_http_status(:ok)
    end
  end

  describe 'GET #current' do
    it 'returns current user details' do
      user = create(:user)

      sign_in user

      get :current

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to have_key('user_id')
      expect(JSON.parse(response.body)).to have_key('role')
    end

    it 'returns not found if no user is logged in' do
      get :current

      expect(response).to have_http_status(:not_found)
    end
  end
end