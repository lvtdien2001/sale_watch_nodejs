localStorage.setItem('listLength', 0);

document.getElementById('btn-add').onclick = () => {
    const listLength = Number(localStorage['listLength']);
    localStorage.setItem('listLength', listLength+1);

    let div = document.createElement('div');
    div.classList.add('row');
    div.id = `product-item-${localStorage['listLength']}`;

    const selectContent = document.getElementById('select-product').innerHTML;

    const html = '<div class="col-6 mb-3">'
            +        '<label class="form-label fw-bold">Sản phẩm <span class="text-danger">*</span></label>'
            +        '<select id="name-' + localStorage['listLength'] + '" required class="form-select" name="watches['+ localStorage['listLength'] +'][watchId]" oninvalid="setCustomValidity('+"'Bạn chưa chọn sản phẩm'"+')" oninput="setCustomValidity('+ "''" +')">'
            +            selectContent
            +        '</select>'
            +   '</div>'
            +    '<div class="col-6">'
            +    '<div class="row">'
            +    '<div class="col-4 mb-3">'
            +        '<label class="form-label fw-bold">Nhà cung cấp <span class="text-danger">*</span></label>'
            +        '<input id="supplier-' + localStorage['listLength'] + '" class="form-control" name="watches[' + localStorage['listLength'] + '][supplier]" required="true" oninvalid="setCustomValidity('+"'Nhà cung cấp không thể bỏ trống'"+')" oninput="setCustomValidity('+"''"+')" type="text" placeholder="Nhà cung cấp">'
            +    '</div>'
            +    '<div class="col mb-3">'
            +        '<label class="form-label fw-bold">Số lượng <span class="text-danger">*</span></label>'
            +        '<input id="quantity-' + localStorage['listLength'] + '" class="form-control" required="true" min="1" oninvalid="setCustomValidity('+"'Số lượng phải lớn hơn 0'"+')" oninput="setCustomValidity('+"''"+')" type="number" name="watches[' + localStorage['listLength'] + '][quantity]" value="0">'
            +    '</div>'
            +    '<div class="col mb-3">'
            +        '<label class="form-label fw-bold">Đơn giá nhập <span class="text-danger">*</span></label>'
            +        '<input id="price-' + localStorage['listLength'] + '" class="form-control" min="1000" required="true" oninvalid="setCustomValidity('+"'Đơn giá thấp nhất là 1000 đ'"+')" oninput="setCustomValidity('+"''"+')" type="number" name="watches[' + localStorage['listLength'] + '][price]" value="0">'
            +    '</div>'
            +    '<div class="col-2 mb-3 align-self-end">'
            +        '<button id="btn-' + localStorage['listLength'] + '" onclick="removeProduct(' + localStorage['listLength'] + ')" type="button" class="btn btn-outline-danger">'
            +            '<i class="fas fa-trash"></i>'
            +        '</button>'
            +    '</div>'
            +        '</div>'
            +        '</div>'

    div.innerHTML = html;

    document.getElementById('product-list').appendChild(div);
}

const removeProduct = num => {
    document.getElementById(`product-item-${num}`).remove();

    const listLength = Number(localStorage['listLength']);
    localStorage.setItem('listLength', listLength-1);

    for (let i=num+1; i<=listLength; i++){
        let htmlName = document.getElementById(`name-${i}`);
        htmlName.name = `watches[${i-1}][name]`;
        htmlName.id = `name-${i-1}`;

        let htmlSupplier = document.getElementById(`supplier-${i}`);
        htmlSupplier.name = `watches[${i-1}][supplier]`;
        htmlSupplier.id = `supplier-${i-1}`;

        let htmlQuantity = document.getElementById(`quantity-${i}`);
        htmlQuantity.name = `watches[${i-1}][quantity]`;
        htmlQuantity.id = `quantity-${i-1}`;

        let htmlPrice = document.getElementById(`price-${i}`);
        htmlPrice.name = `watches[${i-1}][price]`;
        htmlPrice.id = `price-${i-1}`;

        let htmlBtn = document.getElementById(`btn-${i}`);
        htmlBtn.setAttribute('onclick', `removeProduct(${i-1})`);
        htmlBtn.id = `btn-${i-1}`;

        document.getElementById(`product-item-${i}`).id = `product-item-${i-1}`;
    }
}

document.getElementById('nav-receipt').onclick = () => {
    const isHidden = document.getElementById('receipt-list-content').classList.contains('hidden');
    if (isHidden){
        document.getElementById('receipt-list-content').classList.toggle('hidden');
        document.getElementById('product-list-content').classList.toggle('hidden');
        document.getElementById('nav-receipt').classList.toggle('active');
        document.getElementById('nav-product').classList.toggle('active'); 
    }
}

document.getElementById('nav-product').onclick = () => {
    const isHidden = document.getElementById('product-list-content').classList.contains('hidden');
    if (isHidden){
        document.getElementById('receipt-list-content').classList.toggle('hidden');
        document.getElementById('product-list-content').classList.toggle('hidden');
        document.getElementById('nav-receipt').classList.toggle('active');
        document.getElementById('nav-product').classList.toggle('active'); 
    }
}

// show message
const messageToast = document.getElementById('message-toast')
if (messageToast){
    const toast = new bootstrap.Toast(messageToast)
    toast.show()
}

// paginate product table
const rows = document.getElementById('product-table-body').childElementCount;
for (let i=20; i<rows; i++){
    document.getElementById(`table-row-${i}`).className = 'hidden';
}

const changePage = (element, page) => {
    const prevPage = document.getElementById('currentPage').innerHTML;

    if (prevPage == page) 
        return;

    for (let i=(prevPage-1)*20; i<prevPage*20; i++){
        if (document.getElementById(`table-row-${i}`))
            document.getElementById(`table-row-${i}`).className = 'hidden';
    }

    for (let i=(page-1)*20; i<page*20; i++){
        (document.getElementById(`table-row-${i}`))?.classList.toggle('hidden');
    }

    document.getElementById('currentPage').id = '';

    if (!element){
        element = document.getElementById(`page-${page}`).getElementsByTagName('div')[0];
        console.log(element);
    }
    element.id = 'currentPage';

    document.getElementById(`page-${prevPage}`).classList.toggle('active');
    document.getElementById(`page-${page}`).classList.toggle('active');
};

const printPDF = (index, date) => {
    let mywindow = window.open('', 'PRINT', 'height=1123,width=900,top=100,left=150');

    mywindow.document.write(`<html><head><title>Phieu-Nhap-Kho-${date}</title>`);
    mywindow.document.write('</head><body >');
    mywindow.document.write(document.getElementById(`content-print-${index}`).innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();
}