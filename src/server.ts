import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 路由引入
import userRouter from './routes/users';
app.use('/api/users', userRouter);

// 错误处理
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  // res.status(500).json({ message: err.message });
  res.status(500).send('Server Error');
});

const PORT = process.env.API_PORT || 5008;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// 启动服务器
// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });