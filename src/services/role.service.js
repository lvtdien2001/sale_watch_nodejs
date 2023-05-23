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

    async updateRole(id, name){
        return await roleModel.findByIdAndUpdate(id,name,{new:true})
    }
    
    async deleteRole(id){
        return await roleModel.findByIdAndRemove(id)
    }
}

module.exports = new RoleService