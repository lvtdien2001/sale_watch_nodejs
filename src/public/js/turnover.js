
// chart
const displayChart = () => {
    const ctx = document.getElementById('myChart');
    const data = new Array(12);
    const year = document.getElementById('year-filter').value;
    const month = document.getElementById('month-filter').value;
    const length = document.getElementById('turnover-list').getElementsByTagName('span').length;
    let labels = new Array(length);
    if (length<=12){
        labels.fill('Tháng ');
    }
    else {
        labels.fill('Ngày ');
    }

    for (let i=0; i<length; i++){
        data[i] = document.getElementById(`turnover-${i}`).innerText;
        labels[i] += (i+1);
    }
    new Chart(ctx, {
        type: month==='none' ? 'line' : 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: month!=='none' ? `Biểu đồ thống kê doanh thu ${month}-${year}` : `Biểu đồ thống kê doanh thu ${year}`,
                data: data,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

const filterChart = () => {
    document.getElementById('btn-filter-date').onclick = () => {
        const year = document.getElementById('year-filter').value;
        const month = document.getElementById('month-filter').value;
        
        if (year==='none'){
            return;
        }
    
        let params = `year=${year}`;
    
        if (month !== 'none'){
            params += `&month=${month}`;
        }
    
        window.location.href = `/admin/turnover?${params}`;
    }
}

displayChart();
filterChart();
