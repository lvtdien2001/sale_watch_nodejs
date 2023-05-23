import userService from "../services/user.service";
import cloudinary from "../utils/cloudinary";
import * as argon2 from "argon2";
import jwt from 'jsonwebtoken';
class userController {

  displayRegister(req, res){
    res.render('register')
  }


  // Dang ky
  async register(req, res) {
    try {
      if (req.body) {
        var isUsename = await userService.checkUsername(req.body.username);
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
            // roles:[
            //     {
            //         roleId:''
            //     },
            // ],
            username: req.body.username,
            password: passHashed,
            fullName: req.body.fullName,
            phoneNumber: req.body.phoneNumber,
            imageUrl: imageUrl.url,
            imageId: imageUrl.public_id,
          };
          var result = await userService.create(infoUser);
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
              messageFailure:'Tên người dùng đã đươc sử dụng',
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
            var user= await userService.findByUsername(req.body.username)
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

                  // req.session.username=user.username
                  // req.session.fullName=user.fullName
                  // res.send(req.session)
                  if (!user.isAdmin && user.roles.length===0)
                    res.redirect('/')
                  else res.redirect('/admin')
                }
                else{
                  res.render('login',{messageFailure:'sai mật khẩu'})
                } 
            }else{
              res.render('login',{messageFailure:'tên người dùng ko hợp lệ'})
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

  async displayProfile(req, res){
    if(req.params.id){
      // const result = await userService.findById(req.body.id)
      res.render('edit-user')
    }
  }

  async getAll(req, res){
    const result = await userService.findAllUser()
    res.json(result)
  }

  // async getUserById(req, res){
  //   if(req.body){
  //     const result = await userService.findById(req.body.id)
  //     res.send(result)
  //   }
  // }

  async updateUser(req, res){
    if(req.body){
      const result = await userService.updateUser(req.params.id, req.body)
      res.json(result)
    }
  }
}

module.exports = new userController();
