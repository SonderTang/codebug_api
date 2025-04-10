import { Request, Response, NextFunction } from 'express';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { createApiResponse } from '../utils/response';
import { ApiResponse } from '../types/response';

interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  phone_number: string | null;
  is_active: boolean;
  failed_attempts: number;
  locked_until: Date | null;
  last_login_at: Date | null;
}

// 请求体类型
interface LoginRequest {
  username: string;
  password: string;
}

/** 登录 */
export const login = async (req: Request, res: Response, next?: NextFunction): Promise<Response | void> => {
  console.log('req', req);
  const { username, password } = req.body as LoginRequest;

  try {
    // 查询用户信息
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM user WHERE email=? OR username=?', [username, username]);
    if (rows.length === 0) {
      return res.status(404).json({ error: '用户不存在' });
    }

    const user = rows[0] as User;

    // 检查用户是否被锁定
    if (user.locked_until && new Date() < user.locked_until) {
      return res.status(423).json({ error: '用户被锁定' });
    }

    // 检查密码是否正确
    // const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    const isPasswordValid = password === user.password_hash;
    if (!isPasswordValid) {
      // 密码错误增加失败尝试次数，超过失败次数则锁定账号  后续补充
      //..
      return res.status(401).json({ error: '密码错误' });
    }

    // 密码正确，充值失败尝试次数和锁定时间
    // ...

    // 生成JWT Token 有效期7天
    const token = jwt.sign({ id: user.id, username: user.username }, config.jwtSecret, { expiresIn: '7d' })
    console.log('token', token);
    // 登录成功, 返回用户信息和Token
    const response: ApiResponse<{ id: number; username: string }> = createApiResponse(
      true,
      200,
      '登录成功',
      { id: user.id, username: user.username }
    );
    // res.json({ message: '登录成功', user: { id: user.id, username: user.username }, token });
    res.json(response);
  } catch (err) {
    console.error('Login error:', err);
    // 构建错误响应
    const response: ApiResponse<null> = createApiResponse(
      false,
      500,
      '登录过程中发生错误'
    );
    res.status(500).json(response);
  }
}

// 获取所有用户
// export const getAllUsers = async (req: Request, res: Response) => {
//   try {
//     const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM user_data LIMIT 100');
//     const users = rows as User[];
//     res.json(users);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Database query failed' });
//   }
// };