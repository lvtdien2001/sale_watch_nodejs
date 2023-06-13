import express from 'express';
import CartController from '../controllers/cart.controller';



const router = express.Router();

router.post('/add/:id', CartController.create)
router.get('/',CartController.get)


router.post('/delete/:id', CartController.delete)
router.post('/update/:id', CartController.update)

export default router;
