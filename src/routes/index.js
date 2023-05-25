import adminRoute from './admin.route';
import brandRouter from './brand.route';
import userRouter from './user.route';
import watchRouter from './watch.route';

const initRoutes = (app) => {
    app.use('/brand', brandRouter);
    app.use('/user', userRouter);
    app.use('/watch', watchRouter);
    app.use('/admin', adminRoute);
    
    app.use('/:notfound', (req, res) => res.render('err404', {layout: false}))
    app.use('/', (req, res) => res.render('home', {
        helpers: {
            getAuthBtn: () => {
                if (req.session.authState){
                    return ` <div class="dropdown">
                                <button class="btn btn-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="fas fa-user"></i>
                                </button>
                                <ul class="dropdown-menu dropdown-menu-end">
                                    <li><a class="dropdown-item" href="#">#1</a></li>
                                    <li><a class="dropdown-item" href="#">#2</a></li>
                                    <li>
                                        <a class="dropdown-item text-danger" href="/user/logout">
                                            <i class="fas fa-sign-out-alt"></i> Đăng xuất
                                        </a>
                                    </li>
                                </ul>
                            </div>`
                }
                else return `<button class="header-btn-link"><a class="header-link" href="/user/login"><i class="fas fa-user"></i> Đăng nhập</a></button>`
            }
        }
    }))
}

export default initRoutes;
