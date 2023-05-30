import express from 'express';
import userController from '../controllers/user.controller'
import upload from '../utils/multer';

import { verifyAdmin } from '../middleware/auth';
const router = express.Router();

<<<<<<< HEAD
router.post('/register',upload.single('imageUrl'),userController.register)
router.post('/login',userController.login)
// router.post('/edit',userController.getUserById)
router.post('/update/:id',userController.updateUser)
=======
>>>>>>> 16ef9024a83dea2d8c024597674265b1d750e100
router.get('/register',userController.displayRegister)
router.post('/register',upload.single('imageUrl'),userController.register)
router.get('/login',userController.displayLogin)
<<<<<<< HEAD
router.get('/edit/:id',userController.displayProfile)
router.get('/',userController.getAll)
=======
router.post('/login',userController.login)
router.get('/edit',userController.displayEditUser)
router.post('/edit', upload.single('imageUrl'),userController.editUser)
>>>>>>> 16ef9024a83dea2d8c024597674265b1d750e100
router.get('/logout',userController.logout)

export default router;