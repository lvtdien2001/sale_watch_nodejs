import watchModel from '../models/watch.model';
import brandModel from '../models/brand.model';
import cloudinary from '../utils/cloudinary';
import moment from 'moment';
import 'moment/locale/vi'

exports.findAll = async currentPage => {
    try {
        const watchPerPage = 10; // number of product in a page
        const skipPage = (currentPage-1) * watchPerPage;

        let watches = await watchModel
            .find()
            .skip(skipPage)
            .limit(watchPerPage)
            .populate('brandId', ['_id', 'name', 'imageUrl'])
            .lean()

        const numberOfWatches = await watchModel.countDocuments({});
        const pageNumber = Math.ceil(numberOfWatches/10);

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
            pageNumber
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

exports.delete = async watchId => {
    try {
        const deleteWatch = await watchModel.findByIdAndDelete(watchId);

        if (!deleteWatch)
            return {
                success: false,
                msg: 'Không tìm thấy sản phẩm'
            }
        
        return {
            success: true,
            deleteWatch,
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
