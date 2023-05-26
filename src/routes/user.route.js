import express from 'express';
import userController from '../controllers/user.controller'
import upload from '../utils/multer';

import { verifyAdmin } from '../middleware/auth';
const router = express.Router();

router.post('/register',upload.single('imageUrl'),userController.register)
router.post('/login',userController.login)
// router.post('/edit',userController.getUserById)
router.post('/update/:id',userController.updateUser)
router.get('/register',userController.displayRegister)
router.get('/login',userController.displayLogin)
router.get('/edit/:id',userController.displayProfile)
router.get('/',userController.getAll)
router.get('/logout',userController.logout)

export default router;