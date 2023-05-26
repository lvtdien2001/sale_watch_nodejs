import userModel from '../models/user.model'

class UserService {
    async create(infoUser){
        return await userModel.findOneAndUpdate(
            {username:infoUser.username},
            infoUser,
            { returnDocument: "after", upsert: true }
        )
    }

    async checkUsername(username){
        const isUsername=await userModel.findOne({username})
        return  isUsername ? true : false
    }

    async checkPhoneNumber(phoneNumber){
        const isPhone=await userModel.findOne({phoneNumber})
        return  isPhone ? true : false
    }

    
    async findByUsername(username){
        return await userModel.findOne({username}).lean()
    }

    async findById(id){
        return await userModel
            .findById(id)
            .populate({
                path: 'roles',
                populate: {path: 'roleId'}
            })
            .lean()
    }

    async findAllUser(){
        return await userModel.find({isAdmin:false}).lean()
    }

    async updateUser(id, data){
        return await userModel.findByIdAndUpdate(id, data,{
            new:true
        })
    }

    async updateRole(id, data){
         return await this.updateUser(id, {roles:data});
    }
}

module.exports = new UserService;