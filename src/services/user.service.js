import userModel from '../models/user.model2'

class UserService {
    async create(infoUser){
        try {
            const userRegister = new userModel(infoUser)
            const result = await userRegister.save();
            return result
        } catch (error) {
            console.log(error+'thanh')
        }
    }

    async checkEmail(email){
        try {
            const isEmail=await userModel.findOne({email})
            return  isEmail ? true : false
        } catch (error) {
            console.log(error)
        }
        
    }

    async checkPhoneNumber(phoneNumber){
        const isPhone=await userModel.findOne({phoneNumber})
        return  isPhone ? true : false
    }

    
    async findByEmail(email){
        return await userModel.findOne({email}).lean()
    }
    async updateUser(id,data){
        return userModel.findByIdAndUpdate(
            id,
            data,
            { returnDocument: "after", upsert: true }
        ).lean()
        .exclude('password')
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