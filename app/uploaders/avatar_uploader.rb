class AvatarUploader < CarrierWave::Uploader::Base

    # Chọn storage để lưu file
    storage :file

    def store_dir
      "uploads/avt/#{model.id}" 
    end

    def extension_whitelist
      %w(jpg jpeg gif png)
    end
  
    # Tự động xoá file cũ khi thay bằng file mới
    def remove_previously_stored_files_after_update
      true
    end
  
end