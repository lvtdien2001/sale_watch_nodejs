import { verifyAdmin } from '../middleware/auth';
import brandRouter from './brand.route';
import userRouter from './user.route';
import watchRouter from './watch.route';

const initRoutes = (app) => {
    app.use('/brand', brandRouter);
    app.use('/user', userRouter);
    app.use('/watch', watchRouter);
    app.use('/admin', verifyAdmin, (req, res) => res.render('admin/home', {layout: 'admin'}))
}

export default initRoutes;
