import express from 'express';
import watchController from '../controllers/watch.controller';
import upload from '../utils/multer';

const router = express.Router();

router.get('/', (req, res) => res.render('admin/home', {layout: 'admin'}));

router.get('/watch', watchController.getAllWatches);
router.post('/watch/delete/:id', watchController.delete)
router.post('/watch/add', upload.single('image'), watchController.create)

export default router;
