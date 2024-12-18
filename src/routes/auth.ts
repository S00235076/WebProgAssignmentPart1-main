import express, {Router} from 'express';
import { validJWTProvided } from '../middleware/auth.middleware';
import { handleLogin } from '../controllers/auth';
import { deleteUser } from '../controllers/users';

import { authenticateKey } from '../middleware/auth.middleware';

const router: Router = express.Router();

router.post('/',  handleLogin);
router.delete('/:id', validJWTProvided, deleteUser);
export default router;