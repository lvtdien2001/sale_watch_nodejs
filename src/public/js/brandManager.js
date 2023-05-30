
for (let i=0; i<=9; i++){
    // default image
    const inputEditImage = document.getElementById(`input-edit-image-${i}`);
    if (inputEditImage){
        inputEditImage.onchange = (e) => {
            const src = URL.createObjectURL(e.target.files[0])
            document.getElementById(`preview-edit-image-${i}`).src = src
        }
    }
}

// show message
const messageToast = document.getElementById('message-toast')
if (messageToast){
    const toast = new bootstrap.Toast(messageToast)
    toast.show()
}