import watchModel from '../models/watch.model';
import brandModel from '../models/brand.model';
import cloudinary from '../utils/cloudinary';
import moment from 'moment';
import 'moment/locale/vi'

exports.findAll = async (condition, limit, sort) => {
    try {
        const watches = await watchModel
            .find(condition)
            .limit(limit)
            .sort(sort)
            .lean()

        return {
            success: true,
            watches
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            msg: 'Internal server error'
        }
    }
}

exports.findAllAndPage = async (currentPage, condition, watchPerPage) => {
    try {
        if (!watchPerPage)
            watchPerPage = 10;
        const skipPage = (currentPage-1) * watchPerPage;

        let watches = await watchModel
            .find(condition)
            .skip(skipPage)
            .limit(watchPerPage)
            .sort({ updatedAt: -1 })
            .populate('brandId', ['_id', 'name', 'imageUrl'])
            .populate('createBy', ['_id', 'fullName'])
            .populate('updateBy', ['_id', 'fullName'])
            .lean()

        const numberOfWatches = await watchModel.countDocuments(condition);
        const pageNumber = Math.ceil(numberOfWatches/watchPerPage);

        const brands = await brandModel.find().lean();

        for (let i=0; i<watches.length; i++){
            watches[i] = {
                ...watches[i],
                createdAt: moment(watches[i].createdAt).format('lll'),
                updatedAt: moment(watches[i].updatedAt).format('lll')
            }
        }

        return {
            success: true,
            watches,
            brands,
            pageNumber,
            currentPage,
            watchPerPage,
            numberOfWatches
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            msg: 'Internal server error'
        }
    }
}

exports.findById = async watchId => {
    try {
        const result = await watchModel
            .findById(watchId)
            .populate('brandId', ['_id', 'name', 'imageUrl'])
            .lean()
        
        if (!result){
            return {
                success: false,
                msg: 'Không tìm thấy sản phẩm'
            }
        }

        const brands = await brandModel.find().lean();

        return {
            success: true,
            watch: result,
            brands
        }
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
        const uploadImage = await cloudinary.uploader.upload(data.imageUrl, {folder: 'watches'});
        
        const newWatch = new watchModel({
            ...data,
            imageUrl: uploadImage.secure_url,
            imageId: uploadImage.public_id,
            createBy: userId,
            updateBy: userId
        })
        await newWatch.save();
        return {
            success: true,
            msg: 'Thêm sản phẩm mới thành công'
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            msg: 'Internal server error'
        }
    }
}

exports.update = async (data, watchId, userId) => {
    try {
        // if update data contain image
        if (data.imageUrl){
            const uploadImage = await cloudinary.uploader.upload(data.imageUrl, {folder: 'watches'});
            data = {
                ...data,
                imageUrl: uploadImage.secure_url,
                imageId: uploadImage.public_id
            }
        }

        const updateWatch = await watchModel.findByIdAndUpdate(watchId, {...data, updateBy: userId});
        if (!updateWatch){
            // delete new image in cloudinary
            if (data.imageId){
                await cloudinary.uploader.destroy(data.imageId);
            }
            return {
                success: false,
                msg: 'Không tìm thấy sản phẩm'
            }
        }
        if (data.imageId) {
            // delete old image in cloudinary
            await cloudinary.uploader.destroy(updateWatch.imageId)
        }
        
        return {
            success: true,
            msg: 'Cập nhật thông tin sản phẩm thành công'
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            msg: 'Internal server error'
        }
    }
}

exports.delete = async watchId => {
    try {
        const deleteWatch = await watchModel.findByIdAndDelete(watchId);

        if (!deleteWatch)
            return {
                success: false,
                msg: 'Không tìm thấy sản phẩm'
            }
        
        await cloudinary.uploader.destroy(deleteWatch.imageId);

        return {
            success: true,
            msg: 'Xóa sản phẩm thành công'
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            msg: 'Internal server error'
        }
    }
}

exports.getQuantity = async watchId => {
    try {
        const watch = await watchModel.findById(watchId);

        
        return watch.currentQuantity || -1

    } catch (error) {
        console.log(error);
        return {
            success: false,
            msg: 'Internal server error'
        }
    }
}
