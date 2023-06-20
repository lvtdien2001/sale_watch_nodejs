import adminRoute from './admin.route';
import userRouter from './user.route';
import watchRouter from './watch.route';
import commentRouter from './comment.route';

import brandService from '../services/brand.service';
import watchService from '../services/watch.service';
import { verifyRole } from '../middleware/role';

const initRoutes = (app) => {
    app.use('/user', userRouter);
    app.use('/watch', watchRouter);
    app.use('/comment', commentRouter);
    app.use('/admin', verifyRole, adminRoute);
    
    // search
    app.use('/search', async (req, res) => {
        // Bỏ dấu tiếng Việt
        // const removeAccents = str => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');

        try {
            const searchValue = req.query.key;
            const currentPage = req.query.currentPage || 1;
            const watchPerPage = req.query.watchPerPage;
            const brandFilter = req.query.brand;
            const priceFilter = req.query.price;

            let priceCondition;
            switch(priceFilter){
                case '<2':
                    priceCondition = {$lt: 2000000};
                    break;
                case '2-5':
                    priceCondition = {$gt: 2000000, $lt: 5000000};
                    break;
                case '5-10':
                    priceCondition = {$gt: 5000000, $lt: 10000000};
                    break;
                case '10-20':
                    priceCondition = {$gt: 10000000, $lt: 20000000};
                    break;
                case '>20':
                    priceCondition = {$gt: 20000000};
                    break;
                default:
                    priceCondition = {$gt: 1000};
                    break;
            }

            let condition = {
                $text: {$search: searchValue},
                price: priceCondition
            }
            if (brandFilter && brandFilter!=='all'){
                condition = {
                    ...condition,
                    brandId: brandFilter
                }
            }

            const response = await watchService.findAllAndPage(
                currentPage, 
                condition,
                watchPerPage
            );

            const isEmpty = response.watches.length>0 ? false : true;
            // const brands = response.watches.reduce((brands, watch) => {
            //     if (!(brands?.includes(watch.brandId))) {
            //         return [...brands, watch.brandId];
            //     }
            //     return brands;
            // }, [])

            res.render('search', {
                watches: response.watches,
                searchValue,
                isEmpty,
                brands: response.brands,
                numberOfResult: response.numberOfWatches,
                pageNumber: response.pageNumber,
                currentPage: response.currentPage,
                user: req.session.authState?.user,
                brandFilter,
                priceFilter,
                helpers: {
                    setSearchKey: key => `key=${key}&watchPerPage=8&brand=${brandFilter}&price=${priceFilter}`
                }
            });
        } catch (error) {
            console.log(error);
            res.redirect('/');
        }
    })

    // 404 not found
    app.use('/:notfound', (req, res) => res.render('err404', {layout: false}))

    // Home
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
