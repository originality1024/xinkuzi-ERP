const save = document.getElementById('saveButton');

// 第一次点击保存会保存两条，未知原因，偶尔触发，第二次点击正常，待解决

// 数据收集逻辑
function collectData(ids, isValue = true) {
    return ids.reduce((data, id, index) => {
        const element = document.getElementById(id);
        data[`view${id.slice(5)}`] = isValue ? element.value : element.innerText;
        return data;
    }, {});
}

save.addEventListener('click', () => {
    const inputIds = ['inputName', 'inputPrice', 'inputLong', 'inputWidth', 'inputHeight', 'inputWeight', 'inputCost', 'inputLink', 'inputAsin'];
    const countIds = ['inputexpressFee', 'inputprofit', 'inputlevel'];
    try {
        const inputData = collectData(inputIds);
        const countData = collectData(countIds, false);
        const newData = { ...inputData, ...countData };//ES6语法糖  ...展开运算符
        let allData = JSON.parse(localStorage.getItem('allViewData')) || [];
        allData.push(newData);
        localStorage.setItem('allViewData', JSON.stringify(allData));

        // // 清除输入框的数据
        // inputIds.forEach(id => {
        //     const inputElement = document.getElementById(id);
        //     if (inputElement) {
        //         inputElement.value = '';
        //     }
        // });
    } catch (error) {
        console.error('保存数据到 localStorage 时出错:', error);
    }
});