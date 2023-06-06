import addReceiptModel from '../models/addReceipt.model';

exports.create = async (watches, userId) => {
    try {
        const totalAmount = watches.reduce((totalAmount, watch, index) => {
            watches[index] = {
                ...watches[index],
                amount: watch.price*watch.quantity
            }
            return totalAmount + (watch.price*watch.quantity);
        }, 0);

        const newAddReceipt = new addReceiptModel({
            createBy: userId,
            watches,
            totalAmount
        })
        await newAddReceipt.save();
        return {
            success: true,
            msg: 'Tạo phiếu nhập thành công'
        }
    } catch (error) {
        console.log(error);
        return {
            msg: 'Internal server error',
            success: false
        }
    }
}