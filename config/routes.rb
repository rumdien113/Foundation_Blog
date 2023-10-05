Rails.application.routes.draw do
 
  get 'hello_world', to: 'hello_world#index'
  root 'pages#login'
  get '/register', to: 'pages#register'
  get '/homeuser', to: 'pages#homeuser'
  get 'homeadmin', to: 'pages#homeadmin'
  get '/login', to: 'pages#login'
  get '/manageuser', to: 'pages#manageuser'
  get 'post', to: 'pages#post'
  get '/listpost' , to: 'pages#listpost'
  get '/comment' , to: 'pages#comment'
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    omniauth_callbacks: 'users/omniauth_callbacks'
  }
  namespace :api, defaults: { format: :json } do
    resources :users, only: [:index, :create, :show, :update, :destroy]
    post '/login', to: 'users#login'
    delete '/logout', to: 'users#logout'
    get '/current', to: 'users#current'
    resources :posts, only: [:create, :index, :destroy, :update, :show] do
      resources :comments, only: [:index, :create]
      get 'show_comments', on: :member # Đổi tên route thành 'show_comments'
      delete 'delete_all_comments', on: :member, to: 'comments#destroy_all' # Thêm route để xoá hết comment
    end
    resources :comments, only: [:index, :create, :update, :destroy] do
      collection do
        delete :destroy_all
        get :get_comments_by_post # Thêm route này để lấy tất cả comment của một bài viết
      end
      member do
        get :show # Lấy một comment cụ thể theo id
      end
    end
  end
end
