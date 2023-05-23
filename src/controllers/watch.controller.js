import watchService from '../services/watch.service';

// @route GET /watch/admin?currentPage=...
// @desc get watches for product manager function
// @access public
exports.getAllWatches = async (req, res) => {
    try {
        const currentPage = req.query.currentPage || '1';
        const response = await watchService.findAll(currentPage);

        res.render('admin/watch', {
            layout: 'admin',
            helpers: {
                increase: num => num+1,
                equals: (str1, str2) => str1===str2 ? "selected" : undefined,
                getTemplateBrands: () => {
                    let template = '';
                    const brands = response.brands;
                    const length = brands.length;
                    for (let i=0; i<length; i++){
                        template += `<option id="edit-brand-${i}" value="${brands[i]._id}">${brands[i].name}</option>`
                    }
                    return template
                },
                formatPrice: price => {
                    price = price.toString();
                    if (price.length <= 3)
                        return price;
                
                    let priceFormat = [];
                    for (let i=price.length; i>0; i-=3)
                        priceFormat.push(price.substring(i-3, i));
                
                    return priceFormat.reverse().join('.') + ' đ';
                }
            }, 
            response,
            message: req.session.message
        });
    } catch (error) {
        console.log(error);
        res.send('Internal server error');
    }
}

// @route POST /watch
// @desc create a new product
// @access private
exports.create = async (req, res) => {
    try {
        const userId = '64678e381a0f2ec779c8f37c';

        const data = {
            name: req.body.name,
            brandId: req.body.brandId,
            style: req.body.style,
            imageUrl: req.file.path,
            price: req.body.price,
            currentQuantity: req.body.currentQuantity,
            strap: req.body.strap,
            glass: req.body.glass,
            description: req.body.description,
        }

        const response = await watchService.create(data, userId);
        req.session.message = response.msg;
        return res.redirect('/watch/admin');
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            msg: 'Internal server error'
        })
    }
}

// @route POST /watch/delete/:id
exports.delete = async (req, res) => {
    try {
        const watchId = req.params.id;

        const response = await watchService.delete(watchId);
        req.session.message = response.msg;
        return res.redirect('/watch/admin');
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            msg: 'Internal server error'
        })
    }
}