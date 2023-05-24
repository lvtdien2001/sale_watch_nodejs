import brandRouter from './brand.route';
import newsRouter from './news.route'
import userRouter from './user.route'
const initRoutes = (app) => {
    app.use('/brand', brandRouter);
    app.use('/news', newsRouter);
    app.use('/user', userRouter);
}

export default initRoutes;
