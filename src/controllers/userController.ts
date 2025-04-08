import { Request, Response } from 'express';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2';

interface User {
  id?: number;
  avatar?: string; // 头像链接
  displayName?: string; // 显示名称
  division?: string; // 部门信息
  identifier?: string; // 用户标识
  nickName?: string; // 昵称
  organizationUserInfo?: string; // 企业信息
  realName?: string; // 真实姓名
  roleName?: string; // 角色名称
  tbRoleId?: string; // 角色ID
  project?: string; // 项目
  userid?: string; // 用户ID
}

// 获取所有用户
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM user_data LIMIT 100');
    const users = rows as User[];
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
};

// 创建用户
// export const createUser = async (req: Request, res: Response) => {
//   const { name, email }: User = req.body;

//   if (!name || !email) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }

//   try {
//     const [result] = await pool.query(
//       'INSERT INTO users (name, email) VALUES (?, ?)',
//       [name, email]
//     );

//     const insertedId = (result as any).insertId;
//     res.status(201).json({ id: insertedId, name, email });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'User creation failed' });
//   }
// };