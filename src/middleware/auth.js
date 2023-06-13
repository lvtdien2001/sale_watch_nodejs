import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const verifyToken = (req, res, next) => {
    // const authHeader = req.header('Authorization');
    // const token = authHeader && authHeader.split(' ')[1];
    const token = req.session.authState?.accessToken;

    const isPrivateRoute = /\/+admin|order$/;

    if (isPrivateRoute.test(req.path) === false)
        return next();

    // Token not found
    if (!token) {
        return res.redirect('/user/login') 
    }

    try {
        
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        next();
    } catch (error) {
        console.log(error);
        return res.redirect('/user/login') 
    }
}

const verifyAdmin = (req, res, next) => {
    if (req.session.authState?.user.isAdmin) {
        next();
    }
    else {
        res.render('err404', {layout: false})
    }
}

export { verifyToken, verifyAdmin }
