document.getElementById('input-search').onkeydown = e => {
    if(e.key==='Enter'){
        if(e.target.value.trim() !== ''){
            window.location.href = `/search?key=${e.target.value.trim()}`
        }
        else {
            document.getElementById('search-err-message').style = null
        }
    }
}

document.getElementById('submit-search').onclick = () => {
    const inputSearch = document.getElementById('input-search').value.trim()
    if (inputSearch === '')
        document.getElementById('search-err-message').style = null;
    else window.location.href = `/search?key=${inputSearch}`
}