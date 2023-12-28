import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../../services/jwt';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
    }

    const decodedToken = await verifyToken(token!);

    if (typeof decodedToken !== 'string' && decodedToken?.id) {
      const customReq = req as Request & { user?: { id: string } };
      customReq.user = {
        id: decodedToken.id,
      };
      next();
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (error: any) {
    res.status(401).json({ message: 'Unauthorized', error: error.message });
    next(error);
  }
};
