const messageToast = document.getElementById('message-toast')
if (messageToast){
    const toast = new bootstrap.Toast(messageToast)
    toast.show()
}
const listCode = document.querySelectorAll('.input-code')

for (let i = 0; i < listCode.length; ++i) {
if(i===0) {
   listCode[i].focus() 
}
listCode[i].addEventListener('input', (event) => {
    if(event.target.value.length === 1) {
        if(i === listCode.length - 1) return;
        listCode[i+1].focus();
    } else {
        listCode[i].addEventListener('keydown', (event) => {
            console.log(event)
            if (event.key == 'Backspace' || event.key == 'Delete') {
                if(i === 0) return;
                listCode[i-1].focus();
                
            }
            
        })
    }
    
})

}

    document.addEventListener('keydown', (event) => {
    if(event.key == 'Enter') {
        document.getElementById('form-order-code').submit();
    }

})