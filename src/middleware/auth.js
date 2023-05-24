import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const verifyToken = (req, res, next) => {
    const token = req.session.authState?.accessToken;
<<<<<<< HEAD
    if(req.url.match(/role/i)){
        return next(); 
    }
    switch(req.url){
        case '/':
            return next();
        case '/user/login':
            return next();
        case '/user/register':
            return next();
          
    }
=======

    const isPublicRoute = /[/][^cart]/.test(req.url) || /[/][^admin][/w]/.test(req.url);

    if (isPublicRoute)
        return next();

>>>>>>> 104b6740fe915a621012e9a69f553d48de70e1cb
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
