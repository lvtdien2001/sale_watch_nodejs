
// show message
let toastTrigger = document.getElementById('liveToastBtn')
const toastLiveExample = document.getElementById('liveToast')
const message = document.getElementById('message')
if (toastTrigger) {
    toastTrigger.addEventListener('click', function () {
        const toast = new bootstrap.Toast(toastLiveExample)

        toast.show()
    })
}