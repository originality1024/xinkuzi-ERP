const LfiLiCh = document.getElementById("fiLiCh");
const Llabels = ['一月份', '二月份', '三月份', '四月份'];  // 设置 X 轴上对应的标签
const Ldata = {
    labels: Llabels,
    datasets: [
        {
            label: '本年度财务数据',
            data: [65, 59, 80, 18],
            fill: false,
            borderColor: '#b62100', // 设置线的颜色
            tension: 0.1
        }
    ]
};
const Lconfig = {
    type: 'line', // 设置图表类型
    data: Ldata
};
const fiLiCh = new Chart(LfiLiCh, Lconfig);

const PfiPiCh = document.getElementById('fiPiCh');
const Pdata = {
    labels: [
        '一月',
        '二月',
        '三月',
        '四月'
    ],
    datasets: [
        {
            label: '年度财务饼图',
            data: [300, 50, 100, 100],
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)'
            ],
            hoverOffset: 4
        }
    ]
};
const Pconfig = {
    type: 'pie',
    data: Pdata,
    options: {
        responsive: true, // 设置图表为响应式，根据屏幕窗口变化而变化
        maintainAspectRatio: false, // 保持图表原有比例
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true
                    }
                }
            ]
        }
    }
};
const fiPiCh = new Chart(PfiPiCh, Pconfig);

// 获取 appearance(外观) 元素
const appearance = document.getElementById('appearance');
// 为 appearance 添加点击事件监听器
appearance.addEventListener('click', function() {
    const appearanceimg = document.getElementById('appearanceimg');
    if (appearanceimg.alt === 'moon') {
        appearanceimg.src = '../../public/sunbutton.png';
        appearanceimg.alt = 'sun';
        // 简化选择器
        const link = document.querySelector('link[rel="stylesheet"]');
        if (link) {
            link.href = '../css/moonportal.css';
        } else {
            window.alert('更换失败');
        }
    } else if (appearanceimg.alt === 'sun') {
        appearanceimg.src = '../../public/moonbutton.png';
        appearanceimg.alt = 'moon';
        const link = document.querySelector('link[rel="stylesheet"]');
        if (link) {
            link.href = '../css/sunportal.css'; 
        } else {
            window.alert('更换失败');
        }
    }
});