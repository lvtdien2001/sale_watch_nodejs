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
            helpers: {
                increase: num => num+1,
                showMessage: () => {
                    if (req.session.message){
                        const bg = req.session.success ? 'bg-success' : 'bg-danger';
                        return `<div class="position-fixed top-0 end-0 p-3" style="z-index: 11">
                                    <div id="message-toast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                                        <div class="d-flex ${bg} text-white">
                                            <div id="message-content" class="toast-body fs-6">
                                                ${req.session.message}
                                            </div>
                                            <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                                        </div>
                                    </div>
                                </div>`
                    }
                    return null;
                },
                clearMessage: () => {
                    if (req.session.message){
                        req.session.message = undefined
                    }
                },
                paginate: pageNumber => {
                    let template = '';
                    for (let i=1; i<=pageNumber; i++){
                        template += response.currentPage==i 
                            ? `<li class="page-item active"><a class="page-link" href="/admin/brand?currentPage=${i}">${i}</a></li>`
                            : `<li class="page-item"><a class="page-link" href="/admin/brand?currentPage=${i}">${i}</a></li>`
                    }
                    return template;
                },
                checkPageNumber: pageNumber => pageNumber>1
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
