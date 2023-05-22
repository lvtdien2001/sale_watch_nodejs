import express from 'express';
import brandController from '../controllers/brand.controller';
import upload from '../utils/multer';

const router = express.Router();

router.route('/')
    .post(upload.single('image'), brandController.create)
    
router.route('/admin')
    .get(brandController.getAllBrands)
export default router;
