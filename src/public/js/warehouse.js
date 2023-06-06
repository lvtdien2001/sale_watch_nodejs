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
            +    '</div>'
            +    '<div class="col-2 mb-3">'
            +        '<label class="form-label fw-bold">Số lượng <span class="text-danger">*</span></label>'
            +        '<input id="quantity-' + localStorage['listLength'] + '" class="form-control" required="true" type="number" name="watches[' + localStorage['listLength'] + '][quantity]" value="0">'
            +    '</div>'
            +    '<div class="col-2 mb-3">'
            +        '<label class="form-label fw-bold">Đơn giá nhập <span class="text-danger">*</span></label>'
            +        '<input id="price-' + localStorage['listLength'] + '" class="form-control" required="true" type="number" name="watches[' + localStorage['listLength'] + '][price]" value="0">'
            +    '</div>'
            +    '<div class="col-xl-1 mb-3 align-self-end">'
            +        '<button id="btn-' + localStorage['listLength'] + '" onclick="removeProduct(' + localStorage['listLength'] + ')" type="button" class="btn btn-outline-danger">'
            +            '<i class="fas fa-trash"></i>'
            +        '</button>'
            +    '</div>'

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