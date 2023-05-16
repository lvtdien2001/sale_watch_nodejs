import brandRouter from './brand.route';

const initRoutes = (app) => {
    app.use('/brand', brandRouter);
}

export default initRoutes;
