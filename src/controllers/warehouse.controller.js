import addReceipService from '../services/addReceipt.service';
import watchService from '../services/watch.service';

// @route /admin/warehouse
// @access private
exports.getHomePage = async (req, res) => {
    try {
        const response = await watchService.findAll(null, null, {});

        res.render('admin/warehouse', {
            layout: 'admin',
            watches: response.watches
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
        console.log(watches);
        // const response = await addReceipService.create(watches, userId);
        // req.session.message = response.msg;
        // req.session.success = response.success;
        return res.redirect('/admin/warehouse');
    } catch (error) {
        console.log(error);
        req.session.message = 'Internal server error';
        req.session.success = false;
    }
}
