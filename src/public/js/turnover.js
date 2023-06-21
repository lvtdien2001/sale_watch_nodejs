const ctx = document.getElementById('myChart');
    new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
        datasets: [{
        label: 'Biểu đồ thống kê doanh thu 2023',
        data: [0, 1000000, 3000000, 5, 2, 3, 0, 1000000, 3000000, 50129202, 21241211, 3],
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