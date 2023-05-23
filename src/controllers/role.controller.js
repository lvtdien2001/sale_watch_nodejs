import roleService from '../services/role.service'

class roleController{
    async displayAll(req, res){
        const result = await roleService.findAll()
    }
}

module.exports = new roleController