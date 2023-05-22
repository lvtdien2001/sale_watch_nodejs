import brandService from '../services/brand.service';

// @route GET /brand/admin?currentPage=...
// @desc get all brand
// @access public
exports.getAllBrands = async (req, res) => {
    try {
        const currentPage = req.query.currentPage || 1;
        const response = await brandService.findAll(currentPage);

        res.render('admin/brand.hbs', {layout: 'admin', response, message: req.session.message});
    } catch (error) {
        console.log(error);
        res.send('Internal server error')
    }
}

// @route POST /brand
// @desc create a new brand
// @access private
exports.create = async (req, res) => {
    if (!req.body.name || !req.file) {
        return res.json({
            status: 'err',
            msg: 'Tên thương hiệu và hình ảnh không thể bỏ trống'
        })
    }
    try {
        const userId = '646b0f511a0f2ec77988691b';

        const data = {
            name: req.body.name,
            imageUrl: req.file.path
        }

        const response = await brandService.create(data, userId);
        req.session.message = response.msg;
        return res.redirect('/brand/admin');
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            msg: 'Internal server error'
        })
    }
}

