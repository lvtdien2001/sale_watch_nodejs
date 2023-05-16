import express from 'express';
import BrandController from '../controllers/brand.controller';
import upload from '../utils/multer';

const router = express.Router();

router.route('/')
    .post(upload.single('image'), BrandController.create)
    .get(BrandController.home)

export default router;
