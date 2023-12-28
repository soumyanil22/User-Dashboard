import mongoose from 'mongoose';
import { UserListModel } from '../../models/user-list';

/**
 * Get a list of users.
 * @param {mongoose.Types.ObjectId} id
 * @param {number} page
 * @param {number} perPage
 * @returns {Promise<UserListModel>} A promise that resolves to the Userlist.
 * @throws {Error} Throws an error if the Userlist is not found.
 */

export const getUserList = async (
  id: mongoose.Types.ObjectId,
  search: string,
  page: number = 1,
  perPage: number = 10
) => {
  try {
    const skipValue = (page - 1) * perPage;
    const searchQuery = {
      _id: { $eq: id },
      $or: [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ],
    };

    const [userList, total] = await Promise.all([
      await UserListModel.find(searchQuery).limit(perPage).skip(skipValue),
      await UserListModel.countDocuments(searchQuery),
    ]);

    return { userList, total };
  } catch (error: any) {
    console.error('Error fetching user list:', error);
    throw new Error(error);
  }
};

/**
 *
 * @param {mongoose.Types.ObjectId} _id
 * @param {string} username
 * @param {string} email
 * @param {string} phone
 * @returns {Promise<UserListModel>} A promise that resolves to the updated user.
 * @throws {Error} Throws an error if the user is not found.
 */

export const editUser = async (
  _id: mongoose.Types.ObjectId,
  username: string,
  email: string,
  phone: string
) => {
  try {
    const user = await UserListModel.findOneAndUpdate(
      { _id },
      { username: username, email: email, phone: phone }
    );

    return user;
  } catch (error: any) {
    console.error('Error editing user:', error);
    throw new Error(error);
  }
};

/**
 *
 * @param {mongoose.Types.ObjectId} _id
 * @returns {Promise<UserListModel>} A promise that resolves to the deleted user.
 * @throws {Error} Throws an error if the user is not found.
 */

export const deleteUser = async (_id: mongoose.Types.ObjectId) => {
  try {
    const user = await UserListModel.findOneAndDelete({ _id });

    return user;
  } catch (error: any) {
    console.error('Error deleting user:', error);
    throw new Error(error);
  }
};

/**
 *
 * @param {string} username
 * @param {string} email
 * @param {string} phone
 * @returns {Promise<UserListModel>} A promise that resolves to the created user.
 * @throws {Error} Throws an error if the user cannot be created.
 */

export const createUser = async (
  username: string,
  email: string,
  phone: string
) => {
  try {
    const user = new UserListModel({
      username,
      email,
      phone,
    });

    await user.save();

    return user;
  } catch (error: any) {
    console.error('Error creating user:', error);
    throw new Error(error);
  }
};

export const getUser = async (_id: mongoose.Types.ObjectId) => {
  try {
    const user = await UserListModel.findOne({ _id });

    return user;
  } catch (error: any) {
    console.error('Error fetching user:', error);
    throw new Error(error);
  }
};
