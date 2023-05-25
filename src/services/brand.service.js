import brandModel from '../models/brand.model';
import watchModel from '../models/watch.model';
import cloudinary from '../utils/cloudinary';
import moment from 'moment';
import 'moment/locale/vi';

exports.findAll = async currentPage => {
    try {
        const brandPerPage = 10; // number of brand in a page
        const skipPage = (currentPage-1) * brandPerPage;

        let brands = await brandModel
            .find()
            .skip(skipPage)
            .limit(brandPerPage)
            .sort({updatedAt: -1})
            .populate('createBy', ['_id', 'fullName'])
            .populate('updateBy', ['_id', 'fullName'])
            .lean()

        for (let i=0; i<brands.length; i++){
            brands[i] = {
                ...brands[i],
                createdAt: moment(brands[i].createdAt).format('lll'),
                updatedAt: moment(brands[i].updatedAt).format('lll')
            }
        }

        const numberOfBrands = await brandModel.countDocuments({});
        const pageNumber = Math.ceil(numberOfBrands/10);
        return {
            success: true,
            brands,
            pageNumber,
            currentPage
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            msg: 'Internal server error'
        }
    }
}

exports.create = async (data, userId) => {
    try {
        // upload image
        const uploadImage = await cloudinary.uploader.upload(data.imageUrl, {folder: 'brands'});

        const newBrand = new brandModel({
            ...data,
            imageUrl: uploadImage.secure_url,
            imageId: uploadImage.public_id,
            createBy: userId,
            updateBy: userId
        })
        await newBrand.save();
        return {
            success: true,
            msg: 'Thêm thương hiệu mới thành công'
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            msg: 'Internal server error'
        }
    }
}

exports.update = async (data, brandId, userId) => {
    try {
        // if update data contain image
        if (data.imageUrl){
            const uploadImage = await cloudinary.uploader.upload(data.imageUrl, {folder: 'brands'});
            data = {
                ...data,
                imageUrl: uploadImage.secure_url,
                imageId: uploadImage.public_id
            }
        }

        const updateBrand = await brandModel.findByIdAndUpdate(brandId, {...data, updateBy: userId});
        if (!updateBrand){
            // delete new image in cloudinary
            if (data.imageId){
                await cloudinary.uploader.destroy(data.imageId);
            }
            return {
                success: false,
                msg: 'Không tìm thấy thương hiệu'
            }
        }
        else {
            // delete old image in cloudinary
            await cloudinary.uploader.destroy(updateBrand.imageId)
        }
        
        return {
            success: true,
            msg: 'Cập nhật thông tin thương hiệu thành công'
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            msg: 'Internal server error'
        }
    }
}

exports.delete = async brandId => {
    try {
        const watch = await watchModel.findOne({brandId});
        if (watch){
            return {
                success: false,
                msg: 'Bạn phải xóa tất cả sản phẩm của thương hiệu này trước!'
            }
        }

        const deteleBrand = await brandModel.findByIdAndDelete(brandId);
        if (!deteleBrand){
            return {
                success: false,
                msg: 'Không tìm thấy thương hiệu'
            }
        }
        // delete image in cloudinary
        await cloudinary.uploader.destroy(deteleBrand.imageId);

        return {
            success: true,
            msg: 'Xóa thương hiệu thành công'
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            msg: 'Internal server error'
        }
    }
}