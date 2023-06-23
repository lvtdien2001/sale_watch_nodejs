import orderService from '../services/order.service';

// @route GET /admin/turnover
// @access private
exports.display = async (req, res) => {
    try {
        const currentYear = (new Date()).getFullYear();
        const year = req.query.year || currentYear;
        const month = req.query.month;
        let condition = {
            status: 'Đã nhận',
            isPayment: true
        }

        if (!month){
            condition = {
                ...condition,
                updatedAt: {$gte: new Date(`${year}-01-01`), $lt: new Date(`${year}-12-31`)}
            }
        }
        else {
            condition = {
                ...condition,
                updatedAt: {$gte: new Date(`${year}-${month}-01`), $lt: new Date(`${year}-${month}-31`)}
            }
        }
        const rsp = await orderService.get(condition);
        const orders = rsp.orders;
        let turnover;
        if (!month){
            if (year == currentYear){
                turnover = new Array((new Date()).getMonth() + 1).fill(0);
            }
            else {
                turnover = new Array(12).fill(0);
            }
            orders.forEach(order => {
                const month = new Date(order.updatedAt).getMonth();
                turnover[month] += order.totalAmount;
            })
        }
        else {
            let days = 31;
            if (month==='02'){
                days = 28;
            }
            else if (month==='04' || month==='06' || month==='09' || month==='11'){
                days = 30;
            }

            turnover = new Array(days).fill(0);
            orders.forEach(order => {
                const day = new Date(order.updatedAt).getDate();
                turnover[day-1] += order.totalAmount;
            })
        }

        const totalRevenue = orders.reduce((totalRevenue, order) => {
            return totalRevenue += order.totalAmount;
        }, 0)

        res.render('admin/turnover', {
            layout: 'admin',
            turnover,
            totalRevenue,
            year,
            month,
            helpers: {
                getTemplateMonth: () => {
                    let template = ``;
                    for (let i=1; i<=12; i++){
                        const value = i<10 ? `0${i}` : `${i}`
                        if (month==i){
                            template += `<option selected value="${value}">Tháng ${i}</option>`
                        }
                        else {
                            template += `<option value="${value}">Tháng ${i}</option>`
                        }
                    }
                    return template;
                },
                getTemplateYear: () => {
                    let template = ``;
                    for (let i=2010; i<=2099; i++){
                        if (year==i){
                            template += `<option selected value="${i}">${i}</option>`
                        }
                        else {
                            template += `<option value="${i}">${i}</option>`
                        }
                    }
                    return template;
                }
            }
        })
    } catch (error) {
        console.log(error);
        req.session.message = 'Internal server error';
        req.session.success = false;
    }
}