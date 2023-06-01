import  commentModel from '../models/comment.model'

class CommentServices {
    async create(data){
        return await commentModel.create(
            data
        )
    }
    
}

module.exports = new CommentServices