import cartModel from '../models/cart.model';

import watchServices from '../services/watch.service'
import moment from 'moment';
import 'moment/locale/vi'

exports.findAll = async (conditional) => {
 
   
    const carts = await cartModel.find(conditional)
                                .populate('watchId')
                                .lean();
  
   
    return {
        success: true,
        carts
    }
}

exports.create = async (quantity, watchId, userId)  => {
    try {
        const condition = {watchId, userId}
        const cart = await cartModel.findOne(condition)
        
        if (cart && checkCurrentQuantity(quantity+cart?.quantity, watchId)) {
            await cartModel.findOneAndUpdate(condition, {"quantity": quantity+cart?.quantity})
            return {message: "Ok!"}
        }
       
      // const userId = req.session.authState?.user._id;
      const newCart = new cartModel({
        quantity,
        watchId,
        userId
        
    })
    await newCart.save()
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
        
        const condition = {watchId, userId}
        const cart = await cartModel.findOne(condition)
        if (!checkCurrentQuantity(quantity ,cart.watchId)) return;
        
          
    
        
        await cartModel.findOneAndUpdate(condition, {"quantity": quantity})
        
      
        
    } catch (error) {
        console.log(error);
        return {
            success: false,
            msg: 'Internal server error'
        }
    }
   
}
// check số lượng sản phẩm hiện tại với số lượng sản phẩm có trong giỏ hàng
const checkCurrentQuantity = async (quantity, watchId) => {
    const currentQuantity = await watchServices.getQuantity(watchId);
    
    if (quantity > currentQuantity) {
        return false;
    }
    return true;
}

exports.delete = async (conditional) => {
    try {
        await cartModel.findOneAndDelete(conditional)
    } catch (error) {
        console.log(error);
        return {
            success: false,
            msg: 'Internal server error'
        }
    }
}


exports.deleteAll = async (conditional) => {
    try {
        await cartModel.deleteMany(conditional)
    } catch (error) {
        console.log(error);
        return {
            success: false,
            msg: 'Internal server error'
        }
    }
}