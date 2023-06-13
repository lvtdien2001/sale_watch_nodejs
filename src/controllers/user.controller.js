import userService from "../services/user.service";
import cartService from '../services/cart.service';
import cloudinary from "../utils/cloudinary";
import * as argon2 from "argon2";
import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer"
class userController {

  displayRegister(req, res){
    res.render('register')
  }


  // Dang ky
  async register(req, res) {
    try {
      if (req.body) {
        var isUsename = await userService.checkEmail(req.body.email);
        var isPhoneNumber = await userService.checkPhoneNumber(
          req.body.phoneNumber
        );
        if (!isUsename && !isPhoneNumber) {
          const passHashed = await argon2.hash(req.body.password);
          var imageUrl;
          if (req.file) {
            imageUrl = await cloudinary.uploader.upload(req.file.path, {
              folder: "user_avatars",
            });
          } else {
            imageUrl = {
              url: "https://res.cloudinary.com/duwct3sjp/image/upload/v1684387019/user_avatars/x5dgyyz7rcwrd1arw4ip.png",
              public_id: "user_avatars/ypcg0waiiamwztwqpnbk",
            };
          }
          const infoUser = {
            email: req.body.email,
            password: passHashed,
            fullName: req.body.fullName,
            phoneNumber: req.body.phoneNumber,
            imageUrl: imageUrl.url,
            imageId: imageUrl.public_id,
          };
          let result = await userService.create(infoUser);
          if(result){
            res.render('register', {messageSuccess: "Đăng Ký thành công"})
          }
        } else {
          if(isPhoneNumber){
            res.render('register', {
              messageFailure:'Số điện thoại đã đươc sử dụng',
          })
          }else if(isUsename){
            res.render('register', {
              messageFailure:'Email đã đươc sử dụng',
          })
          
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  displayLogin(req, res){
    if(req.session.authState){
      return res.redirect('/')
    }
    res.render('login')
  }
  async login(req, res){
    try {
        if(req.body){
            var user= await userService.findByEmail(req.body.email)
            if(user){
                const decryptionPass = await argon2.verify(user.password, req.body.password)
                if(decryptionPass){
                  // Tạo token
                  const accessToken = jwt.sign(
                    { userId: user._id, isAdmin: user.isAdmin, roles: user.roles },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '6h' }
                  )
                  req.session.authState = {
                    isAuthenticated: true,
                    accessToken,
                    user: {
                      ...user,
                      password: undefined
                    }
                  }  
                  // add cart from cookies to db
                  const cartsCookies = req?.cookies?.cart || [];
                  for(let i = 0; i< cartsCookies?.length ; i++) {
                      await cartService.create(cartsCookies[i].quantity,cartsCookies[i].watchId, user._id)
                  }
                  res.clearCookie("cart");
                  // req.session.username=user.username
                  // req.session.fullName=user.fullName
                  // res.send(req.session)
                  if (!user.isAdmin && user.roles.length===0)
                    res.redirect('/')
                  else res.redirect('/admin')
                }
                else{
                  res.render('login',{messageFailure:'Tên người dùng hoặc mật khẩu không hợp lệ'})
                } 
            }else{
              res.render('login',{messageFailure:'Tên người dùng hoặc mật khẩu khong hợp lệ'})
            }
        }
    } catch (error) {
        console.log(error)
    }
  }

  async logout(req,res){
    req.session.destroy((err) => {
        if (err) res.redirect('/');
        res.redirect('/user/login');
    })
  }

  async displayEditUser(req, res){
    try {
      if(req.session.authState){
        res.render('user-edit',{
          user:req.session.authState?.user,
          message:req.session.message
        })
      }else{
        res.redirect('/user/login')
      }

    } catch (error) {
      console.log(error)
    }
  }

  async editUser(req, res){
    try {
      const userLogin = req.session.authState.user
      if(req.body){
        if(req.file){
        const imageOptions = await cloudinary.uploader.upload(req.file.path, {
            folder: "user_avatars",
          });
          const data ={
            fullName : req.body.fullName,
            phoneNumber : req.body.phoneNumber,
            imageUrl: imageOptions?.url || undefined,
            imageId : imageOptions?.public_id  || undefined
          }
          let result = await userService.updateUser(userLogin._id,data)
          
          if(result){
            req.session.authState.user= result
            req.session.message = 'Chỉnh sửa thông tin thành công'
            res.redirect('back')
          }
        }else{
          let result = await userService.updateUser(userLogin._id,req.body)
          if(result){
            req.session.authState.user= result
            req.session.message = 'Chỉnh sửa thông tin thành công'
            res.redirect('back')
          }
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = new userController();
