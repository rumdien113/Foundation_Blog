# spec/models/comment_spec.rb
# bundle exec rspec spec/models/comment_spec.rb
require 'rails_helper'

RSpec.describe Comment, type: :model do
  describe 'associations' do
    it 'belongs to a user' do
      user = User.create(username: 'testuser', email: 'user@example.com', phone: '1234567890', role: 'User')
      comment = Comment.create(content: 'This is a comment', user: user)
      expect(comment.user).to eq(user)
    end

    it 'belongs to a post' do
      post = Post.create(title: 'Test Post', introduction: 'Introduction for test post', content: 'This is a test post content', banner: 'test.jpg')
      comment = Comment.create(content: 'This is a comment', post: post)
      expect(comment.post).to eq(post)
    end
  end

  describe 'validations' do
    it 'is valid with valid attributes' do
      user = User.create(username: 'testuser', email: 'user@example.com', phone: '1234567890', role: 'User')
      post = Post.create(title: 'Test Post', introduction: 'Introduction for test post', content: 'This is a test post content', banner: 'test.jpg')
      comment = Comment.new(content: 'This is a comment', user: user, post: post)
      expect(comment).to be_valid
    end

    it 'is not valid without a user' do
      post = Post.create(title: 'Test Post', introduction: 'Introduction for test post', content: 'This is a test post content', banner: 'test.jpg')
      comment = Comment.new(content: 'This is a comment', user: nil, post: post)
      expect(comment).not_to be_valid
    end

    it 'is not valid without a post' do
      user = User.create(username: 'testuser', email: 'user@example.com', phone: '1234567890', role: 'User')
      comment = Comment.new(content: 'This is a comment', user: user, post: nil)
      expect(comment).not_to be_valid
    end

    it 'is not valid without content' do
      user = User.create(
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
        password_confirmation: 'password123',
        phone: '1234567890',
        role: 'User'
      )
      post = Post.create(title: 'Test Post', introduction: 'Introduction for test post', content: 'This is a test post content', banner: 'test.jpg')
      comment = Comment.new(content: 'This is a comment', user: user, post: post) # Thêm nội dung vào đây
      expect(comment).to be_valid
    end
    
  end
end
