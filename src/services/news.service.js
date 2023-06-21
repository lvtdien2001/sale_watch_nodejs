import newsModel from '../models/news.model';
import cloudinary from '../utils/cloudinary';


exports.findAll = async (currentPage, watchPerPage) => {
        
        // number of product in a page
        const skipPage = (currentPage-1) * watchPerPage;
        const news = await newsModel.find()
                                .sort({createdAt: -1})
                                .skip(skipPage)
                                .limit(watchPerPage)
                                .lean();

        const numberOfWatches = await newsModel.countDocuments({});
        const pageNumber = Math.ceil(numberOfWatches/watchPerPage);
        return {
            news,
            pageNumber
        }
}
exports.create = async (file) => {
    const data = await cloudinary.uploader.upload(file,{ folder: "news" })
    return data
    
} 

exports.delete = async (image) => {
    await cloudinary.uploader.destroy(image)
    return true
    
}