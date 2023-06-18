document.title = 'Đặt hàng'
import {apiProvince} from './province.js';

const province = document.getElementById("province");
const district = document.getElementById("district");
const ward = document.getElementById("ward");

    for (let i = 0; i<apiProvince.length; i++) {
        const para = document.createElement("option");
        province.appendChild(para);
        para.value = apiProvince[i].name;
        para.innerText = apiProvince[i].name;
    }

province.onchange = function() {myProvince()};

function myProvince() {
   
    let options = district.getElementsByTagName('option');
    
    for (let i = options.length; i--;) {
        
        district.removeChild(options[i]);
    }
    let optionsWard = ward.getElementsByTagName('option');
    for (let i = optionsWard?.length; i--;) {
        ward.removeChild(optionsWard[i]);
    }
   
    const huyen = apiProvince.find(item => item.name === province.value)
    const huyenSelect = document.createElement("option");
    district.appendChild(huyenSelect)
    huyenSelect.value="";
    huyenSelect.innerText = 'Chọn Quận/Huyện'
    
    for (let i = 0; i<huyen.districts.length; i++) {
        const para = document.createElement("option");
        district.appendChild(para);
        para.value = huyen.districts[i].name;
        para.innerText = huyen.districts[i].name;
    }
    
}
district.onchange = function() {myDistrict()};

function myDistrict() {
    let options = ward.getElementsByTagName('option');
    for (let i = options?.length; i--;) {
        ward.removeChild(options[i]);
    }
    const huyen = apiProvince?.find(item => item.name === province.value)
    const xa = huyen?.districts?.find(item => item.name === district.value)

    const xaSelect = document.createElement("option");
    ward.appendChild(xaSelect)
    xaSelect.value="";
    xaSelect.innerText = 'Chọn Phường/Xã'
    for (let i = 0; i<xa?.wards?.length; i++) {
        const para = document.createElement("option");
        ward.appendChild(para);
        para.value = xa.wards[i].name;
        para.innerText = xa.wards[i].name;
    }
}
const formOrder = document.getElementById('form-order')
const phoneNumber = document.getElementById('phoneNumber');
const messageValidatePhoneNumber = document.getElementById('validate-phone')
const phonePattern = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

phoneNumber.oninput = () => {
    if (!(phonePattern.test(phoneNumber.value))) {
        messageValidatePhoneNumber.style.display = 'block';
        messageValidatePhoneNumber.innerText ='Số điện thoại không đúng định dạng'
        messageValidatePhoneNumber.style.color ='#c0392b'
    } else {
        messageValidatePhoneNumber.style.display = 'none';
    }
}
formOrder.onsubmit = (e) => {
    
    if (!(phonePattern.test(phoneNumber.value))) {
        e.preventDefault()
        return false;
    }
   
        formOrder.submit();
    
}