import cloudinary from '../utils/cloudinary';

exports.create = async (image) => {
    await cloudinary.uploader.destroy('brands/tppcdruuix1yjkhztl2h')
    return true
    // await cloudinary.uploader.destroy()
}