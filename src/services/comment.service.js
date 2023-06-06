import  commentModel from '../models/comment.model'

class CommentServices {
    async create(data){
        try {
            return await commentModel.create(data)
            
        } catch (error) {
            console.log(error);
        }
    }

    async findAllByWatchId(watchId){
        return await commentModel.find({
            watchId
        })
        .populate('userId',['fullName'])
        .sort({ createdAt: -1 })
        .lean()
    }

    async updateComment(id,data){
        return commentModel.findByIdAndUpdate(id, {$push: { feedback: data }},{
            new:true
        })
    }

}

module.exports = new CommentServices