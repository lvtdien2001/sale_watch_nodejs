const overlay = document.querySelector(".overlay");
const btnClose = document.querySelector(".btn__close");
const btnOpen = document.querySelector(".btn__open");
const formComment = document.querySelector(".form__comment");
const inputRate = document.querySelector(".rate");
const stars = document.querySelectorAll(".star");
btnClose.addEventListener("click", function () {
    overlay.style.display = "none";
});
btnOpen.addEventListener("click", function () {
    overlay.style.display = "flex";
});
var count = 0;
stars.forEach((star, index1) => {
    star.addEventListener("click", function () {
        stars.forEach((star2, index2) => {
            if (index1 >= index2) {
                const elementStart = star2.querySelector("i");
                elementStart.classList.add("fa-solid");
                elementStart.classList.remove("fa-regular");
                count = index2 + 1;
            } else {
                const elementStart = star2.querySelector("i");
                elementStart.classList.remove("fa-solid");
                elementStart.classList.add("fa-regular");
            }
        });
        inputRate.value = count;
    });
});

const inputImageFile = document.querySelector('#comment__img')
const imageUser = document.querySelector('.comment__img')
const fileImg = document.querySelector('.file__img')
const deleteImg = document.querySelector('.delete__img')
inputImageFile.addEventListener('change', (e) => {
    const src = URL.createObjectURL(e.target.files[0])
    imageUser.src = src
    fileImg.style.display='flex'
})

deleteImg.addEventListener('click', function(){
    imageUser.src= ''
    fileImg.style.display='none'
})

const resBtn = document.querySelector('.res__btn')
const resContent = document.querySelector('.res')
let displayStyle = false
resBtn.addEventListener('click',function(){
    displayStyle=!displayStyle
    if(displayStyle){
        resContent.style.display='block'
    }else{
        resContent.style.display='none'

    }
})
