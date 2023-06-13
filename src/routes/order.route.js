import express from 'express';
import orderController from '../controllers/order.controller';



const router = express.Router();

router.get('/myorder',orderController.getMyOrder)
router.get('/myorder/:id',orderController.getMyOrderId)
router.get('/',orderController.get)
router.post('/',orderController.create)
router.get('/payment',orderController.getVnpayReturn)


export default router;
