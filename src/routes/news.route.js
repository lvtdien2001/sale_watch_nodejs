import express from 'express';
import NewsController from '../controllers/news.controller';
import upload from '../utils/multer';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

router.post('/',upload.single('imageUrl'), NewsController.create)
router.get('/',NewsController.get)

router.get('/:id',NewsController.getNewsById)
router.get('/edit/:id',NewsController.getById)
router.post('/delete/:id',NewsController.delete)
router.post('/updateInfo/:id',NewsController.updateInformation)
router.post('/updateImage/:id', upload.single('imageUrl'),NewsController.updateImage)
export default router;
