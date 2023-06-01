import commentServices from '../services/comment.service'

class CommentController{
    async createComment(req, res){
        try {
            if(req.body){
                res.json({
                    ...req.body,
                    idWatch:req.params.id
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new CommentController;
