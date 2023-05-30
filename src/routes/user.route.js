import express from 'express';
import userController from '../controllers/user.controller'
import upload from '../utils/multer';
const router = express.Router();

router.post('/register',upload.single('imageUrl'),userController.register)
router.post('/login',userController.login)
router.get('/register',userController.displayRegister)
router.get('/edit-user',userController.displayEditUser)
router.get('/login',userController.displayLogin)
router.get('/logout',userController.logout)

export default router;