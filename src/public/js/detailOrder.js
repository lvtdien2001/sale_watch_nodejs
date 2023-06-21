
const printPDF = (title) => {
    let mywindow = window.open('', 'PRINT', 'height=1123,width=900,top=100,left=150');

    mywindow.document.write(`<html><head><title>${title}</title>`);
    mywindow.document.write('</head><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous"><body >');
    mywindow.document.write(document.getElementById(`order-pdf`).innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();
}
