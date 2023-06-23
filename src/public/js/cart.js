document.title = 'Giỏ hàng'
const messageToast = document.getElementById('message-toast')
if (messageToast){
    const toast = new bootstrap.Toast(messageToast)
    toast.show()
}