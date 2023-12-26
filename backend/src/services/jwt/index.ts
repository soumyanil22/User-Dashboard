import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Creates a JSON Web Token (JWT) for a given user.
 *
 * @param {string} id - The unique identifier of the user.
 * @param {string} secret - The secret key used to sign the token.
 * @returns {Promise<object>} A promise that resolves to the generated JWT token.
 */

export const createToken = async (id: mongoose.Types.ObjectId) => {
  return jwt.sign({ id }, process.env.SECRET || '', {
    expiresIn: '1d',
  });
};

/**
 * Creates a refresh JSON Web Token (JWT) for a given user.
 *
 * @param {string} id - The unique identifier of the user.
 * @param {string} secret - The secret key used to sign the token.
 * @returns {Promise<object>} A promise that resolves to the generated JWT token.
 */

export const refreshToken = async (id: mongoose.Types.ObjectId) => {
  const refreshToken = jwt.sign(
    {
      id,
    },
    process.env.SECRET || '',
    { expiresIn: '2d' }
  );

  return refreshToken;
};

export const verifyRefreshToken = async (token: string) => {
  try {
    const verifiedToken: any = await verifyToken(token);

    if (verifiedToken && verifiedToken.id) {
      const accessToken = jwt.sign(
        {
          id: verifiedToken.id,
        },
        process.env.SECRET || '',
        {
          expiresIn: '1d',
        }
      );

      return accessToken;
    }
  } catch (error: any) {
    throw new Error(error);
  }
};

/**
 * Verifies a JSON Web Token (JWT) and returns the decoded token.
 *
 * @param {string} token
 * @param {string} secret
 * @returns {Promise<object>} A promise that resolves to the decoded JWT token.
 */

export const verifyToken = async (token: string) => {
  try {
    const verify = await jwt.verify(token, process.env.SECRET || '');

    return verify;
  } catch (error: any) {
    console.error('Error verifying token:', error);
    throw new Error(error);
  }
};
