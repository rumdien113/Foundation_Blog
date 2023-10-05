# spec/models/post_spec.rb

require 'rails_helper'
# bundle exec rspec spec/models/post_spec.rb
RSpec.describe Post, type: :model do
  describe 'before_destroy callback' do
    it 'removes the images folder associated with the post' do
      # Tạo một bài viết và tạo một thư mục images liên quan
      post = create(:post)
      images_folder_path = Rails.root.join("public/uploads/post/#{post.id}")
      FileUtils.mkdir_p(images_folder_path)

      # Gọi phương thức remove_images_folder để xóa thư mục
      post.remove_images_folder

      # Kiểm tra xem thư mục images đã bị xóa
      expect(File.exist?(images_folder_path)).to be_falsey
    end
  end
end
