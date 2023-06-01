import express from 'express';
import commentController from '../controllers/comment.controller';
const router = express.Router();

router.post('/create/:id',commentController.createComment);

export default router;