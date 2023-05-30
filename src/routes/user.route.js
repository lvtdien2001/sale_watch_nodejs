import express from 'express';
import userController from '../controllers/user.controller'
import upload from '../utils/multer';
const router = express.Router();

router.get('/register',userController.displayRegister)
router.post('/register',upload.single('imageUrl'),userController.register)
router.get('/login',userController.displayLogin)
router.post('/login',userController.login)
router.get('/edit',userController.displayEditUser)
router.post('/edit', upload.single('imageUrl'),userController.editUser)
router.get('/logout',userController.logout)

export default router;