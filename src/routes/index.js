import brandRouter from './brand.route';
import newsRouter from './news.route';

const initRoutes = (app) => {
    app.use('/brand', brandRouter);
    app.use('/news', newsRouter);
    
}

export default initRoutes;
