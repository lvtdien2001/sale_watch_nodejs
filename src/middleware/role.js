export const verifyRole = (req, res, next) => {
    if (req.session.authState?.user.isAdmin || req.session.authState?.user.roles.length>0)
        return next();
    else return res.redirect('/user/login');
}

export const verifyAddProduct = (req, res, next) => {
    let isRole = 0;
    if(req.session.authState?.user.roles.length>0){
        for(let i=0; i< req.session.authState?.user.roles.length;i++){
            if(req.session.authState?.user.roles[i].roleId === '647db266fc95a902d1b48ee3' || req.session.authState?.user.isAdmin){
                isRole = 1;
                break;
            }
        }
        if(isRole === 1){
            return next()
        }else{
            return res.redirect('/admin')
        } 
            
    }else{
        return res.redirect('/')
    }
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
