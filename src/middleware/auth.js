import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const verifyToken = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.render('err404', {
            msg: 'Access token not found'
        }) 
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.userId = decoded.userId;
        req.roles = decoded.roles;
        next();
    } catch (error) {
        console.log(error);
        res.render('err404', {
            msg: 'Invalid access token'
        })
    }
}

export { verifyToken }
