export const verifyRole = (req, res, next) => {
    if (req.session.authState?.user.isAdmin || req.session.authState?.user.roles.length>0)
        return next();
    else return res.redirect('/user/login');
}

export const verifyAddProduct = (req, res, next) => {

}

export const verifyUpdateProduct = (req, res, next) => {
    
}

export const verifyDeleteProduct = (req, res, next) => {
    
}

export const verifyAddBrand = (req, res, next) => {
    
}

export const verifyUpdateBrand = (req, res, next) => {
    
}

export const verifyDeleteBrand = (req, res, next) => {
    
}
