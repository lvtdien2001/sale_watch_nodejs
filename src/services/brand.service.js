import brand from '../models/brand.model';
import cloudinary from '../utils/cloudinary';
import moment from 'moment';
import 'moment/locale/vi';

exports.findAll = async currentPage => {
    try {
        const brandPerPage = 10; // number of brand in a page
        const skipPage = (currentPage-1) * brandPerPage;

        let brands = await brand
            .findOne({_id: '646b147e070c132b69d3ff54'})
            .skip(skipPage)
            .limit(brandPerPage)
            .lean()

        for (let i=0; i<brands.length; i++){
            brands[i] = {
                ...brands[i],
                createdAt: moment(brands[i].createdAt).format('lll'),
                updatedAt: moment(brands[i].updatedAt).format('lll')
            }
        }

        const numberOfBrands = await brand.countDocuments({});
        const pageNumber = Math.ceil(numberOfBrands/10);
        return {
            success: true,
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

exports.create = async (data, userId) => {
    try {
        // upload image
        const uploadImage = await cloudinary.uploader.upload(data.imageUrl, {folder: 'brands'});

        const newBrand = new brand({
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