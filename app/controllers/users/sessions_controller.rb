# app/controllers/users/sessions_controller.rb
class Users::SessionsController < Devise::SessionsController
    before_action :configure_permitted_parameters
  
     respond_to :json # Cho phép controller trả về JSON response.

     def create
     super do |resource|
      if resource.persisted?
        render json: {
          user_id: resource.id,
          role: resource.role,
          message: 'Đăng nhập thành công'
        }, status: :ok and return
      end
     end
     end
    private
  
    def configure_permitted_parameters
      devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute1, :attribute2])
    end
end
  