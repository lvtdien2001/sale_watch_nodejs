export const verifyRole = (req, res, next) => {
  if (req.session.authState?.user.isAdmin || req.session.authState?.user.roles.length > 0)
    return next();
  else return res.redirect("/user/login");
};

export const verifyAddProduct = (req, res, next) => {
  const roles = req.session.authState?.user.roles
  if (req.session.authState?.user.isAdmin) {
    return next();
  } else if (roles.length > 0) {
    for (let i = 0; i < roles.length; i++) {
      if (req.session.authState?.user.isAdmin || roles[i].roleId === "647db266fc95a902d1b48ee3") {
        return next();
      } else {
        return res.redirect("/admin");
      }
    }
  }
};

export const verifyUpdateProduct = (req, res, next) => {
  const roles = req.session.authState?.user.roles
  if (req.session.authState?.user.isAdmin) {
    return next();
  } 
  else if (roles.length > 0) {
    for (let i = 0; i < roles.length; i++) {
      if (req.session.authState?.user.isAdmin || roles[i].roleId === "6470783d442bb7582321cdbc") {
        return next();
      } 
      else {
        return res.redirect("/admin");
      }
    }
  }
};

export const verifyDeleteProduct = (req, res, next) => {
  const roles = req.session.authState?.user.roles
  if (req.session.authState?.user.isAdmin) {
    return next();
  } 
  else if (roles.length > 0) {
    for (let i = 0; i < roles.length; i++) {
      if (req.session.authState?.user.isAdmin || roles[i].roleId === "646f04704fcf7491a6c1e9b0") {
        return next();
      } 
      else {
        return res.redirect("/admin");
      }
    }
  }
};

export const verifyAddBrand = (req, res, next) => { 
  const roles = req.session.authState?.user.roles
  if (req.session.authState?.user.isAdmin) {
    return next();
  } 
  else if (roles.length > 0) {
    for (let i = 0; i < roles.length; i++) {
      if (req.session.authState?.user.isAdmin || roles[i].roleId === "64705ea58882950102523b10") {
        return next();
      } 
      else {
        return res.redirect("/admin");
      }
    }
  }
};

export const verifyUpdateBrand = (req, res, next) => { 
  const roles = req.session.authState?.user.roles
  if (req.session.authState?.user.isAdmin) {
    return next();
  } 
  else if (roles.length > 0) {
    for (let i = 0; i < roles.length; i++) {
      if (req.session.authState?.user.isAdmin || roles[i].roleId === "647057a4a910f2cec64327c1") {
        return next();
      } 
      else {
        return res.redirect("/admin");
      }
    }
  }
};

export const verifyDeleteBrand = (req, res, next) => { 
  const roles = req.session.authState?.user.roles
  if (req.session.authState?.user.isAdmin) {
    return next();
  } 
  else if (roles.length > 0) {
    for (let i = 0; i < roles.length; i++) {
      if (req.session.authState?.user.isAdmin || roles[i].roleId === "6470570a60def8b8d021c2b0") {
        return next();
      } 
      else {
        return res.redirect("/admin");
      }
    }
  }
};

export const verifyCreateAddReceipt = async (req, res, next) => {
  const user = req.session.authState?.user;

  if (!user)
    return res.redirect('/user/login');

  if (user.isAdmin)
    return next();

  if (user.roles.map(role => role.roleId).includes('647db28bfc95a902d1b48ee6'))
    return next();
  else{
    req.session.message = 'Truy cập bị từ chối, bạn không có quyền thực hiện chức năng này!';
    req.session.success = false;
    return res.redirect('back');
  }
}

