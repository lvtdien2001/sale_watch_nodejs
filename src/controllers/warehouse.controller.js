import addReceipService from '../services/addReceipt.service';
import watchService from '../services/watch.service';

// @route /admin/warehouse?currentPage=...&receiptPerPage=...
// @access private
exports.getHomePage = async (req, res) => {
    try {
        const currentPage = req.query.currentPage || 1;
        const receiptPerPage = req.query.receiptPerPage || 10;

        const rspWatch = await watchService.findAll(null, null, {name: 1});
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

            activeProduct: req.session.activeProduct,

            helpers: {
                formatNum: num => Number((currentPage - 1) + '0') + Number(num),
                paginateProducts: () => {
                    const watches = rspWatch.watches;
                    const watchPerPage = 20;
                    const pageNumber = Math.ceil(watches.length/watchPerPage);
                    let html = `<li class="page-item">
                                    <div onclick="changePage('', 1)" id="product-first-page" class="page-link" aria-label="Previous">
                                        <span aria-hidden="true">&laquo;</span>
                                    </div>
                                </li>`;
                    for (let i=1; i<=pageNumber; i++){
                        const className = i===1 ? 'page-item active' : 'page-item';
                        html += `<li id="page-${i}" class="${className}"><div onclick="changePage(this, ${i})" id="${i===1 ? 'currentPage' : ''}" class="page-link">${i}</div></li>`;
                    }
                    
                    html += `<li class="page-item">
                                <div onclick="changePage('', ${pageNumber})" id="product-last-page" class="page-link" aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                </div>
                            </li>`;

                    return html;
                },
                clearActive: () => req.session.activeProduct = undefined,
                clearMessage: () => req.session.message = undefined
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
