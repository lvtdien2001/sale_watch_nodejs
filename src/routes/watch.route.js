import express from 'express';
import watchController from '../controllers/watch.controller';
import upload from '../utils/multer';

const router = express.Router();

router.route('/admin')
    .get(watchController.getAllWatches)

router.post('/delete/:id', watchController.delete)

router.route('/')
    .post(upload.single('image'), watchController.create)

export default router;
