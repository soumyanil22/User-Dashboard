import mongoose from 'mongoose';
import {
  createUser,
  deleteUser,
  editUser,
  getUser,
  getUserList,
} from '../../services/userlist';
import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const customReq = req as Request & { user?: { id: string } };
    const id = customReq?.user?.id;
    const page = parseInt(req.query?.page as string) || 1;
    const perPage = parseInt(req.query?.perPage as string) || 10;
    const search = (req.query?.search as string) ?? '';

    const userId = new mongoose.Types.ObjectId(id);

    const list = await getUserList(userId, search, page, perPage);

    res.status(200).json({ message: 'List fetched successfully', list });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customReq = req as Request & { user?: { id: string } };
    const currUser = customReq?.user?.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const userId = new mongoose.Types.ObjectId(id);
    const currUserId = new mongoose.Types.ObjectId(currUser);

    const user = await getUser(currUserId, userId);

    res.status(200).json({ message: 'User fetched successfully', user });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const customReq = req as Request & { user?: { id: string } };
    const id = customReq?.user?.id;
    const { username, email, phone } = req.body;

    const userId = new mongoose.Types.ObjectId(id);

    if (!username || !email || !phone)
      return res.status(400).json({ message: 'Missing required fields' });

    const user = await createUser(userId, username, email, phone);

    res.status(200).json({ message: 'User created successfully', user });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, email, phone } = req.body;
    const customReq = req as Request & { user?: { id: string } };
    const currUser = customReq?.user?.id;

    if (!username || !email || !phone) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const userId = new mongoose.Types.ObjectId(id);
    const currUserId = new mongoose.Types.ObjectId(currUser);

    const user = await editUser(currUserId, userId, username, email, phone);

    res.status(200).json({
      message: 'User data updated successfully',
      data: user,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customReq = req as Request & { user?: { id: string } };
    const currUser = customReq?.user?.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const userId = new mongoose.Types.ObjectId(id);
    const currUserId = new mongoose.Types.ObjectId(currUser);

    await deleteUser(currUserId, userId);

    res.status(200).json({
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
});

export default router;
