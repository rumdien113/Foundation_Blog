class BannerUploader < CarrierWave::Uploader::Base
  storage :file
  def store_dir
    "uploads/post/#{model.id}"
  end
  
  def extension_whitelist
    %w[jpg jpeg gif png]
  end
end
