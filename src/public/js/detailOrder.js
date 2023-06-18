document.addEventListener("DOMContentLoaded", () => {
    let printLink = document.getElementById("print");

    printLink.addEventListener("click", event => {
        event.preventDefault();
        window.print();
    }, false);

   

}, false);

