class Post < ApplicationRecord
    mount_uploader :banner, BannerUploader
    before_destroy :remove_images_folder
    has_many :comments, dependent: :destroy
    def remove_images_folder
      folder_path = Rails.root.join("public/uploads/post/#{id}")
      FileUtils.remove_dir(folder_path, force: true)
    end
end
  