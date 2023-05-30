import express from 'express';
import watchController from '../controllers/watch.controller';

const router = express.Router();

router.get('/:id', watchController.getProductDetail);

export default router;
