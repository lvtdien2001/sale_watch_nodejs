

// @route GET /admin/turnover
// @access private
exports.display = async (req, res) => {
    try {
        res.render('admin/turnover', {
            layout: 'admin'
        })
    } catch (error) {
        console.log(error);
        req.session.message = 'Internal server error';
        req.session.success = false;
    }
}