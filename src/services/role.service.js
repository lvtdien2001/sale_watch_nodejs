import roleModel from '../models/role.model'

class RoleService{
    async create(data){
        return await roleModel.create(data)
    }

    async findById(id){
        return await roleModel.findById(id)
    }
    async findAll(){
        return await roleModel.find({})
    }
}

module.exports = new RoleService