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
    async updateUser(id,data){
        return userModel.findByIdAndUpdate(
            id,
            data,
            { returnDocument: "after", upsert: true }
        ).lean()
    }

}

module.exports = new UserService;