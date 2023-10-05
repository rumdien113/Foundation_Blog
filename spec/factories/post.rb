# spec/factories/post.rb

FactoryBot.define do
    factory :post do
      title { "Example Post" }
      introduction {"example intro"}
      content { "This is an example post content." }
  
      
      factory :post_with_images_folder do
        after(:create) do |post|
          images_folder_path = Rails.root.join("public/uploads/post/#{post.id}")
          FileUtils.mkdir_p(images_folder_path)
        end
      end
    end
  end
  