import roleService from '../services/role.service'

class roleController{
    async displayAll(req, res){
        const result = await roleService.findAll()
    }

    async createRole(req, res){
        try {
            if(req.body){
                const result = await roleService.create(req.body)
                res.send(result)
            }
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new roleController