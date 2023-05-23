import { verifyAdmin } from '../middleware/auth';
import brandRouter from './brand.route';
import userRouter from './user.route';
import watchRouter from './watch.route';

const initRoutes = (app) => {
    app.use('/brand', brandRouter);
    app.use('/user', userRouter);
<<<<<<< HEAD
    app.use('/watch', watchRouter);
=======
    app.use('/admin', verifyAdmin, (req, res) => res.render('admin/home', {layout: 'admin'}))
>>>>>>> 18cc83310f9557655883e8c87b8ddd0fc26cfc1c
}

export default initRoutes;
