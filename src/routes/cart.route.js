import express from 'express';
import CartController from '../controllers/cart.controller';



const router = express.Router();

router.post('/', CartController.create)
router.get('/',CartController.get)


export default router;
