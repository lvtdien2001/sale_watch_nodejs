
exports.increase = num => num+1;

exports.getAuthBtn = user => {
    if (user){
        return  `<div class="dropdown">
                    <button class="btn dropdown-toggle header-user-toggle text-white" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <img id="header-user-avatar" src="${user.imageUrl}" width="25px" height="25px">
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li><a class="dropdown-item" href="/order/myorder?status=Chờ xác nhận">Đơn hàng của tôi</a></li>
                        <li><a class="dropdown-item" href="/user/edit">Chỉnh sửa thông tin</a></li>
                        <li><a class="dropdown-item" href="#">#2</a></li>
                        <li>
                            <a class="dropdown-item text-danger" href="/user/logout">
                                <i class="fas fa-sign-out-alt"></i> Đăng xuất
                            </a>
                        </li>
                    </ul>
                </div>`
    }
    else return `<button class="header-btn-link"><a class="header-link" href="/user/login"><i class="fas fa-user"></i> Đăng nhập</a></button>`
}

exports.showMessage = (message, success) => {
    if (message){
        const bg = success ? 'bg-success' : 'bg-danger';
        return `<div class="position-fixed top-0 end-0 p-3" style="z-index: 11">
                    <div id="message-toast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                        <div class="d-flex ${bg} text-white">
                            <div id="message-content" class="toast-body fs-6">
                                ${message}
                            </div>
                            <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                    </div>
                </div>`
    }
    return null;
}

exports.paginate = (pageNumber, currentPage, router, param) => {
    currentPage = Number(currentPage);

    // first page
    let template = currentPage===1
        ? `<li class="page-item active"><a class="page-link" href="${router}?currentPage=1&${param}">1</a></li>`
        : `<li class="page-item"><a class="page-link" href="${router}?currentPage=1&${param}">1</a></li>`
    
    for (let i=2; i<pageNumber; i++){
        if (i===currentPage)
            template += `<li class="page-item active"><a class="page-link" href="${router}?currentPage=${i}&${param}">${i}</a></li>`
        else if (i===currentPage-1 || i===currentPage+1)
            template += `<li class="page-item"><a class="page-link" href="${router}?currentPage=${i}&${param}">${i}</a></li>`
        else if(i<currentPage-1){
            template += `<li class="page-item"><a class="page-link" href="#">...</a></li>`;
            i = currentPage-2;
        }
        else if (i>currentPage+1){
            template += `<li class="page-item"><a class="page-link" href="#">...</a></li>`;
            i=pageNumber;
        }
    }

    // last page
    template += currentPage===pageNumber
        ? `<li class="page-item active"><a class="page-link" href="${router}?currentPage=${pageNumber}&${param}">${pageNumber}</a></li>`
        : `<li class="page-item"><a class="page-link" href="${router}?currentPage=${pageNumber}&${param}">${pageNumber}</a></li>`
    return template;
}

exports.checkPageNumber = pageNumber => pageNumber>1;

exports.formatPrice = price => {
    price = price.toString();
    if (price.length <= 3)
        return price + 'đ';

    let priceFormat = [];
    for (let i=price.length; i>0; i-=3)
        priceFormat.push(price.substring(i-3, i));

    return priceFormat.reverse().join('.') + ' đ';
}

exports.formatName = name => {
    if (name.length <=30)
        return name;
    return name.substring(0, 27) + '...'
}

exports.checkRole = user => {
    if (user?.isAdmin || (user?.roles?.length && user?.roles.length>0))
        return true;
    return false;
}
