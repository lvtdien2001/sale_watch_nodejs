import express from 'express';
import roleController from '../controllers/role.controller'
const router = express.Router();


router.post('/create', roleController.createRole)

export default router;