import addReceiptModel from '../models/addReceipt.model';
import moment from 'moment';
import 'moment/locale/vi';

exports.findAllAndPage = async (currentPage, receiptPerPage, condition) => {
    try {
        if (!receiptPerPage)
            receiptPerPage = 10;
        const skipPage = (currentPage-1) * receiptPerPage;

        let receipts = await addReceiptModel
            .find(condition)
            .skip(skipPage)
            .limit(receiptPerPage)
            .sort({ createdAt: -1 })
            .populate('createBy', ['_id', 'fullName'])
            .lean()

        const numberOfReceipts = await addReceiptModel.countDocuments(condition);
        const pageNumber = Math.ceil(numberOfReceipts/receiptPerPage);

        for (let i=0; i<receipts.length; i++){
            receipts[i] = {
                ...receipts[i],
                createdAt: moment(receipts[i].createdAt).format('llll'),
                totalQuantity: receipts[i].watches.reduce((totalQuantity, watch) => totalQuantity + watch.quantity, 0)
            };
        }

        return {
            success: true,
            receipts,
            pageNumber,
            currentPage,
            receiptPerPage,
            numberOfReceipts
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            msg: 'Internal server error'
        }
    }
}

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