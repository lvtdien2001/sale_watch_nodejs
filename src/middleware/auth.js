import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const verifyToken = (req, res, next) => {
    // const authHeader = req.header('Authorization');
    // const token = authHeader && authHeader.split(' ')[1];
    const token = req.session.authState?.accessToken;

    switch(req.url){
        case '/':
            return next();
        case '/user/login':
            return next();
        case '/user/register':
            return next();
    }
    // Token not found
    if (!token) {
        return res.redirect('/user/login') 
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.userId = decoded.userId;
        req.roles = decoded.roles;
        req.isAdmin = decoded.isAdmin;
        next();
    } catch (error) {
        console.log(error);
        return res.redirect('/user/login') 
    }
}

const verifyAdmin = (req, res, next) => {
    if (req.isAdmin) {
        next();
    }
    else {
        res.render('err404', {
            msg: 'User is not admin'
        })
    }
}

const verifyAddProduct = (req, res, next) => {
    
}

export { verifyToken, verifyAdmin }
