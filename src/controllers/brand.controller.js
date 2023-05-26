import brandService from '../services/brand.service';

// @route GET /admin/brand/admin?currentPage=...
// @desc get all brand
// @access public
exports.getAllBrands = async (req, res) => {
    try {
        const currentPage = req.query.currentPage || 1;
        const response = await brandService.findAll(currentPage);

        res.render('admin/brand', {
            layout: 'admin',
            response,
            message: req.session.message,
            success: req.session.success,
            helpers: {
                clearMessage: () => {
                    req.session.message = undefined;
                    req.session.success = undefined;
                }
            }
        });
    } catch (error) {
        console.log(error);
        req.session.message = 'Internal server error';
        req.session.success = false;
        return res.redirect('/admin/brand');
    }
}

// @route POST /admin/brand/add
// @desc create a new brand
// @access private
exports.create = async (req, res) => {
    if (!req.body.name || !req.file) {
        req.session.message = 'Tên thương hiệu và hình ảnh không thể bỏ trống'
        return res.redirect('/admin/brand')
    }
    try {
        const userId = req.session.authState?.user._id;

        const data = {
            name: req.body.name,
            imageUrl: req.file.path
        }

        const response = await brandService.create(data, userId);
        req.session.message = response.msg;
        req.session.success = response.success;
        return res.redirect('/admin/brand');
    } catch (error) {
        console.log(error);
        req.session.message = 'Internal server error';
        req.session.success = false;
        return res.redirect('/admin/brand');
    }
}

// @route POST /admin/brand/update/:id
// @access private
exports.update = async (req, res) => {
    try {
        const userId = req.session.authState?.user._id;
        const brandId = req.params.id;
        const data = {
            name: req.body.name,
            imageUrl: req.file?.path
        }

        const response = await brandService.update(data, brandId, userId);
        req.session.message = response.msg;
        req.session.success = response.success;
        return res.redirect('/admin/brand')
    } catch (error) {
        console.log(error);
        req.session.message = 'Internal server error';
        req.session.success = false;
        return res.redirect('/admin/brand');
    }
}

// @route POST /admin/brand/delete/:id
// @access private
exports.delete = async (req, res) => {
    try {
        const brandId = req.params.id;

        const response = await brandService.delete(brandId);
        req.session.message = response.msg;
        req.session.success = response.success;
        return res.redirect('/admin/brand');
    } catch (error) {
        console.log(error);
        req.session.message = 'Internal server error';
        req.session.success = false;
        return res.redirect('/admin/brand');
    }
}
