import cartModel from '../models/cart.model';

import watchServices from '../services/watch.service'
import moment from 'moment';
import 'moment/locale/vi'

exports.findAll = async (conditional) => {
 
   
    const carts = await cartModel.find(conditional)
                                .populate('watchId')
                                .lean();
    const numberOfCarts = await cartModel.countDocuments({});
   
    return {
        success: true,
        carts
    }
}

exports.create = async (quantity, watchId, userId)  => {
    try {
        const condition = {watchId, userId}
        const cart = await cartModel.findOne(condition)
        if (cart && checkCurrentQuantity(quantity+cart.quantity, watchId)) {
            const updateCart = await cartModel.findOneAndUpdate(condition, {quantity:quantity+cart.quantity})
            return {message: "Ok!"}
        }
       
      // const userId = req.session.authState?.user._id;
      const newCart = new cartModel({
        quantity,
        watchId,
        userId
        
    })
    await newCart.save()
    return 
    } catch (error) {
        console.log(error);
        return {
            success: false,
            msg: 'Internal server error'
        }
    }
}


exports.updateQuantity = async (quantity, watchId, userId) => {
    try {
        
            const condition = {"watchId": watchId, "userId": userId};
        
            const cart = await Cart.findOneAndUpdate(condition,quantity)
        
      
        
    } catch (error) {
        console.log(error);
        return {
            success: false,
            msg: 'Internal server error'
        }
    }
   
}
// check số lượng sản phẩm hiện tại với số lượng sản phẩm có trong giỏ hàng
exports.checkCurrentQuantity = async (quantity, watchId) => {
    const currentQuantity = await watchServices.getQuantity(watchId);
    if (quantity > currentQuantity) {
        return false;
    }
    return true;
}