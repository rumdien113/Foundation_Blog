FactoryBot.define do
  factory :user do
    username { 'john_doe' }
    email { Faker::Internet.unique.email }  # Sử dụng Faker để tạo email ngẫu nhiên và đảm bảo tính duy nhất.
    phone { '1234567890' }
    role { 'User' }
    password { 'password123' }
  end
end
