import  codeModel from '../models/code.model'

class CodeServices {
    async create(data){
        try {
            return await codeModel.create(data)
            
        } catch (error) {
            console.log(error);
        }
    }

    async findAllByEmail(emailUser){
        return await codeModel.find({
            emailUser,
            resetTokenExpires: { $gt: Date.now() }
        })
        .sort({ createdAt: -1 })
        .lean()
    }

    // async updateComment(id,data){
    //     return commentModel.findByIdAndUpdate(id, {$push: { feedback: data }},{
    //         new:true
    //     })
    // }

}

module.exports = new CodeServices