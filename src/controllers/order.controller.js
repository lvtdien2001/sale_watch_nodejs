


import cartServices from '../services/cart.service'

import orderServices from '../services/order.service.js'
import codeServices from '../services/code.service';
import watchServices from '../services/watch.service';

import moment from 'moment';
import 'moment/locale/vi'
import watchModel from '../models/watch.model';
import mailer from '../utils/mailler'

function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

// @route GET /Order
// @desc get all cart in order
// @access private 
exports.get = async (req, res) => {
   
    try { 
        
        // const id = req.session.authState?.user._id;
        const id = req.session.authState?.user._id;
        // if (!id) {
        //     return res.redirect('/user/login')
        // }
       
        const response = await cartServices.findAll({userId: id})
        let totalAmount = response.carts.reduce(
            (accumulator, currentValue) => accumulator + currentValue.quantity * currentValue.watchId.price
            , 0)

        let orders = response.carts;
        if (!id) {
                const watchId = req?.cookies?.cart?.map(item => item.watchId) || []
                    const cartCookies = await watchModel.find({ _id: { $in: watchId }}).sort({"createdAt": -1}).lean()
                    const cartsCookies = cartCookies.map((item, index) => { 
                            return {
                                quantity: req?.cookies?.cart[index]?.quantity,
                                watchId: item
                            }
                        }
                    )
                    orders = cartsCookies
                    totalAmount = cartsCookies.reduce(
                        (accumulator, currentValue) => accumulator + currentValue.quantity * currentValue.watchId.price
                        , 0)
            }
        res.render('order',{
            carts: orders,
            message: req.session.message,
            success: req.session.success,
            user: req.session.authState?.user,
            totalAmount,
            helpers: {
                number: num =>  num + 1,
                totalPrice: (priceWatch, quantity) => {
                    let price = priceWatch * quantity;
                    price = price.toString();
                    if (price.length <= 3)
                        return price;
                
                    let priceFormat = [];
                    for (let i=price.length; i>0; i-=3)
                        priceFormat.push(price.substring(i-3, i));
                
                    return priceFormat.reverse().join('.') + ' đ';
                }
            }
        })
        
        
    } catch (error) {
        console.log(error);
    }
}

// @route GET /Order
// @desc get all cart in order
// @access private 
exports.getMyOrder = async (req, res) => {
   
    try { 
        
        const id = req.session.authState?.user._id;
        const status = req.query.status;
        let condition = {"userId": id, "status": status};
        const numberOfConfirm = await orderServices.countOrders({"status": 'Chờ xác nhận', "userId": id})
        const numberOfWaiting = await orderServices.countOrders({"status": 'Chờ lấy hàng', "userId": id})
        const numberOfTransporting = await orderServices.countOrders({"status": 'Đang vận chuyển', "userId": id})
        const numberOfRefund = await orderServices.countOrders({"status": 'Trả hàng', "userId": id})
        const response = await orderServices.get(condition)
       
       
        res.render('myOrder',{
            user: req.session.authState?.user,
            orders: response.orders,
            status: req.query.status,
            message: req.session.message,
            success: req.session.success,
            numberOfStatus: {
                numberOfConfirm,
                numberOfWaiting,
                numberOfTransporting,
                numberOfRefund
            },
            helpers: {
                totalPrice: (priceWatch, quantity) => {
                    let price = priceWatch * quantity;
                    price = price.toString();
                    if (price.length <= 3)
                        return price;
                
                    let priceFormat = [];
                    for (let i=price.length; i>0; i-=3)
                        priceFormat.push(price.substring(i-3, i));
                
                    return priceFormat.reverse().join('.') + ' đ';
                },
                formatDate: date => moment(date).format('lll'),
                firstWatch: (a) => {
                    return a === 0 ? true : false
                },
                clearMessage: () => {
                    req.session.message = undefined;
                    req.session.success = undefined;
                },
                templateStatus: (numberStatus, status) => {
                    let btnConfirmLink = `<button class="btn btn-outline-secondary position-relative">`
                    let btnWaitingLink = `<button class="btn btn-outline-primary position-relative">`
                    let btnTransportingLink = `<button class="btn btn-outline-primary position-relative">`
                    let btnReceivedLink = `<button class="btn btn-outline-success position-relative">`
                    let btnRefundLink = `<button class="btn btn-outline-danger position-relative">`
                    let btnConfirmRefunLink = `<button class="btn btn-outline-success position-relative">`
                    let btnCancelLink = `<button class="btn btn-outline-danger position-relative">`
                    let btnConfirmCancelLink = `<button class="btn btn-outline-success position-relative">`
                    switch (status) {
                        case 'Chờ xác nhận':
                            btnConfirmLink = `<button class="btn btn-secondary position-relative">`
                            break;
                        case 'Chờ lấy hàng':
                            btnWaitingLink = `<button class="btn btn-primary position-relative">`
                            break;
                        case 'Đang vận chuyển':
                            btnTransportingLink = `<button class="btn btn-primary position-relative">`
                            break;
                        case 'Đã nhận':
                            btnReceivedLink = `<button class="btn btn-success position-relative">`
                            break;
                        case 'Trả hàng':
                            btnRefundLink = `<button class="btn btn-danger position-relative">`
                            break;
                        case 'Xác nhận trả hàng':
                            btnConfirmRefunLink = `<button class="btn btn-success position-relative">`
                            break;
                        case 'Hủy':
                            btnCancelLink = `<button class="btn btn-danger position-relative">`
                            break;
                        case 'Xác nhận trả hàng':
                            btnConfirmCancelLink = `<button class="btn btn-success position-relative">`
                            break;
                        default:
                            break;
                    }
                    return `
                        <div class="list-status">
                            <a class="status-item-link" href="/order/myorder?status=Chờ xác nhận">
                                    ${btnConfirmLink}
                                    Chờ xác nhận 
                                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        ${numberStatus.numberOfConfirm}
                                        </span>
                                    </button> 
                            </a> 
                            <a class="status-item-link" href="/order/myorder?status=Chờ lấy hàng">
                                    ${btnWaitingLink}
                                        Chờ lấy hàng
                                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        ${numberStatus.numberOfWaiting}
                                    </span>
                                </button> 
                            </a> 
                            <a class="status-item-link" href="/order/myorder?status=Đang vận chuyển">
                                    ${btnTransportingLink}
                                        Đang vận chuyển
                                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                            ${numberStatus.numberOfTransporting}
                                    </span>
                                </button> 
                            </a> 
                            <a class="status-item-link" href="/order/myorder?status=Đã nhận"> ${btnReceivedLink} Đã nhận</button> </a> 
                            <a class="status-item-link" href="/order/myorder?status=Trả hàng">
                                        ${btnRefundLink}
                                        Trả hàng
                                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                            ${numberStatus.numberOfRefund}
                                        </span>
                                </button> 
                            </a>
                            <a class="status-item-link" href="/order/myorder?status=Xác nhận trả hàng"> ${btnConfirmRefunLink} Trả hàng thành công</button> </a>
                            <a class="status-item-link" href="/order/myorder?status=Hủy"> ${btnCancelLink} Đã hủy </button> </a>
                            <a class="status-item-link" href="/order/myorder?status=Xác nhận hủy"> ${btnConfirmCancelLink} Hủy thành  công  </button> </a>
                            </div>
                                        
                    `
                }

            }
        })
        
        
    } catch (error) {
        console.log(error);
    }
}

exports.handleOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const status = req.query.status;
        const reasonCancel = req.body.reasonCancel;
        const refundInfor = {
            nameBank: req.body.nameBank,
            accountNumber: req.body.accountNumber,
            nameAcount: req.body.nameAccount
        }
        let condition = {"status": status};
        if (reasonCancel) {
            condition.reasonCancel = reasonCancel
        }
        if (refundInfor) {
            condition.refundInfor = refundInfor
        }
        const response = await orderServices.updateOrder({"_id": orderId}, condition )
        if (response.success) {
            req.session.message = 'Cập nhật trạng thái thành công !';
            req.session.success = true;
        }
        res.redirect('back')
    } catch (error) {
        console.log(error)
    }
}

exports.getMyOrderId = async (req, res) => {
   
    try { 
        
        const id = req.session.authState?.user._id;
        const orderId = req.params.id
        const condition = {"userId": id,"_id": orderId };
        const response = await orderServices.getOrderId(condition)

        
        res.render('detailOrder',{
            user: req.session.authState?.user,
            order: response.order,
            message: req.session.message,
            success: req.session.success,
            helpers: {
                totalPrice: (priceWatch, quantity) => {
                    let price = priceWatch * quantity;
                    price = price.toString();
                    if (price.length <= 3)
                        return price;
                
                    let priceFormat = [];
                    for (let i=price.length; i>0; i-=3)
                        priceFormat.push(price.substring(i-3, i));
                
                    return priceFormat.reverse().join('.') + ' đ';
                },
                formatPaymentMethod: (paymentMethod) => paymentMethod === 'shipcod' ? 'Thanh toán khi nhận hàng' : 'Thanh toán online',
                formatStatusProgess: (progress)  => {
                    let statusWaiting = `<div class="progress-bar bg-secondary" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Chờ lấy hàng</div>`;
                    let statusTransporting = `<div class="progress-bar bg-secondary" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Đang vận chuyển</div>`;
                    let statusReceived = `<div class="progress-bar bg-secondary" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Đã nhận</div>`;
                    let statusRefund = `<div class="progress-bar bg-secondary" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Trả hàng</div>`;
                    let statusConfirmRefund = `<div class="progress-bar bg-secondary" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Xác nhận trả hàng</div>`;
                    switch (progress) {
                        case 'Chờ lấy hàng':
                            statusWaiting = `<div class="progress-bar" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Chờ lấy hàng</div>`;
                            break;
                        case 'Đang vận chuyển':
                            statusWaiting = `<div class="progress-bar" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Chờ lấy hàng</div>`;
                            statusTransporting = `<div class="progress-bar" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Đang vận chuyển</div>`
                            break;
                        case 'Đã nhận':
                            statusWaiting = `<div class="progress-bar" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Chờ lấy hàng</div>`;
                            statusTransporting = `<div class="progress-bar" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Đang vận chuyển</div>`
                            statusReceived = `<div class="progress-bar" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Đã nhận</div>`
                            break;
                        case 'Trả hàng' :
                            statusWaiting = `<div class="progress-bar" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Chờ lấy hàng</div>`;
                            statusTransporting = `<div class="progress-bar" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Đang vận chuyển</div>`
                            statusReceived = `<div class="progress-bar" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Đã nhận</div>`
                            statusRefund = `<div class="progress-bar bg-danger" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Trả hàng</div>`
                            break;
                        case 'Xác nhận trả hàng' :
                            statusWaiting = `<div class="progress-bar" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Chờ lấy hàng</div>`;
                            statusTransporting = `<div class="progress-bar" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Đang vận chuyển</div>`
                            statusReceived = `<div class="progress-bar" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Đã nhận</div>`
                            statusRefund = `<div class="progress-bar bg-success" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Trả hàng</div>`
                            statusConfirmRefund = `<div class="progress-bar bg-success" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Xác nhận trả hàng</div>`
                            
                        default:
                            break;
                    }
                    let templateProgress = `
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Chờ xác nhận</div>
                        ${statusWaiting} ${statusTransporting} ${statusReceived} ${statusRefund} ${statusConfirmRefund}
                    </div>
                    `
                   
                    switch (progress) {
                        case 'Hủy':
                            templateProgress = `
                            <div class="progress">
                             <div class="progress-bar" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Chờ xác nhận</div>
                             <div class="progress-bar bg-danger" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Hủy</div>
                            </div>
                            `
                            break;
                        case 'Xác nhận hủy':
                                templateProgress = `
                                <div class="progress">
                                 <div class="progress-bar" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Chờ xác nhận</div>
                                 <div class="progress-bar bg-danger" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Hủy</div>
                                 <div class="progress-bar bg-danger" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Xác nhận hủy</div>
                                </div>
                                `
                            break;
                    
                        default:
                            break;
                    }
                    return templateProgress
                },
                checkPayment: payment => payment ? true : false
                ,
                statusOrder: status => {
                    if (status === 'Đang vận chuyển' || status === 'Chờ lấy hàng' || status === 'Chờ xác nhận') {
                        return true
                    }
                    return false;
                },
                statusTransporting: status => status === 'Đang vận chuyển' ? true : false
                ,
                refundProducts: (status, isPayment) => (status === 'Đã nhận' && isPayment) ? true : false,
                confirmOrder: status => {
                    let btnConfirm = ''
                    switch (status) {
                        case 'Chờ xác nhận':
                        case 'Chờ lấy hàng':
                        case 'Đang vận chuyển':
                                btnConfirm = 'Hủy đơn hàng'
                                break;
                        default:
                                break;
                    }
                return btnConfirm
                },
                clearMessage: () => {
                    req.session.message = undefined;
                    req.session.success = undefined;
                }
            }
        })
        
        
    } catch (error) {
        console.log(error);
    }
}
// @route POST /order
// @desc create a order
// @access private 
exports.create = async (req, res) => {
   
    try { 
        
        // const id = req.session.authState?.user._id;
        const id = req.session.authState?.user._id || null;
        const {fullName, phoneNumber, paymentMethod, totalAmount, quantity, watchId, email, price,
        province, district, ward, description, name, imageUrl} = req.body;
        let products = [];
       
        if(quantity?.length === 1){
            products = [
                {
                    quantity: parseInt(quantity),
                    watchId: watchId,
                    price: parseInt(price),
                    name: name,
                    imageUrl: imageUrl
                }
            ]
        } else {
            for(let i = 0; i< quantity?.length; i++) {
                products.push({
                    quantity: parseInt(quantity[i]),
                    watchId: watchId[i],
                    price: parseInt(price[i]),
                    name: name[i],
                    imageUrl: imageUrl[i]
                })
            }
        }
        if (products.length === 0 ) {
            return res.redirect('/cart')
        }
        
        const body = {fullName, phoneNumber, paymentMethod, totalAmount,products, email, userId: id,
            province, district, ward, description}
        res.cookie('bodyCart', body);
        
        
            
        if (paymentMethod === 'shipcod') {
            let numbers = '';
  
            for (let i = 0; i < 6; i++) {
                let randomNumber = Math.floor(Math.random() * 10);
                numbers+=randomNumber;
            }
            const result = await mailer.sendMail(req.body.email , numbers, 'Mã Xác Nhận')
            if(result){
                const code = await codeServices.create({
                codeNumber:numbers,
                emailUser: email,
                resetTokenExpires:Date.now() + 300000
                })
            }
            return res.redirect('/order/ordercode')
            
        } 
        else {
          
            // req.session.orderId = response.response._id
            process.env.TZ = 'Asia/Ho_Chi_Minh';
    
            const date = new Date();
            const createDate = moment(date).format('YYYYMMDDHHmmss');
        
            const ipAddr = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

            let vnpUrl = process.env.vnp_Url;
            const orderId = moment(date).format('DDHHmmss');
            const amount = req.body.totalAmount;

            if (!amount) {
                return res.status(404).json({
                    success: false,
                    message: 'Amount not found'
                })
            }
            let vnp_Params = {};
            vnp_Params['vnp_Version'] = '2.1.0';
            vnp_Params['vnp_Command'] = 'pay';
            vnp_Params['vnp_TmnCode'] = process.env.vnp_TmnCode;
            vnp_Params['vnp_Locale'] = 'vn';
            vnp_Params['vnp_CurrCode'] = 'VND';
            vnp_Params['vnp_TxnRef'] = orderId;
            vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
            vnp_Params['vnp_OrderType'] = 'other';
            vnp_Params['vnp_Amount'] = amount * 100;
            vnp_Params['vnp_ReturnUrl'] = process.env.vnp_ReturnUrl;
            vnp_Params['vnp_IpAddr'] = ipAddr;
            vnp_Params['vnp_CreateDate'] = createDate;
            vnp_Params['vnp_BankCode'] = 'VNBANK';

            vnp_Params = sortObject(vnp_Params);

            let querystring = require('qs');
            let signData = querystring.stringify(vnp_Params, { encode: false });
            let crypto = require("crypto");     
            let hmac = crypto.createHmac("sha512", process.env.vnp_HashSecret);
            let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
            vnp_Params['vnp_SecureHash'] = signed;
            vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
           
            res.redirect(vnpUrl)
        }
        
        
        
    } catch (error) {
        console.log(error);
    }
}
// @route POST /order
// @desc create a order
// @access private 
exports.getVnpayReturn = async (req, res, next) => {
    const id = req.session.authState?.user._id;
    const body = req.cookies.bodyCart;
    // const orderId = req.session.orderId;
    let vnp_Params = req.query;

    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    
    let tmnCode = process.env.vnp_TmnCode;
    let secretKey = process.env.vnp_HashSecret;

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");     
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");  
    if(vnp_Params['vnp_ResponseCode'] == '00') {
        await cartServices.deleteAll({userId: id});
        body.isPayment = true;
        body.status = 'Chờ lấy hàng';
        
        await orderServices.create(body)
       
        const listProducts = body?.products
       
        for(let i = 0; i< listProducts.length; i++) {
            const bodyUpdateWatch = { $inc: { inventory: -listProducts[i].quantity, sold: listProducts[i].quantity } }
            await watchServices.updatePurchasedSuccess(bodyUpdateWatch,listProducts[i].watchId)
        }
        res.clearCookie("cart");

        await mailer.sendMail(body.email , 'Kính gửi: Quý khách,Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi.Dưới đây là chi tiết giao dịch mà bạn vừa thực hiện.', 'Chi tiết giao dịch tại Trung tâm phần mềm CSE')
        res.clearCookie("bodyCart")
    } 
    if(secureHash === signed){
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

        res.render('orderStatus',
        {   
            user: req.session.authState?.user,
            helpers: {
                checkStatus: code => {
                    if (code == '00') {
                        return true;
                    }
                    return false
                }
            },
            code: vnp_Params['vnp_ResponseCode']
        }
         )
    } else{
        res.render('orderStatus', {code: '97'})
    }
};

// admin 
// @route GET /admin/order/refund/id
// @desc refund 
// @access admin 



// admin 
// @route GET /admin/Order
// @desc get all order 
// @access admin 
exports.getAllOrders = async (req, res) => {
   
    try { 
        
      
        const status = req.query.status;
        let condition = {"status": status};
       
        if (status === undefined) {
            condition ={};
        }
        const numberOfConfirm = await orderServices.countOrders({"status": 'Chờ xác nhận'})
        const numberOfWaiting = await orderServices.countOrders({"status": 'Chờ lấy hàng'})
        const numberOfTransporting = await orderServices.countOrders({"status": 'Đang vận chuyển'})
        const numberOfRefund = await orderServices.countOrders({"status": 'Trả hàng'})
        const numberOfCancel = await orderServices.countOrders({"status": 'Hủy'})
        const currentPage = req.query.currentPage || '1';
        const watchPerPage = 10;
        const response = await orderServices.getAllByAdmin(condition,currentPage, watchPerPage);
        
        res.render('admin/order',{
            layout: 'admin',
            orders: response.orders,
            numberOfStatus: {
                numberOfConfirm,
                numberOfWaiting,
                numberOfTransporting,
                numberOfRefund,
                numberOfCancel
            },
            status: req.query.status,
            getStatus: `status=${req.query.status}`,
            currentPage,
            pageNumber: response.pageNumber,
            helpers: {
                totalPrice: (priceWatch, quantity) => {
                    let price = priceWatch * quantity;
                    price = price.toString();
                    if (price.length <= 3)
                        return price;
                
                    let priceFormat = [];
                    for (let i=price.length; i>0; i-=3)
                        priceFormat.push(price.substring(i-3, i));
                
                    return priceFormat.reverse().join('.') + ' đ';
                },
                formatDate: date => moment(date).format('lll'),
                firstWatch: (a) => {
                    return a === 0 ? true : false
                },
                templateStatus: (numberStatus, status) => {
                    let classBtn = 'btn-mobile';
                    let btnConfirmLink = `<button class="btn btn-outline-secondary position-relative ${classBtn}">`
                    let btnWaitingLink = `<button class="btn btn-outline-primary position-relative ${classBtn}">`
                    let btnTransportingLink = `<button class="btn btn-outline-primary position-relative ${classBtn}">`
                    let btnReceivedLink = `<button class="btn btn-outline-success position-relative ${classBtn}">`
                    let btnRefundLink = `<button class="btn btn-outline-danger position-relative ${classBtn}">`
                    let btnConfirmRefunLink = `<button class="btn btn-outline-success position-relative ${classBtn}">`
                    let btnCancelLink = `<button class="btn btn-outline-danger position-relative ${classBtn}">`
                    let btnConfirmCancelLink = `<button class="btn btn-outline-success position-relative ${classBtn}">`
                    switch (status) {
                        case 'Chờ xác nhận':
                            btnConfirmLink = `<button class="btn btn-secondary position-relative">`
                            break;
                        case 'Chờ lấy hàng':
                            btnWaitingLink = `<button class="btn btn-primary position-relative">`
                            break;
                        case 'Đang vận chuyển':
                            btnTransportingLink = `<button class="btn btn-primary position-relative">`
                            break;
                        case 'Đã nhận':
                            btnReceivedLink = `<button class="btn btn-success position-relative">`
                            break;
                        case 'Trả hàng':
                            btnRefundLink = `<button class="btn btn-danger position-relative">`
                            break;
                        case 'Xác nhận trả hàng':
                            btnConfirmRefunLink = `<button class="btn btn-success position-relative">`
                            break;
                        case 'Hủy':
                            btnCancelLink = `<button class="btn btn-danger position-relative">`
                            break
                        case 'Xác nhận hủy':
                            btnConfirmCancelLink = `<button class="btn btn-success position-relative">`
                            break
                        default:
                            break;
                    }
                    return `
                        <div class="list-status">
                            <a class="status-item-link" href="/admin/order?status=Chờ xác nhận">
                                    ${btnConfirmLink}
                                    Chờ xác nhận 
                                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        ${numberStatus.numberOfConfirm}
                                        </span>
                                    </button> 
                            </a> 
                            <a class="status-item-link" href="/admin/order?status=Chờ lấy hàng">
                                    ${btnWaitingLink}
                                        Chờ lấy hàng
                                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        ${numberStatus.numberOfWaiting}
                                    </span>
                                </button> 
                            </a> 
                            <a class="status-item-link" href="/admin/order?status=Đang vận chuyển">
                                    ${btnTransportingLink}
                                        Đang vận chuyển
                                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                            ${numberStatus.numberOfTransporting}
                                    </span>
                                </button> 
                            </a> 
                            <a class="status-item-link" href="/admin/order?status=Đã nhận"> ${btnReceivedLink} Đã nhận</button> </a> 
                            <a class="status-item-link" href="/admin/order?status=Trả hàng">
                                        ${btnRefundLink}
                                        Trả hàng
                                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                            ${numberStatus.numberOfRefund}
                                        </span>
                                </button> 
                            </a>
                            <a class="status-item-link" href="/admin/order?status=Xác nhận trả hàng"> ${btnConfirmRefunLink} Trả hàng thành công</button> </a>
                            <a class="status-item-link" href="/admin/order?status=Hủy">
                                ${btnCancelLink}
                                    Hủy
                                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        ${numberStatus.numberOfCancel}
                                    </span>
                                </button> 
                            </a>
                            <a class="status-item-link" href="/admin/order?status=Xác nhận hủy"> ${btnConfirmCancelLink} Xác nhận hủy</button> </a>
                            </div>
                                        
                    `
                }
                

            }
        })
        
        
    } catch (error) {
        console.log(error);
    }
}

exports.getMyOrderCode = async (req, res) => {
    try {
        const body = req.cookies.bodyCart;
        if (!body) {
            return res.redirect('/order')
        }
        res.render('orderCode', {
            user: req.session.authState?.user,
            status: req.session.statusCode,
            message: req.session.message,
            success: req.session.success,
            helpers: {
                clearMessage: () => {
                    req.session.message = undefined;
                    req.session.success = undefined;
                }
            }
        })
    } catch (error) {
        console.log(error)
    }
}



exports.sendEmailAgain = async (req, res) => {
    try {
        const body = req.cookies.bodyCart;
        let numbers = '';
  
        for (let i = 0; i < 6; i++) {
            let randomNumber = Math.floor(Math.random() * 10);
            numbers+=randomNumber;
        }
        const result = await mailer.sendMail(body.email , numbers, 'Mã Xác Nhận')
        if(result){
            const code = await codeServices.create({
            codeNumber:numbers,
            emailUser: body.email,
            resetTokenExpires:Date.now() + 300000
            })
            req.session.message = 'Đã gửi lại email thành công';
            req.session.success = true;
        }
        
        res.redirect('back')
    } catch (error) {
        console.log(error)
    }
}

exports.checkEmailOrder = async (req, res) => {
    try { 
        const userId = req.session.authState?.user._id || null ;
        const orderCode = req.body.orderCode;
        let code = '';
        

            // iterate over each item in the array
            for (let i = 0; i < orderCode?.length; i++ ) {
            code += orderCode[i];
            }
        const body = req.cookies.bodyCart;
        const emailCode = await codeServices.findAllByEmail(body.email);
        if (code === emailCode[0]?.codeNumber) {
            const response = await orderServices.create(body)
            if (response.success) {
                    req.session.statusCode = false;
                    res.clearCookie("cart");
                    res.clearCookie("bodyCart");
                    req.session.message = 'Đơn hàng đang đợi xét duyêt !';
                    req.session.success = true;
                    if (userId) {
                        await cartServices.deleteAll({"userId": userId});
                    } 
                    else {
                        return res.redirect('/cart')
                    }
                    
                }
            return res.redirect('/order/myorder?status=Chờ xác nhận')
        }
        req.session.statusCode= true
        res.redirect('back')
       
    } catch (error) {
        console.log(error)
    }
}


// admin 
// @route POST /admin/order/confirm/:id
// @desc update status of order
// @access admin 

exports.updateOrder = async (req, res) => {
    try {
        const id = req.session.authState?.user._id;
        const orderId = req.params.id
        const currentStatus = req.query.status
        // const responseOrder = await orderServices.getOrderId({"_id": orderId})
       
        let status = currentStatus
        switch (currentStatus) {
            case 'Chờ xác nhận':
                status = 'Chờ lấy hàng'
                break;
            case 'Chờ lấy hàng':
                status = 'Đang vận chuyển'
                break;
            case 'Trả hàng':
                status = 'Xác nhận trả hàng'
                break;
            case 'Đang vận chuyển':
                status = 'Đã nhận'
                break;
            case 'Hủy':
                status = 'Xác nhận hủy'
                break;
            default:
                    break;
        }
        const condition ={"_id": orderId}
        let actionAdmin = currentStatus;
        switch (currentStatus) {
            case 'Trả hàng':
                actionAdmin  = 'Xác nhận trả hàng'
                break;
            case 'Đang vận chuyển':
                actionAdmin  = 'Đã nhận'
                break;
            case 'Hủy':
                actionAdmin  = 'Xác nhận hủy'
                break;
        
            default:
                break;
        }
        const adminConfirmObj = {
            createdBy:id,
            status: actionAdmin
        }
        
        let body = { $push: { adminConfirm: adminConfirmObj  }, "status": status }
        if (status === 'Đã nhận' ) {
            body = { $push: { adminConfirm: adminConfirmObj  }, "status": status, isPayment : true }
        }
         const refundInfor = {};
         if(req.body.nameBank !== '' && req.body.accountNumber !=='' && req.body.nameAccount !== '') {
            refundInfor.nameBank = req.body.nameBank
            refundInfor.accountNumber = req.body.accountNumber
            refundInfor.nameAcount = req.body.nameAcount
         }
        if(req.query.status === 'Đã nhận') {
           
            body = { $push: { adminConfirm: adminConfirmObj  },isPayment : true }
        }
        if(req.query.status === 'Đã nhận' && Object.keys(refundInfor).length !== 0) {
           
            body = { $push: { adminConfirm: adminConfirmObj  }, "status": status,isPayment : true ,"refundInfor": refundInfor }
        }
        if (req.query.status === 'Trả hàng') {
            body = { $push: { adminConfirm: adminConfirmObj  }, "status": status, isPayment : false }
        }
        const response = await orderServices.updateOrder(condition, body)
        if (response.success) {
            req.session.message = 'Đơn hàng đã được cập nhật';
            req.session.success = true;
            // nếu người dùng khách thì gửi email
            if (response.order.userId === null && req.query.status === 'Chờ xác nhận') {
                await mailer.sendMail(response.order.email , 'Đơn hàng của quý khách đã được xác nhận, cảm ơn quý khách đã mua hàng.', 'Thông báo trạng thái đơn hàng')
            }
            if (response.order.userId === null && req.query.status === 'Đang vận chuyển') {
                await mailer.sendMail(response.order.email , 'cảm ơn quý khách đã mua hàng. Chi tiết liên hệ trả hàng số điện thoại: 0942000991', 'Cảm ơn đã sử dụng dịch vụ tại website.')
            }

            // xử lí cộng trừ kho hàng
            const listProducts = response?.order?.products;
            if ((req.query.status === 'Đang vận chuyển' && response?.order?.paymentMethod === 'shipcod' ) || (req.query.status === 'Đã nhận' && response.order.userId !== null )  ) {
                for(let i = 0; i< listProducts.length; i++) {
                    const bodyUpdateWatch = { $inc: { inventory: -listProducts[i].quantity, sold: listProducts[i].quantity } }
                    await watchServices.updatePurchasedSuccess(bodyUpdateWatch,listProducts[i].watchId)
                }
            }
            // trả hàng thì cộng lại sản phẩm đã mua
            if (req.query.status === 'Trả hàng') {
                for(let i = 0; i< listProducts.length; i++) {
                    const bodyUpdateWatch = { $inc: { inventory: listProducts[i].quantity, sold: -listProducts[i].quantity } }
                    await watchServices.updatePurchasedSuccess(bodyUpdateWatch,listProducts[i].watchId)
                }
            }
        }
        
        
        res.redirect('back')
    } catch (error) {
        console.log(error);
    }
}


// admin 
// @route get /admin/order/:id
// @desc get order id detail
// @access admin 

exports.getOrderIdByAdmin = async (req, res) => {
    try {
        const orderId = req.params.id
        const condition = {"_id": orderId };
        const response = await orderServices.getOrderId(condition)
        

      
        res.render('admin/detailOrder',{
            layout: 'admin',
            order: response.order,
            message: req.session.message,
            success: req.session.success,
            helpers: {
                totalPrice: (priceWatch, quantity) => {
                    let price = priceWatch * quantity;
                    price = price.toString();
                    if (price.length <= 3)
                        return price;
                
                    let priceFormat = [];
                    for (let i=price.length; i>0; i-=3)
                        priceFormat.push(price.substring(i-3, i));
                
                    return priceFormat.reverse().join('.') + ' đ';
                },
                formatDate: date => moment(date).format('lll'),
                formatPaymentMethod: (paymentMethod) => paymentMethod === 'shipcod' ? 'Thanh toán khi nhận hàng' : 'Thanh toán online',
                formatStatusProgess: (progress)  => {
                    let statusWaiting = `<div class="progress-bar bg-secondary" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Chờ lấy hàng</div>`;
                    let statusTransporting = `<div class="progress-bar bg-secondary" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Đang vận chuyển</div>`;
                    let statusReceived = `<div class="progress-bar bg-secondary" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Đã nhận</div>`;
                    let statusRefund = `<div class="progress-bar bg-secondary" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Trả hàng</div>`;
                    let statusConfirmRefund = `<div class="progress-bar bg-secondary" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Xác nhận trả hàng</div>`;
                    switch (progress) {
                        case 'Chờ lấy hàng':
                            statusWaiting = `<div class="progress-bar" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Chờ lấy hàng</div>`;
                            break;
                        case 'Đang vận chuyển':
                            statusWaiting = `<div class="progress-bar" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Chờ lấy hàng</div>`;
                            statusTransporting = `<div class="progress-bar" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Đang vận chuyển</div>`
                            break;
                        case 'Đã nhận':
                            statusWaiting = `<div class="progress-bar" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Chờ lấy hàng</div>`;
                            statusTransporting = `<div class="progress-bar" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Đang vận chuyển</div>`
                            statusReceived = `<div class="progress-bar" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Đã nhận</div>`
                            break;
                        case 'Trả hàng' :
                            statusWaiting = `<div class="progress-bar" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Chờ lấy hàng</div>`;
                            statusTransporting = `<div class="progress-bar" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Đang vận chuyển</div>`
                            statusReceived = `<div class="progress-bar" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Đã nhận</div>`
                            statusRefund = `<div class="progress-bar bg-danger" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Trả hàng</div>`
                            break;
                        case 'Xác nhận trả hàng' :
                            statusWaiting = `<div class="progress-bar" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Chờ lấy hàng</div>`;
                            statusTransporting = `<div class="progress-bar" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Đang vận chuyển</div>`
                            statusReceived = `<div class="progress-bar" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Đã nhận</div>`
                            statusRefund = `<div class="progress-bar bg-success" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Trả hàng</div>`
                            statusConfirmRefund = `<div class="progress-bar bg-success" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Xác nhận trả hàng</div>`
                            
                        default:
                            break;
                    }
                    let templateProgress = `
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Chờ xác nhận</div>
                        ${statusWaiting} ${statusTransporting} ${statusReceived} ${statusRefund} ${statusConfirmRefund}
                    </div>
                    `
                   
                    switch (progress) {
                        case 'Hủy':
                            templateProgress = `
                            <div class="progress">
                             <div class="progress-bar" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Chờ xác nhận</div>
                             <div class="progress-bar bg-danger" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Hủy</div>
                            </div>
                            `
                            break;
                        case 'Xác nhận hủy':
                                templateProgress = `
                                <div class="progress">
                                 <div class="progress-bar" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Chờ xác nhận</div>
                                 <div class="progress-bar bg-danger" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Hủy</div>
                                 <div class="progress-bar bg-danger" role="progressbar" style="width: 16.6%" aria-valuenow="16.6" aria-valuemin="0" aria-valuemax="100">Xác nhận hủy</div>
                                </div>
                                `
                            break;
                    
                        default:
                            break;
                    }
                    return templateProgress
                },
                confirmOrder: status => {
                    let btnConfirm = ''
                    switch (status) {
                        case 'Chờ xác nhận':
                                btnConfirm = 'Duyệt đơn hàng'
                                break;
                        case 'Chờ lấy hàng':
                                btnConfirm = 'Đã lấy hàng'
                                break;
                        default:
                                break;
                    }
                return btnConfirm
                },
                statusTransporting: status => (status === 'Chờ xác nhận' || status === 'Chờ lấy hàng') ? true : false,
                checkPayment: payment => payment ? true : false,
                checkStatusRefund: status => status === 'Trả hàng' ? true : false,
                checkStatusCancel: status => status === 'Hủy' ? true : false,
                checkStatusReceived: status => status === 'Đang vận chuyển' ? true : false,
                checkStatusPurchased: (status, isPayment) => (status === 'Đã nhận' && !isPayment) ? true : false,
                refundProducts: (status, paymentMethod, userId, isPayment) => (status === 'Đã nhận' && paymentMethod !== 'shipcod' && userId === null && isPayment) ? true : false,    
                checkUser: userId => {
                    return userId ? 
                    `
                        <div class="m-2 p-2"><span class="text-secondary">Tên người đặt hàng :</span> ${userId.fullName}</div>
                        <div class="m-2 p-2"><span class="text-secondary">Số điện thoại :</span> ${userId.phoneNumber}</div>
                        
                        <div class="m-2 p-2">
                            <span class="text-secondary">Hình ảnh</span> 
                            <img width="200px" height="200px" src="${userId.imageUrl}" />
                        </div>
                    ` : `<div class="m-2 p-2"><span class="text-secondary">Tên người đặt hàng :</span> Người dùng khách</div>`
                },
                convertNumberToText: function(number) {
                    var docTien = new DocTienBangChu();
                    return docTien.doc(number);
                },
                dateNow: () => {
                    const d = new Date();
                    const day = d.getDate();
                    const month = d.getMonth() + 1;
                    const year = d.getFullYear();
                    return `Ngày ${day},tháng ${month} ,năm ${year}`
                },
                clearMessage: () => {
                    req.session.message = undefined;
                    req.session.success = undefined;
                }
                
                
            
            }
        })
    } catch (error) {
        console.log(error)
    }
}




// doc tien bang chu
var DocTienBangChu = function () {
    this.ChuSo = new Array(" không ", " một ", " hai ", " ba ", " bốn ", " năm ", " sáu ", " bảy ", " tám ", " chín ");
    this.Tien = new Array("", " nghìn", " triệu", " tỷ", " nghìn tỷ", " triệu tỷ");
  };
  
  DocTienBangChu.prototype.docSo3ChuSo = function (baso) {
      var tram;
      var chuc;
      var donvi;
      var KetQua = "";
      tram = parseInt(baso / 100);
      chuc = parseInt((baso % 100) / 10);
      donvi = baso % 10;
      if (tram == 0 && chuc == 0 && donvi == 0) return "";
      if (tram != 0) {
          KetQua += this.ChuSo[tram] + " trăm ";
          if ((chuc == 0) && (donvi != 0)) KetQua += " linh ";
      }
      if ((chuc != 0) && (chuc != 1)) {
          KetQua += this.ChuSo[chuc] + " mươi";
          if ((chuc == 0) && (donvi != 0)) KetQua = KetQua + " linh ";
      }
      if (chuc == 1) KetQua += " mười ";
      switch (donvi) {
          case 1:
              if ((chuc != 0) && (chuc != 1)) {
                  KetQua += " mốt ";
              }
              else {
                  KetQua += this.ChuSo[donvi];
              }
              break;
          case 5:
              if (chuc == 0) {
                  KetQua += this.ChuSo[donvi];
              }
              else {
                  KetQua += " lăm ";
              }
              break;
          default:
              if (donvi != 0) {
                  KetQua += this.ChuSo[donvi];
              }
              break;
      }
      return KetQua;
  }
  
  DocTienBangChu.prototype.doc = function (SoTien) {
      var lan = 0;
      var i = 0;
      var so = 0;
      var KetQua = "";
      var tmp = "";
      var soAm = false;
      var ViTri = new Array();
      if (SoTien < 0) soAm = true;//return "Số tiền âm !";
      if (SoTien == 0) return "Không đồng";//"Không đồng !";
      if (SoTien > 0) {
          so = SoTien;
      }
      else {
          so = -SoTien;
      }
      if (SoTien > 8999999999999999) {
          //SoTien = 0;
          return "";//"Số quá lớn!";
      }
      ViTri[5] = Math.floor(so / 1000000000000000);
      if (isNaN(ViTri[5]))
          ViTri[5] = "0";
      so = so - parseFloat(ViTri[5].toString()) * 1000000000000000;
      ViTri[4] = Math.floor(so / 1000000000000);
      if (isNaN(ViTri[4]))
          ViTri[4] = "0";
      so = so - parseFloat(ViTri[4].toString()) * 1000000000000;
      ViTri[3] = Math.floor(so / 1000000000);
      if (isNaN(ViTri[3]))
          ViTri[3] = "0";
      so = so - parseFloat(ViTri[3].toString()) * 1000000000;
      ViTri[2] = parseInt(so / 1000000);
      if (isNaN(ViTri[2]))
          ViTri[2] = "0";
      ViTri[1] = parseInt((so % 1000000) / 1000);
      if (isNaN(ViTri[1]))
          ViTri[1] = "0";
      ViTri[0] = parseInt(so % 1000);
      if (isNaN(ViTri[0]))
          ViTri[0] = "0";
      if (ViTri[5] > 0) {
          lan = 5;
      }
      else if (ViTri[4] > 0) {
          lan = 4;
      }
      else if (ViTri[3] > 0) {
          lan = 3;
      }
      else if (ViTri[2] > 0) {
          lan = 2;
      }
      else if (ViTri[1] > 0) {
          lan = 1;
      }
      else {
          lan = 0;
      }
      for (i = lan; i >= 0; i--) {
          tmp = this.docSo3ChuSo(ViTri[i]);
          KetQua += tmp;
          if (ViTri[i] > 0) KetQua += this.Tien[i];
          if ((i > 0) && (tmp.length > 0)) KetQua += '';//',';//&& (!string.IsNullOrEmpty(tmp))
      }
      if (KetQua.substring(KetQua.length - 1) == ',') {
          KetQua = KetQua.substring(0, KetQua.length - 1);
      }
      KetQua = KetQua.substring(1, 2).toUpperCase() + KetQua.substring(2);
      if (soAm) {
          return "Âm " + KetQua + " đồng";//.substring(0, 1);//.toUpperCase();// + KetQua.substring(1);
      }
      else {
          return KetQua + " đồng";//.substring(0, 1);//.toUpperCase();// + KetQua.substring(1);
      }
  }