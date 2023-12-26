import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connection } from '../config';
import authRouter from './controllers/auth/index';
import userListRouter from './controllers/userlist/index';
import { authenticate } from './middlewares/auth';

dotenv.config();

const app: Application = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello World' });
});

app.use('/auth', authRouter);
app.use('/userlist', authenticate, userListRouter);

app.listen(port, async () => {
  try {
    await connection;
    const textGreenColor = '\x1b[32m%s\x1b[0m';
    console.log(
      textGreenColor,
      `[server]: Server is running at http://localhost:${port}`
    );
    console.log(textGreenColor, `[server]: Database connected successfully`);
  } catch (error) {
    const textRedColor = '\x1b[31m%s\x1b[0m';
    console.error(error);
    console.error(textRedColor, `[server]: Database connection failed`);
    process.exit(1);
    return;
  }
});

export default app;
