// 在页面加载时，从localStorage中恢复数据
document.addEventListener('DOMContentLoaded',  () => {
    const inputIds = ['inputName', 'inputPrice', 'inputLong', 'inputWidth', 'inputHeight', 'inputWeight', 'inputCost', 'inputLink', 'inputAsin'];
    inputIds.forEach( (id) => {
        const input = document.getElementById(id);
        const savedValue = localStorage.getItem(id);
        if (savedValue) {
            input.value = savedValue;
        }
    });
});

// 在输入框内容变化时，保存数据到localStorage
const inputIds = ['inputName', 'inputPrice', 'inputLong', 'inputWidth', 'inputHeight', 'inputWeight', 'inputCost', 'inputLink', 'inputAsin'];
inputIds.forEach((id) => {
    const input = document.getElementById(id);
    input.addEventListener('input', () => {
        localStorage.setItem(id, input.value);
    });
});