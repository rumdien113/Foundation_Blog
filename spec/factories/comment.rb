FactoryBot.define do
  factory :comment do
    content { 'This is a comment.' }
    post { create(:post) }
    user { create(:user) }
  end
end
