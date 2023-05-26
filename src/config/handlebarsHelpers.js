
exports.test = () => {
    console.log('test');
}

exports.getAuthBtn = user => {
    if (user){
        return  `<div class="dropdown">
                    <button class="btn dropdown-toggle header-user-toggle text-white" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="${user.imageUrl}" width="25px" height="25px">
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li><a class="dropdown-item" href="#">#1</a></li>
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