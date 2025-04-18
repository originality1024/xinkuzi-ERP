// 输入检查
const inputLong = document.getElementById('inputLong');
const inputWidth = document.getElementById('inputWidth');
const inputHeight = document.getElementById('inputHeight');
inputWidth.addEventListener("blur", () => {
    if (Number(inputWidth.value) > Number(inputLong.value) && inputLong.value != "") {
        window.alert("次长边不可大于最长边");
        inputWidth.value = ""; // 清空输入框内容
        inputWidth.focus(); // 设置焦点到 inputWidth 输入框
    }
});
inputHeight.addEventListener("blur", () => {
    if (Number(inputHeight.value) > Number(inputWidth.value)) {
        window.alert("最短边不可大于次长边"); 
        inputHeight.value = "";
        inputHeight.focus();
    }
});

function jisuan(load=false) {
    if (Number(inputHeight.value) < 1){
        if (!load){
            window.alert("输入长宽高数据");
            inputLong.focus();
        }
    }
    // 赋值
    const inputIds = ['inputPrice', 'inputLong', 'inputWidth', 'inputHeight', 'inputWeight', 'inputCost'];
    inputIds.forEach((id)=>{
        const input = document.getElementById(id);
        const savedValue = localStorage.getItem(id);
        input.value = savedValue;
    });
    // 待增加用户实时调整运费功能
    // 运费计算
    let specification = true;//初始化规格判断
    let expressFee = 0;//初始化运费
    // 规格判断
    const weight = Number(inputWeight.value);
    const long = Number(inputLong.value);
    const width = Number(inputWidth.value);
    const height = Number(inputHeight.value);
    if (0.1 <= weight && weight <= 2) {
        if (long >= 60 || long + width + height >= 90) {
            specification = false;
            if (!load){
                console.log("递四方超长--重量在0.1kg到2kg之间" + "\n" + long + "," + width + "," + height + "\n" + "规则为long >= 60 || long + width + height >= 90");
            }
        }
    } else if (2 < weight && weight <= 30) {
        if (long >= 80 || long + width + height >= 120) {
            specification = false;
            if (!load){
                console.log("递四方超长--重量在2kg到30kg之间" + "\n" + long + "," + width + "," + height + "\n" + "规则为long >= 80 || long + width + height >= 120");
            }
        }
    } else {
        specification = false;
        if (!load){
            console.log("重量异常" + "\n" + "检查是否不足0.1kg或超过30kg"); 
        }
    }
    // 递四方计算-联邮通经济挂普货-法国
    if (specification){//符合递四方规格
        if (inputWeight.value <= 0.2){//重量在0.2kg以下
            expressFee = 18 + (Number(inputWeight.value) * 65);//重量按千克计算，运费按重量*65元/千克
        }else if (inputWeight.value <= 0.5){//重量在0.5g以下
            expressFee = 19 + (Number(inputWeight.value) * 63);//重量按千克计算，运费按重量*63元/千克
        }else if (inputWeight.value <= 30){//重量在30kg以下
            expressFee = 23 + (Number(inputWeight.value) * 61);//重量按千克计算，运费按重量*61元/千克
        }
    } else {
        if (!load){
            console.log("不符合递四方规格"); 
        }
    }
    // 输出运费
    const expressFeeelement = document.getElementById('inputexpressFee');
    expressFeeelement.innerText = expressFee.toFixed(2)
    //利润计算
    const price = Number(inputPrice.value);
    const cost = Number(inputCost.value);
    const profit = document.getElementById('inputprofit');//运费
    profit.innerText = (price * 0.67 * 7.5 - cost - expressFee.toFixed(2)).toFixed(2);//利润=销售价*67%*7.5-采购价-快递费

    //等级评价待做
 
}

// 当采购价改变时触发
const Cost = document.getElementById('inputCost');
Cost.addEventListener("blur", ()=>{
    jisuan();
});
// ASIN改变时触发
const ASIN = document.getElementById('inputAsin');
ASIN.addEventListener("blur", ()=>{
    jisuan();
});
// 加载时触发
window.addEventListener("load", ()=>{
    jisuan(true);
});
// 待增加自动获取焦点至未填写数据