require 'rails_helper'
#bundle exec rspec spec/models/user_spec.rb

RSpec.describe User, type: :model do
  describe 'validations' do
    it 'is valid with valid attributes' do
      user = User.new(
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
        password_confirmation: 'password123',
        phone: '1234567890',
        role: 'User' # Hoặc 'Admin' nếu cần tạo một user với vai trò Admin
      )
      expect(user).to be_valid
    end

    it 'is not valid without a username' do
      user = User.new(username: nil, email: 'test@example.com', phone: '123-456-7890', role: 'User')
      expect(user).not_to be_valid
    end

    it 'is not valid without an email' do
      user = User.new(username: 'testuser', email: nil, phone: '123-456-7890', role: 'User')
      expect(user).not_to be_valid
    end

    it 'is not valid with a duplicate email' do
      User.create(username: 'testuser', email: 'test@example.com', phone: '123-456-7890', role: 'User')
      user = User.new(username: 'anotheruser', email: 'test@example.com', phone: '987-654-3210', role: 'User')
      expect(user).not_to be_valid
    end

    it 'is not valid without a phone' do
      user = User.new(username: 'testuser', email: 'test@example.com', phone: nil, role: 'User')
      expect(user).not_to be_valid
    end

    it 'is not valid without a role' do
      user = User.new(username: 'testuser', email: 'test@example.com', phone: '123-456-7890', role: nil)
      expect(user).not_to be_valid
    end
  end

  describe 'roles' do
    it 'can have a role of User' do
      user = User.new(
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
        password_confirmation: 'password123',
        phone: '1234567890',
        role: 'User'
      )
      expect(user).to be_valid
      expect(user.User?).to be_truthy
    end

    it 'can have a role of Admin' do
      user = User.new(
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
        password_confirmation: 'password123',
        phone: '1234567890',
        role: 'Admin'
      )
      expect(user).to be_valid
      expect(user.Admin?).to be_truthy
    end
  end

  describe 'associations' do
    it 'destroys associated comments when destroyed' do
      user = User.create(username: 'testuser', email: 'test@example.com', phone: '123-456-7890', role: 'User')
      comment = Comment.create(content: 'Test comment', user: user)
      user.destroy
      expect(Comment.exists?(comment.id)).to be_falsey
    end
  end
end
