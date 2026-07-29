const clear = document.getElementById('clearButton');
clear.addEventListener('click', () => {
    const inputIds = ['inputName', 'inputPrice', 'inputLong', 'inputWidth', 'inputHeight', 'inputWeight', 'inputCost', 'inputLink', 'inputAsin'];
    const countIds = ['expressFee', 'profit', 'level'];
    inputIds.forEach((id) => {
        const inputElement = document.getElementById(id);
        if (inputElement) {
            inputElement.value = '';
        }
        localStorage.setItem(id, inputElement.value);
    });
    countIds.forEach((id) => {
        const countElement = document.getElementById(id);
        if (countElement) {
            countElement.innerText = '';
        }
    })
})