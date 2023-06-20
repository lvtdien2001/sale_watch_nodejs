document.title = 'Tìm kiếm'

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

const filter = searchValue => {
    const price = document.getElementById('price-filter').value;
    const brand = document.getElementById('brand-filter').value;
    const pathname = window.location.pathname;
    window.location.href = `${pathname}?key=${searchValue}&watchPerPage=8&brand=${brand}&price=${price}`;
}