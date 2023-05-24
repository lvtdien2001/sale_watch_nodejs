const fullNameInput= document.querySelector('#fullName')
const phoneNumberInput= document.querySelector('#phoneNumber')
const usernameInput= document.querySelector('#username')
const passInput= document.querySelector('#password')
const confirmPassInput= document.querySelector('#confirm-pass')
const submitBtn= document.querySelector('#submit-btn')
const submitBtnLogIn= document.querySelector('#submit-btn-login')
const formBlock= document.querySelector('.form__block')
const formGroups =formBlock.querySelectorAll('.form__group')

function messageError(element, message){
    if(element){
        const formGroups= element.parentElement;
        const messageElement= formGroups.querySelector('.message');
        messageElement.innerText = message
        formGroups.classList.add('user__message-error')
        formGroups.classList.remove('user__message-success')

    }
}

function messageSuccess(element, message){
    if(element){
        
        const formGroups= element.parentElement;
        const messageElement= formGroups.querySelector('.message');
        messageElement.innerText = message
        formGroups.classList.add('user__message-success')
        formGroups.classList.remove('user__message-error')
    }

}

usernameInput.addEventListener('blur', checkUsername)
function checkUsername(e){
    usernameInput.value < 6 ? messageError(usernameInput,'Tên đăng nhập phải lớn hơn 6 ký tự') : messageSuccess(usernameInput,'Hợp lệ')
}

passInput.addEventListener('blur', checkPassword)
function checkPassword(e){
    passInput.value < 6 ? messageError(passInput,'Mật khẩu quá ngắn') : messageSuccess(passInput,'Hợp lệ')
}

if(fullNameInput){
    fullNameInput.addEventListener('blur', checkFullName)
}
function checkFullName(e){
    fullNameInput.value==0 ? messageError(fullNameInput,'Chưa nhập họ và tên') : messageSuccess(fullNameInput,'Hợp lệ')
}

if(phoneNumberInput){
    phoneNumberInput.addEventListener('blur', checkPhoneNumber)
}
function checkPhoneNumber(e){
    phoneNumberInput.value < 10 ? messageError(phoneNumberInput,'Số điện thoại chưa hợp lệ') : messageSuccess(phoneNumberInput,'Hợp lệ')
}

if(confirmPassInput){
    confirmPassInput.addEventListener('blur', checkMatchPass)
}
function checkMatchPass(e){
    if( confirmPassInput.value != passInput.value || confirmPassInput.value.length ==0){
        messageError(confirmPassInput,'Mật khẩu không trùng khớp')
    }else{
        messageSuccess(confirmPassInput,'Hợp lệ')
    }
}
if(submitBtn){
    submitBtn.addEventListener('click',submitFormRegister)
}
function submitFormRegister(e){
    // e.preventDefault()
    let isValid=0
    checkFullName()
    checkPhoneNumber()
    checkUsername()
    checkPassword()
    checkMatchPass()
    formGroups.forEach((formGroup) => {
        if(formGroup.classList.contains('user__message-error')){
            isValid=0;
        }else{
            isValid =1
        }
    })

    if(isValid == 0){
        e.preventDefault();
    }else{
        e.submit()
    }
}
if(submitBtnLogIn){
    submitBtnLogIn.addEventListener('click',submitFormLogin)
}
function submitFormLogin(e){
    let isValid=1
    checkUsername()
    checkPassword()
    formGroups.forEach((formGroup) => {
        if(formGroup.classList.contains('user__message-error')){
            isValid=0;
        }else{
            isValid =1
        }
    })

    if(isValid == 0){
        e.preventDefault();
    }else{
        e.submit()
    }
}
