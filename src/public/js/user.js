const fullNameInput= document.querySelector('#fullName')
const phoneNumberInput= document.querySelector('#phoneNumber')
const usernameInput= document.querySelector('#username')
const passInput= document.querySelector('#password')
const confirmPassInput= document.querySelector('#confirm-pass')
const submitBtn= document.querySelector('#submit-btn')
const submitBtnLogIn= document.querySelector('#submit-btn-login')
const formBlock= document.querySelector('.form__block')
const formGroups =formBlock.querySelectorAll('.form__group')
const title= document.querySelector('.title')
document.title=title.textContent

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
if(usernameInput){
    usernameInput.addEventListener('blur', checkUsername)
    function checkUsername(e){
        const emailFormat=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        usernameInput.value.match(emailFormat) ?  messageSuccess(usernameInput,'Hợp lệ') :messageError(usernameInput,'không phải là email')
    }
}
if(passInput){
    passInput.addEventListener('blur', checkPassword)
    function checkPassword(e){
        passInput.value.length < 3 ? messageError(passInput,'Mật khẩu quá ngắn') : messageSuccess(passInput,'Hợp lệ')
    }
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
    phoneNumberInput.value.length < 10 ? messageError(phoneNumberInput,'Số điện thoại chưa hợp lệ') : messageSuccess(phoneNumberInput,'Hợp lệ')
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
    let isValid=1
    checkFullName()
    checkPhoneNumber()
    checkUsername()
    checkPassword()
    checkMatchPass()
    formGroups.forEach((formGroup) => {
        if(formGroup.classList.contains('user__message-error')){
            isValid=0;
        }
    })

    if(isValid == 0){
        e.preventDefault();
    }else{
        submitBtn.submit()
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
        }
    })

    if(isValid == 0){
        e.preventDefault();
    }else{
        submitBtnLogIn.submit()
    }
}


const btnOpen = document.querySelector('.forgot__pass')
const overlay = document.querySelector('.overlay')
const btnClose = document.querySelector('.btn__close')
const overlay2 = document.querySelector('.overlay2')
const btnClose2 = document.querySelector('.btn__close2')
const overlay3 = document.querySelector('.overlay3')
const btnClose3 = document.querySelector('.btn__close3')
if(btnClose){
    btnClose.addEventListener("click", function () {
        overlay.style.display = "none";
    });
}
if(btnOpen){
    btnOpen.addEventListener("click", function () {
        overlay.style.display = "flex";
    });

}
if(btnClose2){
    btnClose2.addEventListener("click", function () {
        overlay2.style.display = "none";
    });
}
if(btnClose3){
    btnClose3.addEventListener("click", function () {
        overlay3.style.display = "none";
    });
}


// đôi mật khẩu
const passInputChange= document.querySelector('#password-old')
const passInputNewChange= document.querySelector('#password-new')
const confirmPassInputChange= document.querySelector('#confirm-pass-change')
const submitBtnChange= document.querySelector('#submit-btn')
const btnChangePass = document.querySelector('.btn-change-pass')

if(passInputNewChange){
    passInputNewChange.addEventListener('blur', checkPasswordChangePass)
}
function checkPasswordChangePass(e){
    passInputNewChange.value.length < 6 ? messageError(passInputNewChange,'Mật khẩu quá ngắn') : messageSuccess(passInputNewChange,'Hợp lệ')
}

if(confirmPassInputChange){
    confirmPassInputChange.addEventListener('blur', checkMatchPassChange)
}
function checkMatchPassChange(e){
    if( confirmPassInputChange.value != passInputNewChange.value || confirmPassInputChange.value.length < 4){
        messageError(confirmPassInputChange,'Mật khẩu không trùng khớp')
        btnChangePass.preventDefault()
    }
    else{
        messageSuccess(confirmPassInputChange,'Hợp lệ')
    }
}
const formChangePass = document.querySelector('#change-pass-form')
if(btnChangePass){
    btnChangePass.addEventListener('click',submitFormChangePasss)
}
function submitFormChangePasss(e){
    let isValid=1
    e.preventDefault()   
    checkPasswordChangePass()
    checkMatchPassChange()
    formGroups.forEach((formGroup) => {
        if(formGroup.classList.contains('user__message-error')){
            isValid=0;
        }
    })

    if(isValid == 0){
        formChangePass.preventDefault();
    }else{
        formChangePass.submit()
    }
}