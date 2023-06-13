import addReceipService from '../services/addReceipt.service';
import watchService from '../services/watch.service';

// @route /admin/warehouse?currentPage=...&receiptPerPage=...
// @access private
exports.getHomePage = async (req, res) => {
    try {
        const currentPage = req.query.currentPage || 1;
        const receiptPerPage = req.query.receiptPerPage || 10;
        const watchPerPage = req.query.watchPerPage || 10;

        const rspWatch = await watchService.findAll(null, null, {name: 1});
        const rspPaginateWatch = await watchService.findAllAndPage(currentPage, {}, watchPerPage);
        const rspReceipt = await addReceipService.findAllAndPage(currentPage, receiptPerPage);

        res.render('admin/warehouse', {
            layout: 'admin',
            watches: rspWatch.watches,
            message: req.session.message,
            success: req.session.success,
            // paginate receipts
            receipts: rspReceipt.receipts,
            pageNumberOfReceipt: rspReceipt.pageNumber,
            currentPageOfReceipt: rspReceipt.currentPage,

            // paginate watches
            watchesOfPage: rspPaginateWatch.watches,
            pageNumberOfWatch: rspPaginateWatch.pageNumber,
            currentPageOfWatch: rspPaginateWatch.currentPage,

            helpers: {
                formatNum: num => Number((currentPage - 1) + '0') + Number(num),
                paginateProducts: () => {
                    const watches = rspWatch.watches;
                    
                    return `<ul class="pagination justify-content-center mb-3">
                                <li class="page-item">
                                    <a class="page-link" href="/admin/warehouse" aria-label="Previous">
                                        <span aria-hidden="true">&laquo;</span>
                                    </a>
                                </li>
                                
                                <li class="page-item">
                                    <a class="page-link" href="/admin/warehouse?currentPage={{pageNumberOfReceipt}}" aria-label="Next">
                                        <span aria-hidden="true">&raquo;</span>
                                    </a>
                                </li>
                            </ul>`
                }
            }
        })
    } catch (error) {
        console.log(error);
        req.session.message = 'Internal server error';
        req.session.success = false;
    }
}

// @route /admin/warehouse/add
// @access private
exports.createAddReceipt = async (req, res) => {
    try {
        const watches = req.body.watches;
        const userId = req.session.authState?.user._id;

        const response = await addReceipService.create(watches, userId);

        if (response.success){
            watches.forEach(async watch => await watchService.increaseInventory(watch.quantity, watch.watchId, userId))
        }

        req.session.message = response.msg;
        req.session.success = response.success;
        return res.redirect('/admin/warehouse');
    } catch (error) {
        console.log(error);
        req.session.message = 'Internal server error';
        req.session.success = false;
    }
}
