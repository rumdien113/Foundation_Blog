Rails.application.routes.draw do
 
  root 'pages#login'
  get '/register', to: 'pages#register'
  get '/homeuser', to: 'pages#homeuser'
  get 'homeadmin', to: 'pages#homeadmin'
  get '/login', to: 'pages#login'
  get '/manageuser', to: 'pages#manageuser'
  get 'postform', to: 'pages#postform'
  get '/listpost' , to: 'pages#postmanage'
  get '/comment' , to: 'pages#comment'
  get '/profile_view/:id' , to: 'pages#profile_view'
  get 'posts/:post_id/comments', to: 'api/comments#show_comments_for_post'
  get '/profile', to: 'pages#profile'
  get 'posts/my', to: 'api/posts#my_posts'
  get '/my_profile', to: 'api/users#my_profile'
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    omniauth_callbacks: 'users/omniauth_callbacks'
  }
  namespace :api, defaults: { format: :json } do
    resources :users do
      get '/profile/:id', to: 'users#show_profile', on: :collection 
    end
    
    resources :users, only: [:index, :create, :show, :update, :destroy]
    post '/login', to: 'users#login'
    delete '/logout', to: 'users#logout'
    get '/current', to: 'users#current'
    resources :posts, only: [:create, :index, :destroy, :update, :show] do
      member do
        get 'show_comments' # Đổi tên route thành 'show_comments'
        delete 'delete_all_comments', to: 'comments#destroy_all' # Thêm route để xoá hết comment
      end
      get 'posts_by_user', on: :collection # Thêm route để lấy bài viết của một người dùng cụ thể
      resources :comments, only: [:index, :create]
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
