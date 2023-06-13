import News from '../models/news.model';
import cloudinary from '../utils/cloudinary';
import moment from 'moment';
import 'moment/locale/vi'

import NewsService from '../services/news.service';

// @route GET /admin/news
// @desc managed news
// @access private (admin)
exports.getAllByAdmin = async(req, res) => {
    try {
        const currentPage = req.query.currentPage || '1';
        const watchPerPage = 3;
        const response = await NewsService.findAll(currentPage, watchPerPage);
        res.render('admin/news',{
            layout:'admin',
            news: response.news,
            helpers: {
                formatDate: date => moment(date).format('lll'),
                increaseNumber: number => (currentPage - 1) * watchPerPage + number + 1

            },
            pageNumber: response.pageNumber,
            currentPage
        })
    } catch (error) {
        console.log(error);
    }
}

// @route POST /news
// @desc create a new news
// @access private (admin)
exports.create = async (req, res) => {
   
    try { 
        const {title, content} = req.body;
        const result = await cloudinary.uploader.upload(req.file.path, { folder: "news" });
        const news = new News({
            ...req.body,
            imageUrl:result.secure_url,
            imageId: result.public_id
            
        })
    
    
        await news.save()
        .then(() => res.redirect('/admin/news'))
        ;
        
    } catch (error) {
        console.log(error);
    }
}

// @route GET /news
// @desc create a new brand
// @access public
exports.get = async (req, res) => {
   
    try { 
        const currentPage = req.query.currentPage || '1';
        const watchPerPage = 5; // number of product in a page
        const skipPage = (currentPage-1) * watchPerPage;
        const news = await News.find().sort({createdAt: -1})
                                .skip(skipPage)
                                .limit(watchPerPage)
                                .lean();

        const numberOfWatches = await News.countDocuments({});
        const pageNumber = Math.ceil(numberOfWatches/10);
        res.render('news/home',{
            layout: 'main',
            news,
            helpers: {
                formatDate: date => moment(date).format('lll')

            },
            pageNumber
        }
        )
        
    } catch (error) {
        console.log(error);
    }
}

// @route delete /admin/delete/news/:id
// @desc delete a news
// @access private (admin)
exports.delete = async (req, res) => {
   
    try {
        const deleteImage = await News.findOne({_id: req.params.id})
        console.log(deleteImage)
        await NewsService.delete(deleteImage.imageId)
        console.log(deleteImage.imageId)
        await News.findByIdAndDelete(req.params.id)
        
        res.redirect('/admin/news')
    } catch (error) {
        console.log(error);
    }
}
// @route get /news/edit/:id
// @desc get data a news
// @access private (admin)
exports.getNewsById = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await News.findOne({_id: id}).lean();
        res.render('news/detail',{data})
    } catch (error) {
        console.log(error);
    }
}
// @route get /news/edit/:id
// @desc get data a news
// @access private (admin)
exports.getById = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await News.findOne({_id: id}).lean();
        res.render('admin/edit',{ layout: 'admin',data})
    } catch (error) {
        console.log(error);
    }
}

// @route update /news/updateInfo/:id
// @desc update info of news
// @access private (admin)
exports.updateInformation = async (req, res) => {
    try {
        const id = req.params.id;
        const {title, content} = req.body
        const condition = {_id: id};
        const update = {
            title,
            content
        }
        await News.findOneAndUpdate( condition , update);
        res.redirect(`/admin/news/edit/${id}`)
    } catch (error) {
        console.log(error);
    }
}

// @route update /news/updateImage/:id
// @desc update image of news
// @access private (admin)
exports.updateImage = async (req, res) => {
    try {
        const id = req.params.id;
        const condition = {_id: id};
        const deleteImage = await News.findOne(condition);
        await NewsService.delete(deleteImage.imageId)   

        const result = await NewsService.create(req.file.path)
        console.log(result)
        
        const update = {
            imageUrl: result.secure_url,
            imageId: result.public_id
        }
        await News.findOneAndUpdate( condition , update);


        res.redirect(`/admin/news/edit/${id}`)
    } catch (error) {
        console.log(error);
    }
}