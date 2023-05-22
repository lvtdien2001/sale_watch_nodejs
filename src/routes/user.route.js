import express from 'express';
import userController from '../controllers/user.controller'
import upload from '../utils/multer';
const router = express.Router();

router.post('/register',upload.single('imageUrl'),userController.register)
router.post('/login',userController.login)
router.get('/register',userController.displayRegister)
router.get('/login',userController.displayLogin)

export default router;