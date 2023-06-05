import commentServices from '../services/comment.service'
import cloudinary from "../utils/cloudinary";
class CommentController {
    async createComment(req, res) {
        try {
            if (req.session.authState) {
                if (req.body) {
                    if (req.file) {
                        var imageOptions = await cloudinary.uploader.upload(req.file.path, {
                            folder: "comments",
                        });
                    }
                    const rate = parseInt(req.body.rate)
                    const user = req.session.authState.user
                    const data = {
                        userId: user._id,
                        watchId: req.params.id,
                        content: req.body.content,
                        rate: req.body.rate > 0 ? rate : 1,
                        imageUrl: imageOptions ? imageOptions.url : "",
                        imageId: imageOptions ? imageOptions.public_id : ""
                    }
                    const result = await commentServices.create(data)

                    res.redirect('back')

                }
            } else {
                res.redirect('/user/login')
            }


        } catch (error) {
            console.log(error)
        }
    }

    async feedback(req, res){
        try {
            const result = await commentServices.updateComment(req.params.id, {content: req.body.feedback})
            res.redirect('back')
        } catch (error) {
        console.log(error);
        }
    }

}

module.exports = new CommentController;
