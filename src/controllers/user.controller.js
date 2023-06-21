import userService from "../services/user.service";
import cartService from '../services/cart.service';
import codeService from "../services/code.service";
import cloudinary from "../utils/cloudinary";
import * as argon2 from "argon2";
import jwt from 'jsonwebtoken';
import mailer from '../utils/mailler'
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
          messageEditUser:req.session.messageEditUser,
          messagePhone:req.session.messagePhone
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
      req.session.messagePhone= undefined
      req.session.messageEditUser= undefined
      const userLogin = req.session.authState?.user
      if(userLogin){
        let isPhoneNumber = await userService.checkPhoneNumberInUsers(
          req.body.phoneNumber,
          userLogin.email
        );
        const str1 = JSON.stringify(req.body);
        const str2 = JSON.stringify({
          fullName:userLogin.fullName,
          phoneNumber:userLogin.phoneNumber
        });
        // console.log(str1 == str2);
        if(isPhoneNumber){
            req.session.messagePhone = 'Số điện thoại đã được đăng ký'
            res.redirect('back')
        }
        else if(str1 == str2){
          req.session.messagePhone = 'Bạn chưa chỉnh sửa bất kỳ thông tin nào'
          res.redirect('back')
        }
        else{
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
                req.session.messageEditUser = 'Chỉnh sửa thông tin thành công'
                res.redirect('back')
              }
            }else{
              let result = await userService.updateUser(userLogin._id,req.body)
              if(result){
                req.session.authState.user= result
                req.session.messageEditUser = 'Chỉnh sửa thông tin thành công'
                res.redirect('back')
              }
            }
        }
        
      }else{
        res.redirect('/user/login')
      }
    } catch (error) {
      console.log(error)
    }
  }

  async forgotPass(req, res){
    try {
      const isEmail = await userService.findByEmail(req.body?.email)
      if(isEmail){
        let numbers = '';
  
          for (let i = 0; i < 6; i++) {
            let randomNumber = Math.floor(Math.random() * 10);
            numbers+=randomNumber;
          }
          const result = await mailer.sendMail(req.body.email , numbers, 'Mã Xác Nhận')
          if(result){
            const code = await codeService.create({
              codeNumber:numbers,
              emailUser: req.body.email,
              resetTokenExpires:Date.now() + 60000
            })
            req.session.verification= 'Mã xác thực đã được gửi'
            res.render('login',{
              verification: req.session.verification,
              emailUser:req.body.email
            })
          }
      }
      else{
        res.render('login',{
          notEmail: 'Tài khoản không tồn tại !'
        })
      }
      
    } catch (error) {
      console.log(error)
    }
  }

  async verification(req, res){
    try {
        const forgotCode = await codeService.findAllByEmail(req.params.emailUser)
        if(forgotCode.length!=0){
          if( forgotCode[0].codeNumber == req.body.verification){
            res.render('user-forgot',{
              emailUser:req.params.emailUser
            })
          }else{
            req.session.verification= 'Mã xác thực không chính xác'
            res.render('login',{
              verification: req.session.verification,
              emailUser:req.params.emailUser
            })
          }
        }else{
          req.session.verification= 'Mã xác thực không chính xác hoặc đã hết hạn'
            res.render('login',{
              verification: req.session.verification,
              emailUser:req.params.emailUser
            })
        }
    } catch (error) {
      console.log(error);
    }
  }

  
  async updatePass(req, res){
    try {
      const passHashed = await argon2.hash(req.body.password);
      const result = await userService.updatePassword({email:req.params.emailUser}, {password:passHashed})
      if(result){
        req.session.messageForgot = 'Mật khẩu đã được cập nhật'
        res.render('user-forgot',{
          message:req.session.messageForgot,
          emailUser:req.params.emailUser
        })
      }
    } catch (error) {
      console.log(error);
    }
  }

  async resend(req, res){
    try {
      if(req.params.emailUser){
        let numbers = '';
          for (let i = 0; i < 6; i++) {
            let randomNumber = Math.floor(Math.random() * 10);
            numbers+=randomNumber;
          }
          const result =await mailer.sendMail(req.params.emailUser , numbers, 'Mã Xác Nhận')
          if(result){
            const code = await codeService.create({
              codeNumber:numbers,
              emailUser: req.params.emailUser
            })
            req.session.verification= 'Mã xác thực đã được gửi lại'
            res.render('login',{
              verification: req.session.verification,
              emailUser: req.params.emailUser
            })
          }
      }else{
        res.render('login',{
          notEmail: 'Tài khoản không tồn tại !'
        })
      }
    } catch (error) {
      console.log(error);
    }
  }

  displayChangePass(req, res){
    try {
      res.render('change-pass',{id:req.params.id})
    } catch (error) {
      console.log(error);
    }
  }

  async changePass(req, res){
    try {
      const userChangePass = await userService.findById(req.params.id)
      const decryptionPass = await argon2.verify(userChangePass.password, req.body.passwordOld)
      if(decryptionPass){
        const passHashed = await argon2.hash(req.body.passwordNew);
        const result = await userService.updateUser(req.params.id, {password:passHashed})
        if(result){
          res.render('change-pass',{
            layout: 'main',
            id:req.params.id,
            messageSuccess:'Đổi mật khẩu thành công'
          })
        }
      }else{
      res.render('change-pass',{
        layout: 'main',
        id:req.params.id,
        messageFailure:'Mật khẩu bạn nhập không chính xác'
      })

      }
    } catch (error) {
      console.log(error);
    }
  }

  async displayUserManager(req, res){
    try {
      const disableUser = await userService.disableUser();
      const unlockUser = await userService.unlockUser();
      res.render('admin/user',{
        layout:'admin',
        disableUser,
        unlockUser,
        messageUnlock:req.session.messageUnlock,
        messageDisable:req.session.messageDisable
      })
    } catch (error) {
      console.log(error)
    }
  }

  async unlockUser(req, res){
    try {
      if(req.query?.type =='unlock'){
        const unlockUser = await userService.unlockUserUpdate(req.query.id)
        if(unlockUser){
          req.session.messageUnlock= 'Mở khóa tài khoản thành công'
          req.session.messageDisable= undefined
          res.redirect('back')
        }
      }else{
        const disableUser = await userService.disableUserUpdate(req.query.id)
        if(disableUser){
          req.session.messageDisable= 'Tài khoản đã bị khóa'
          req.session.messageUnlock= undefined
          res.redirect('back')
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = new userController();
