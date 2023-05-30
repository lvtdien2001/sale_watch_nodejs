
for (let i=0; i<=9; i++){
    // default value of brand
    const currentBrand = document.getElementById(`brand-${i}`)?.innerHTML.trim();
    if (currentBrand){ // if currentBrand is exist
        const attr = document.createAttribute('selected');
        attr.value = 'selected';

        const brands = document.getElementById(`input-edit-brand-${i}`);
        const brandLength = brands.length;
        for (let j=1; j<brandLength; j++){
            if (currentBrand === brands[j].innerHTML){
                document.querySelectorAll(`#input-edit-brand-${i}`)[0][j].setAttributeNode(attr)
            }
        }
    }

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
