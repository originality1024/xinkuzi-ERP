// 页面加载时从 localStorage 读取数据并添加到表格
document.addEventListener('DOMContentLoaded', function() {
    // 查询文档中的表格 tbody 元素，后续将在此添加表格行
    const table = document.querySelector('table tbody');
    let allData = JSON.parse(localStorage.getItem('allViewData')) || [];
    console.log(allData);

    // 遍历从 localStorage 中获取的所有数据
    allData.forEach(function(data, index) {
        const row = document.createElement('tr');
        const viewIds = ['viewName', 'viewPrice', 'viewLong', 'viewWidth', 'viewHeight', 'viewWeight', 'viewCost', 'viewLink', 'viewAsin', 'viewexpressFee', 'viewprofit', 'viewlevel'];
        viewIds.forEach(function (id) {
            const value = data[id];
            const cell = document.createElement('td');
            if (id === 'viewLink') {
                const link = document.createElement('a');
                link.href = value;
                link.textContent = '1688';
                cell.appendChild(link);
            } else {
                cell.textContent = value;
            }
            row.appendChild(cell);
        });

        // 添加删除按钮
        const deleteCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'delete-button';
        deleteButton.textContent = '删除';
        deleteButton.addEventListener('click', function() {
            allData.splice(index, 1);
            localStorage.setItem('allViewData', JSON.stringify(allData));
            row.remove();
        });
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);
        table.appendChild(row);
    });
});

// 返回按钮
const Return = document.getElementById('returnButton');
Return.addEventListener('click', function() {
    window.location.href = '../popup.html';
});

// 导出为 Excel 按钮
const exportButton = document.getElementById('exportButton');
exportButton.addEventListener('click', function() {
    window.alert("导出成功");
    const table = document.getElementById('dataTable');
    const ws = XLSX.utils.table_to_sheet(table);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "选品表.xlsx");

    // 清空 localStorage 中所有数据
    localStorage.clear();

    // 清空表格
    const tableBody = document.querySelector('table tbody');
    tableBody.innerHTML = '';
});