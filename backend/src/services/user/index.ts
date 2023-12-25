import { UserModel } from '../../models/user';
import bcrypt from 'bcrypt';

export const findUserByEmail = async (email: string) => {
  try {
    const user = await UserModel.findOne({ email });
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
};

/**
 * Creates a new user.
 * @param {string} name
 * @param {string} email
 * @param {string} gender
 * @param {string} city
 * @param {string} state
 * @param {string} password
 * @param {string | undefined} referralSource?
 * @returns {Promise<userModel>} A promise that resolves to the created user.
 * @throws {Error} if there is an error creating the user.
 */
export const createUser = async (
  name: string,
  email: string,
  gender: string,
  city: string,
  state: string,
  password: string,
  referralSource?: string
) => {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = new UserModel({
      name,
      email,
      gender,
      referralSource,
      city,
      state,
      password: hash,
    });
    await user.save();

    return user._id;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const findUserById = async (id: string) => {
  try {
    const user = await UserModel.findById(id);
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const updateUserById = async (
  id: string,
  propertiesToBeUpdated: object
) => {};

export const validatePassword = async (password: string, hash: string) => {
  try {
    const isValid = await bcrypt.compare(password, hash);
    return isValid;
  } catch (error: any) {
    throw new Error(error);
  }
};
