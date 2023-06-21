import express from 'express';
import NewsController from '../controllers/news.controller';



const router = express.Router();


router.get('/',NewsController.get)

router.get('/:id',NewsController.getNewsById)

export default router;
