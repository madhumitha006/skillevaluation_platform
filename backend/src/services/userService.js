const User = require('../models/User');
const AppError = require('../utils/AppError');

class UserService {
  async getAllUsers(filters = {}) {
    const users = await User.find(filters).select('-password -refreshToken');
    return users;
  }

  async getUserById(userId) {
    const user = await User.findById(userId).select('-password -refreshToken');
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  async updateUser(userId, updateData) {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select('-password -refreshToken');

    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  async deleteUser(userId) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
  }
}

module.exports = new UserService();
