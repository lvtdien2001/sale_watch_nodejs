import express from 'express';
import BrandController from '../controllers/brand.controller';
import upload from '../utils/multer';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

router.route('/')
    .post(verifyToken, upload.single('image'), BrandController.create)
    .get(BrandController.home)

export default router;
