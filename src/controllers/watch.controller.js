import watchService from '../services/watch.service';

// @route GET /admin/watch?currentPage=...
// @desc get watches for product manager function
// @access private
exports.getAllWatches = async (req, res) => {
    try {
        const currentPage = req.query.currentPage || '1';
        const response = await watchService.findAll(currentPage);

        res.render('admin/watch', {
            layout: 'admin',
            response,
            message: req.session.message,
            helpers: {
                increase: num => num+1,
                formatPrice: price => {
                    price = price.toString();
                    if (price.length <= 3)
                        return price;
                
                    let priceFormat = [];
                    for (let i=price.length; i>0; i-=3)
                        priceFormat.push(price.substring(i-3, i));
                
                    return priceFormat.reverse().join('.') + ' đ';
                },
                getTemplateEditSelect: (index, attr) => {
                    let template = '';
                    switch(attr){
                        case 'brand':
                            template = response.brands.map(brand => {
                                if (brand.name === response.watches[index].brandId.name)
                                    return `<option value="${brand._id}" selected='selected'>${brand.name}</option>`
                                else return `<option value="${brand._id}">${brand.name}</option>`
                            })
                            return template;
                        case 'style':
                            const styles = ['Sang trọng', 'Thể thao', 'Thời trang', 'Hiện đại', 'Quân đội'];
                            template = styles.map(style => {
                                if (style === response.watches[index].style)
                                    return `<option value="${style}" selected='selected'>${style}</option>`
                                else return `<option value="${style}">${style}</option>`
                            })
                            return template;
                        case 'glass':
                            const glasses = ['Sapphire (Kính Chống Trầy)', 'Kính khoáng Mineral (Kính cứng)', 'Resin Glass (Kính Nhựa)'];
                            template = glasses.map(glass => {
                                if (glass === response.watches[index].glass)
                                    return `<option value="${glass}" selected='selected'>${glass}</option>`
                                else return `<option value="${glass}">${glass}</option>`
                            })
                            return template;
                        case 'strap':
                            const straps = ['Thép không gỉ', 'Cao su', 'Dây da', 'Hợp kim'];
                            template = straps.map(strap => {
                                if (strap === response.watches[index].strap)
                                    return `<option value="${strap}" selected='selected'>${strap}</option>`
                                else return `<option value="${strap}">${strap}</option>`
                            })
                            return template;
                        case 'principleOperate':
                            const operates = ['Cơ tự động (Automatic)', 'Quartz (Pin)'];
                            template = operates.map(operate => {
                                if (operate === response.watches[index].principleOperate)
                                    return `<option value="${operate}" selected='selected'>${operate}</option>`
                                else return `<option value="${operate}">${operate}</option>`
                            })
                            return template;
                        default:
                            return null;
                    }
                },
                paginate: pageNumber => {
                    if (pageNumber===1) return null;
                    let template = '';
                    for (let i=1; i<=pageNumber; i++){
                        template += response.currentPage==i 
                            ? `<li class="page-item active"><a class="page-link" href="/admin/watch?currentPage=${i}">${i}</a></li>`
                            : `<li class="page-item"><a class="page-link" href="/admin/watch?currentPage=${i}">${i}</a></li>`
                    }
                    return template;
                },
                checkPageNumber: pageNumber => pageNumber>1,
                showMessage: () => {
                    if (req.session.message){
                        return `<div class="position-fixed top-0 end-0 p-3" style="z-index: 11">
                                    <div id="message-toast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                                        <div class="d-flex bg-success text-white">
                                            <div id="message-content" class="toast-body fs-6">
                                                ${req.session.message}
                                            </div>
                                            <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                                        </div>
                                    </div>
                                </div>`
                    }
                },
                clearMessage: () => {
                    if (req.session.message){
                        req.session.message = undefined
                    }
                }
            }
        });
    } catch (error) {
        console.log(error);
        res.send('Internal server error');
    }
}

// @route POST /admin/watch/add
// @desc create a new product
// @access private
exports.create = async (req, res) => {
    if (!req.body.name || !req.body.brandId || !req.file){
        req.session.message = 'Tên sản phẩm, hình ảnh và thương hiệu không thể bỏ trống!';
        return res.redirect('/admin/watch');
    }
    try {
        const userId = req.session.authState?.user._id;

        const data = {
            name: req.body.name,
            brandId: req.body.brandId,
            style: req.body.style,
            imageUrl: req.file.path,
            price: req.body.price,
            currentQuantity: req.body.currentQuantity,
            strap: req.body.strap,
            glass: req.body.glass,
            principleOperate: req.body.principleOperate,
            description: req.body.description
        }

        const response = await watchService.create(data, userId);
        req.session.message = response.msg;
        return res.redirect('/admin/watch');
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            msg: 'Internal server error'
        })
    }
}

// @route POST /admin/watch/update/:id
// @access private
exports.update = async (req, res) => {
    try {
        const userId = req.session.authState?.user._id;
        const watchId = req.params.id;

        const data = {
            name: req.body.name,
            brandId: req.body.brandId,
            style: req.body.style,
            imageUrl: req.file?.path,
            price: req.body.price,
            currentQuantity: req.body.currentQuantity,
            strap: req.body.strap,
            glass: req.body.glass,
            principleOperate: req.body.principleOperate,
            description: req.body.description,
        }

        const response = await watchService.update(data, watchId, userId);
        req.session.message = response.msg;
        return res.redirect('/admin/watch');
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            msg: 'Internal server error'
        })
    }
}

// @route POST /admin/watch/delete/:id
// @access private
exports.delete = async (req, res) => {
    try {
        const watchId = req.params.id;

        const response = await watchService.delete(watchId);
        req.session.message = response.msg;
        return res.redirect('/admin/watch');
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            msg: 'Internal server error'
        })
    }
}