
import orderModel from '../models/order.model';

import cartServices from '../services/cart.service'

import orderServices from '../services/order.service.js'
import nodemailer from 'nodemailer'

import moment from 'moment';
import 'moment/locale/vi'

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
        const totalAmount = response.carts.reduce(
            (accumulator, currentValue) => accumulator + currentValue.quantity * currentValue.watchId.price
            , 0)
        
        res.render('order',{
            carts: response.carts,
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
        // if (!id) {
        //     return res.redirect('/user/login')
        // }
        if (status === undefined) {
            condition ={"userId": id};
        }
        
        const response = await orderServices.get(condition)
        
        res.render('myOrder',{
            user: req.session.authState?.user,
            orders: response.orders,
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
                }
            }
        })
        
        
    } catch (error) {
        console.log(error);
    }
}

exports.getMyOrderId = async (req, res) => {
   
    try { 
        
        const id = req.session.authState?.user._id;
        const orderId = req.params.id
        // if (!id) {
        //     return res.redirect('/user/login')
        // }
        const condition = {"userId": id,"_id": orderId };
        const response = await orderServices.getOrderId(condition)
        
        
        res.render('detailOrder',{
            user: req.session.authState?.user,
            order: response.order,
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
                    let statusWaiting = `<div class="progress-bar bg-secondary" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">Chờ lấy hàng</div>`;
                    let statusTransporting = `<div class="progress-bar bg-secondary" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">Đang vận chuyển</div>`;
                    let statusReceived = `<div class="progress-bar bg-secondary" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">Đã nhận</div>`;
                    switch (progress) {
                        case 'Chờ lấy hàng':
                            statusWaiting = `<div class="progress-bar" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">Chờ lấy hàng</div>`;
                            break;
                        case 'Đang vận chuyển':
                            statusWaiting = `<div class="progress-bar" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">Chờ lấy hàng</div>`;
                            statusTransporting = `<div class="progress-bar" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">Đang vận chuyển</div>`
                            break;
                        case 'Đã nhận':
                            statusWaiting = `<div class="progress-bar" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">Chờ lấy hàng</div>`;
                            statusTransporting = `<div class="progress-bar" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">Đang vận chuyển</div>`
                            statusReceived = `<div class="progress-bar" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">Đã nhận</div>`
                            break;
                        default:
                            break;
                    }
                    return `
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">Chờ xác nhận</div>
                        ${statusWaiting} ${statusTransporting} ${statusReceived}
                    </div>
                `
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
        const id = req.session.authState?.user._id;
        const {fullName, phoneNumber, paymentMethod, totalAmount, quantity, watchId, email, price,
        province, district, ward, description} = req.body;
        let products = [];
        if(quantity.length === 1){
            products = [
                {
                    quantity: parseInt(quantity),
                    watchId: watchId,
                    price: parseInt(price)
                }
            ]
        } else {
            for(let i = 0; i< quantity.length; i++) {
                products.push({
                    quantity: parseInt(quantity[i]),
                    watchId: watchId[i],
                    price: parseInt(price[i])
                })
            }
        }
       
        const body = {fullName, phoneNumber, paymentMethod, totalAmount,products, email, userId: id,
            province, district, ward, description}
        const response = await orderServices.create(body)
        if (paymentMethod === 'shipcod') {
            req.session.message = response.message;
            req.session.success = response.success;
            
           
            if (response.success) {
                await cartServices.deleteAll({userId: id});
                return res.redirect('/order')
            }
        } 
        else {
            req.session.orderId = response.response._id
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
    const orderId = req.session.orderId;
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
        delete req.session.orderId
    } else {
        
        await orderServices.deleteId(orderId)
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

