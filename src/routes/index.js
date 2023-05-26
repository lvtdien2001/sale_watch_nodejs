import { verifyAdmin } from '../middleware/auth';
import adminRoute from './admin.route';
import brandRouter from './brand.route';
import userRouter from './user.route';
import roleRouter from './role.route';
import watchRouter from './watch.route';

const initRoutes = (app) => {
    app.use('/brand', brandRouter);
    app.use('/role', roleRouter);
    app.use('/user', userRouter);
    app.use('/watch', watchRouter);
    app.use('/admin', verifyAdmin, adminRoute);
    
    app.use('/:notfound', (req, res) => res.render('err404', {layout: false}))
    app.use('/', (req, res) => res.render('home'))
}

export default initRoutes;
