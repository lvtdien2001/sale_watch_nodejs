import express from 'express';
import commentController from '../controllers/comment.controller';
import upload from '../utils/multer';
const router = express.Router();

router.post('/create/:id', upload.single('imageUrl'),commentController.createComment);
router.post('/res/:id',commentController.feedback);


export default router;