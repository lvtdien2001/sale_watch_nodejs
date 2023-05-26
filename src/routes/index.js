import adminRoute from './admin.route';
import brandRouter from './brand.route';
import userRouter from './user.route';
import watchRouter from './watch.route';

import brandService from '../services/brand.service';
import watchService from '../services/watch.service';
import { verifyRole } from '../middleware/role';

const initRoutes = (app) => {
    app.use('/brand', brandRouter);
    app.use('/user', userRouter);
    app.use('/watch', watchRouter);
    app.use('/admin', verifyRole, adminRoute);
    
    app.use('/:notfound', (req, res) => res.render('err404', {layout: false}))
    app.use('/', async (req, res) => {
        try {
            const brandId = req.query.brand;
            const brands = (await brandService.findAll()).brands;

            // Lọc sản phẩm theo thương hiệu
            if (brandId){
                const newWatches = (await watchService.findAll({brandId}, 12, {createdAt: -1})).watches;
                const hotWatches = (await watchService.findAll({brandId}, 4, {currentQuantity: 1})).watches;
                return res.render('home', {user: req.session.authState?.user, brands, newWatches, hotWatches})
            }
            
            const newWatches = (await watchService.findAll({}, 12, {createdAt: -1})).watches;
            const hotWatches = (await watchService.findAll({}, 4, {currentQuantity: 1})).watches;
            res.render('home', {user: req.session.authState?.user, brands, newWatches, hotWatches})
        } catch (error) {
            console.log(error);
            res.redirect('/');
        }
    })
}

export default initRoutes;
