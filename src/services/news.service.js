import cloudinary from '../utils/cloudinary';


exports.create = async (file) => {
    const data = await cloudinary.uploader.upload(file,{ folder: "news" })
    return data
    
} 

exports.delete = async (image) => {
    await cloudinary.uploader.destroy(image)
    return true
    
}