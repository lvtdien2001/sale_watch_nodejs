import orderModel from '../models/order.model';



exports.get = async (condition)  => {
    try {
      
       
       
        // const userId = req.session.authState?.user._id;
        const orders = await orderModel.find(condition)
                                    .populate('products.watchId')
                                    .sort({"createdAt": -1}).lean()
       
        return {
            orders
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            msg: 'Internal server error'
        }
    }
}

exports.getOrderId = async (condition)  => {
    try {
      
       
       
        const order = await orderModel.findOne(condition)
                                    .populate('products.watchId')
                                    .lean()
       
        return {
            order
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            msg: 'Internal server error'
        }
    }
}

exports.create = async (body)  => {
    try {
      
       
       
        // const userId = req.session.authState?.user._id;
        const newOrder = new orderModel(body)
        const response = await newOrder.save()
        return {
            message: 'Mua hàng thành công',
            success: true,
            response
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            msg: 'Internal server error'
        }
    }
}

exports.deleteId = async (condition)  => {
    try {
      
       
        
        await orderModel.deleteOne({_id: condition})
        
    } catch (error) {
        console.log(error);
        return {
            success: false,
            msg: 'Internal server error'
        }
    }
}

