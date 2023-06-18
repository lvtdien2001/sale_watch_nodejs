import orderModel from '../models/order.model';



exports.get = async (condition)  => {
    try {
      
       
       
        // const userId = req.session.authState?.user._id;
        const orders = await orderModel.find(condition)
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
                                    .populate('userId', ['imageUrl', 'phoneNumber' ,'fullName'])
                                    .populate('adminConfirm.createdBy', ['phoneNumber' ,'fullName'])
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

// admin

exports.getAllByAdmin = async (condition, currentPage, watchPerPage)  => {
    try {
      
       
        const skipPage = (currentPage-1) * watchPerPage;
        // const userId = req.session.authState?.user._id;
        const orders = await orderModel.find(condition)
                                    .skip(skipPage)
                                    .limit(watchPerPage)
                                    .sort({"createdAt": -1}).lean()
        const numberOfOrders = await orderModel.countDocuments(condition);
        const pageNumber = Math.ceil(numberOfOrders/watchPerPage);
        return {
            orders,
            pageNumber
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            msg: 'Internal server error'
        }
    }
}

exports.updateOrder = async (condition, body)  => {
    try {
      
        await orderModel.findOneAndUpdate(condition,body)
        
        
    } catch (error) {
        console.log(error);
        return {
            success: false,
            msg: 'Internal server error'
        }
    }
}

exports.countOrders = async (condition) => {
    try {
        const numberOfOrders = await orderModel.countDocuments(condition);
        return numberOfOrders
    } catch (error) {
        console.log(error)
    }
}