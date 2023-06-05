import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const verifyToken = (req, res, next) => {
    const token = req.session.authState?.accessToken;
    switch(req.url){
        case '/':
            return next();
        case '/user/login':
            return next();
        case '/user/register':
            return next(); 
    }


    const isPublicRoute = req.path==='/' || !(new RegExp('/admin').test(req.path));

    if (isPublicRoute)
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
