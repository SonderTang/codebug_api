// src/routes/users.ts
import { Router } from 'express';
import {
  login,
  register
} from '../controllers/authController';

const authRouter = Router();

authRouter.post('/login', login as any);
authRouter.post('/register', register as any)
// router.get('/:id', getUserById);
// router.post('/', createUser);
// router.put('/:id', updateUser);
// router.delete('/:id', deleteUser);

export default authRouter;