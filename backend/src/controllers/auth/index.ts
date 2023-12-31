import express, { Request, Response } from 'express';
import {
  createUser,
  findUserByEmail,
  validatePassword,
} from '../../services/user/index';
import {
  createToken,
  refreshToken,
  verifyRefreshToken,
} from '../../services/jwt/index';
import { User } from '../../models/user';

const router = express.Router();

interface RegisterRequestBody {
  name: User['name'];
  email: User['email'];
  phone: User['phone'];
  gender: User['gender'];
  referralSource: User['referralSource'];
  city: User['city'];
  state: User['state'];
  password: User['password'];
}

interface LoginBody {
  email: string;
  password: string;
}

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginBody = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: 'Invalid input, Param(s) missing!' });

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await validatePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = await createToken(user._id);
    const refToken = await refreshToken(user._id);

    res.clearCookie('jwt');

    res.cookie('jwt', refToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });
    return res
      .json({
        message: 'Login successful',
        access_token: token,
      })
      .status(200);
  } catch (error: any) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
});

router.post('/register', async (req, res) => {
  const {
    name,
    email,
    phone,
    gender,
    referralSource,
    city,
    state,
    password,
  }: RegisterRequestBody = req.body;

  if (!email || !phone || !gender || !name || !city || !state || !password) {
    return res
      .status(400)
      .json({ message: 'Invalid input, Param(s) missing!' });
  }

  try {
    const userId = await createUser(
      name,
      email,
      phone,
      gender,
      city,
      state,
      password,
      referralSource
    );
    const token = await createToken(userId);
    const refToken = await refreshToken(userId);

    res.cookie('jwt', refToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });
    return res
      .status(200)
      .json({ message: 'User created successfully', access_token: token });
  } catch (error: any) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
});

router.get('/refresh', async (req, res) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      return res.status(500).json({
        message: 'Something went wrong, please try again later!',
      });
    }

    const newToken = await verifyRefreshToken(token);
    return res.status(200).json({
      message: 'Token refreshed successfully',
      access_token: newToken,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: 'Something went wrong, please try again later!',
      error: error.message,
    });
  }
});

export default router;
