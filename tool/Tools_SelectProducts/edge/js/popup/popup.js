// 输入检查
const inputLong = document.getElementById('inputLong');
const inputWidth = document.getElementById('inputWidth');
const inputHeight = document.getElementById('inputHeight');
const inputWeight = document.getElementById('inputWeight');
const inputPrice = document.getElementById('inputPrice');
const inputCost = document.getElementById('inputCost');

inputWidth.addEventListener("blur", () => {
    if (Number(inputWidth.value) > Number(inputLong.value) && inputLong.value != "") {
        window.alert("次长边不可大于最长边");
        inputWidth.value = "";
        inputWidth.focus();
    }
});

inputHeight.addEventListener("blur", () => {
    if (Number(inputHeight.value) > Number(inputWidth.value)) {
        window.alert("最短边不可大于次长边"); 
        inputHeight.value = "";
        inputHeight.focus();
    }
});

// 当前设置缓存
let currentSettings = null;

// 从存储加载设置
async function loadSettings() {
    try {
        currentSettings = await Storage.getSettings();
        console.log('已加载设置:', currentSettings);
    } catch (error) {
        console.error('加载设置失败:', error);
        // 使用默认设置
        currentSettings = { ...Storage.DEFAULT_SETTINGS };
    }
}

// 根据重量匹配运费段
function matchShippingSegment(weight, segments) {
    // 按最小重量排序
    const sortedSegments = [...segments].sort((a, b) => a.min - b.min);
    
    for (const segment of sortedSegments) {
        // 如果上限为空或重量小于上限
        if ((segment.max === undefined || segment.max === null || segment.max === '') || 
            weight <= segment.max) {
            if (weight >= segment.min) {
                return segment;
            }
        }
    }
    
    // 如果没有匹配，返回最后一个段
    return sortedSegments[sortedSegments.length - 1] || null;
}

// 计算重量冗余后的实际重量
function calculateWeightWithRedundancy(baseWeight) {
    if (!currentSettings) return baseWeight;
    
    const mode = currentSettings.weightRedundancyMode;
    
    if (mode === 'proportion') {
        // 比例冗余
        const ratio = (currentSettings.weightRedundancyRatio || 10) / 100;
        return baseWeight * (1 + ratio);
    } else {
        // 固定冗余 (g -> kg)
        const fixedRedundancy = (currentSettings.weightRedundancyFixed || 50) / 1000;
        return baseWeight + fixedRedundancy;
    }
}

// 计算尺寸冗余后的实际尺寸
function calculateDimensionsWithRedundancy(long, width, height) {
    if (!currentSettings) return { long, width, height };
    
    const lr = currentSettings.lengthRedundancy || 5;
    const wr = currentSettings.widthRedundancy || 5;
    const hr = currentSettings.heightRedundancy || 5;
    
    return {
        long: long + lr,
        width: width + wr,
        height: height + hr
    };
}

// 计算成本冗余后的实际成本
function calculateCostWithRedundancy(baseCost) {
    if (!currentSettings) return baseCost;
    
    const mode = currentSettings.costRedundancyMode;
    
    if (mode === 'proportion') {
        // 比例冗余
        const ratio = (currentSettings.costRedundancyRatio || 5) / 100;
        return baseCost * (1 + ratio);
    } else {
        // 固定冗余
        const fixedRedundancy = currentSettings.costRedundancyFixed || 5;
        return baseCost + fixedRedundancy;
    }
}

// 计算体积重
function calculateVolumeWeight(long, width, height) {
    if (!currentSettings || isNaN(long) || isNaN(width) || isNaN(height) || long <= 0 || width <= 0 || height <= 0) {
        return 0;
    }
    
    const divisor = currentSettings.volumeWeightDivisor || 8000;
    // 体积重 = 长×宽×高(cm) ÷ 除数 = kg
    return (long * width * height) / divisor;
}

// 校验尺寸是否符合要求
function checkSizeLimits(long, width, height, country, weight) {
    if (!currentSettings || isNaN(long) || isNaN(width) || isNaN(height) || long <= 0 || width <= 0 || height <= 0) {
        return { valid: true, messages: [] };
    }
    
    const sizeLimits = currentSettings.sizeLimits && currentSettings.sizeLimits[country];
    if (!sizeLimits) {
        return { valid: true, messages: [] };
    }
    
    // 对三边进行排序（降序）
    const sorted = [long, width, height].sort((a, b) => b - a);
    const maxLen = sorted[0]; // 最长边
    const midLen = sorted[1]; // 次长边
    const minLen = sorted[2]; // 最短边
    const sum = long + width + height;
    const volume = (long * width * height) / 1000000; // 转换为 m³
    
    const messages = [];
    
    if (country === 'france') {
        // 法国尺寸限制
        // 最长边限制: <= maxLength
        if (maxLen > sizeLimits.maxLength) {
            messages.push(`最长边 ${maxLen}cm 超过限制 ${sizeLimits.maxLength}cm`);
        }
        // 最长边最小: > minMaxLength（法国: 最长边 > 15cm）
        if (maxLen <= sizeLimits.minMaxLength) {
            messages.push(`最长边 ${maxLen}cm 小于最小要求 ${sizeLimits.minMaxLength}cm`);
        }
        // 次长边最小: > minMidLength（法国: 次长边 > 10cm）
        if (midLen <= sizeLimits.minMidLength) {
            messages.push(`次长边 ${midLen}cm 小于最小要求 ${sizeLimits.minMidLength}cm`);
        }
        // 长+宽+高限制: <= maxSum
        if (sum > sizeLimits.maxSum) {
            messages.push(`长+宽+高 ${sum}cm 超过限制 ${sizeLimits.maxSum}cm`);
        }
    } else if (country === 'uk') {
        // 英国尺寸限制，根据重量选择不同规则
        const weightClass = weight <= 2 ? '0-2kg' : '2-15kg';
        const limits = sizeLimits[weightClass];
        
        if (!limits) {
            return { valid: true, messages: [] };
        }
        
        // 最长边限制: <= maxLength
        if (maxLen > limits.maxLength) {
            messages.push(`最长边 ${maxLen}cm 超过限制 ${limits.maxLength}cm`);
        }
        // 最长边最小: > minMaxLength（英国: 最长边 > 21cm）
        if (maxLen <= limits.minMaxLength) {
            messages.push(`最长边 ${maxLen}cm 小于最小要求 ${limits.minMaxLength}cm`);
        }
        // 次长边最小: > minMidLength（英国: 次长边 > 10cm）
        if (midLen <= limits.minMidLength) {
            messages.push(`次长边 ${midLen}cm 小于最小要求 ${limits.minMidLength}cm`);
        }
        
        if (weightClass === '0-2kg') {
            // 0-2kg 特殊限制 - 三边长度限制
            if (maxLen > limits.maxLengthLimit) {
                messages.push(`三边长度限制-长 ${maxLen}cm 超过限制 ${limits.maxLengthLimit}cm`);
            }
            if (midLen > limits.maxWidthLimit) {
                messages.push(`三边长度限制-宽 ${midLen}cm 超过限制 ${limits.maxWidthLimit}cm`);
            }
            if (minLen > limits.maxHeightLimit) {
                messages.push(`三边长度限制-高 ${minLen}cm 超过限制 ${limits.maxHeightLimit}cm`);
            }
        } else {
            // 2-15kg 特殊限制 - 长+宽+高限制
            if (sum > limits.maxSum) {
                messages.push(`长+宽+高 ${sum}cm 超过限制 ${limits.maxSum}cm`);
            }
        }
        
        // 体积限制（两个重量段都有）
        if (volume >= limits.maxVolume) {
            messages.push(`体积 ${volume.toFixed(4)}m³ 超过限制 ${limits.maxVolume}m³`);
        }
    }
    
    return {
        valid: messages.length === 0,
        messages: messages
    };
}

// 获取当前汇率
function getCurrentExchangeRate() {
    if (!currentSettings) return 7.5;
    
    const shippingTemplate = document.getElementById('shippingTemplate');
    const country = shippingTemplate.value;
    
    return country === 'uk' ? (currentSettings.gbpRate || 9.2) : (currentSettings.eurRate || 7.5);
}

// 运费计算主函数
async function jisuan(load=false) {
    // 确保设置已加载
    if (!currentSettings) {
        await loadSettings();
    }
    
    // 赋值（从localStorage暂存）
    const inputIds = ['inputPrice', 'inputLong', 'inputWidth', 'inputHeight', 'inputWeight', 'inputCost'];
    inputIds.forEach((id)=>{
        const input = document.getElementById(id);
        const savedValue = localStorage.getItem(id);
        if (savedValue) input.value = savedValue;
    });
    
    // 获取输入值
    const weight = Number(inputWeight.value);
    const long = Number(inputLong.value);
    const width = Number(inputWidth.value);
    const height = Number(inputHeight.value);
    
    // 计算冗余后的实际尺寸和重量
    const actualDimensions = calculateDimensionsWithRedundancy(long, width, height);
    const actualWeight = calculateWeightWithRedundancy(weight);
    
    // 计算体积重
    const volumeWeight = calculateVolumeWeight(actualDimensions.long, actualDimensions.width, actualDimensions.height);
    
    // 计费重量 = 实际重量和体积重取较大值
    let chargeableWeight = Math.max(actualWeight, volumeWeight);
    // 如果计费重量为NaN（没有输入任何数据），默认设为0
    if (isNaN(chargeableWeight)) {
        chargeableWeight = 0;
    }
    
    // 获取当前选中的运费模板
    const shippingTemplate = document.getElementById('shippingTemplate');
    const country = shippingTemplate.value;
    const segments = currentSettings.shippingTemplates[country] || [];
    
    // 校验尺寸限制
    const sizeCheckResult = checkSizeLimits(actualDimensions.long, actualDimensions.width, actualDimensions.height, country, chargeableWeight);
    
    // 规格判断：根据重量范围判断
    let specification = true;
    let specMessage = "";
    
    if (isNaN(chargeableWeight) || chargeableWeight <= 0) {
        // 没有输入重量，允许计算（快速估算）
        specification = true;
    } else if (chargeableWeight < 0.1) {
        specification = false;
        specMessage = "重量不足0.1kg";
    } else if (chargeableWeight > 15) {
        specification = false;
        specMessage = "重量超过15kg";
    }
    
    // 如果尺寸不符合要求，也标记为不符合规格
    if (!sizeCheckResult.valid) {
        specification = false;
        specMessage = specMessage ? specMessage + "; " : "";
        specMessage += sizeCheckResult.messages.join("; ");
    }
    
    // 计算运费
    let expressFee = 0;
    if (segments.length > 0) {
        const matchedSegment = matchShippingSegment(chargeableWeight, segments);
        if (matchedSegment) {
            const registrationFee = matchedSegment.registrationFee || 0;
            const shippingFeePerKg = matchedSegment.shippingFee || 0;
            const otherFee = matchedSegment.otherFee || 0;
            
            expressFee = registrationFee + (chargeableWeight * shippingFeePerKg) + otherFee;
        }
    }
    
    // 如果不符合规格，仍计算运费但提示
    const warningElement = document.getElementById('warningMessage');
    if (!specification && !load && specMessage) {
        console.log("规格不符合: " + specMessage);
        warningElement.innerText = "⚠ " + specMessage;
        warningElement.style.display = 'flex';
    } else {
        warningElement.style.display = 'none';
    }
    
    // 输出运费
    const expressFeeElement = document.getElementById('inputexpressFee');
    expressFeeElement.innerText = "运:" + expressFee.toFixed(2);
    
    // 获取汇率和成本
    const exchangeRate = getCurrentExchangeRate();
    const price = Number(inputPrice.value);
    const baseCost = Number(inputCost.value);
    const actualCost = calculateCostWithRedundancy(baseCost);
    
    // 利润计算：利润 = 销售价 * 67% * 汇率 - 成本(含冗余) - 运费
    const profit = document.getElementById('inputprofit');
    const profitValue = price * 0.67 * exchangeRate - actualCost - expressFee;
    profit.innerText = "利:" + profitValue.toFixed(2);
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

// 币种切换功能 - 切换运费模板时自动更新售价货币符号并重新计算
const shippingTemplate = document.getElementById('shippingTemplate');

shippingTemplate.addEventListener('change', async function() {
    const selectedOption = this.options[this.selectedIndex];
    const currency = selectedOption.dataset.currency;
    inputPrice.placeholder = '售价' + currency;
    await jisuan();
});

// 加载时触发
window.addEventListener("load", async ()=>{
    await loadSettings();
    await jisuan(true);
    
    // 初始化售价货币符号
    const selectedOption = shippingTemplate.options[shippingTemplate.selectedIndex];
    const currency = selectedOption.dataset.currency;
    inputPrice.placeholder = '售价' + currency;
    
    // 自动跳转到第一个空输入框
    focusFirstEmptyInput();
    
    // 初始化置顶和小窗按钮事件
    initWindowButtons();
});

/**
 * 自动跳转到第一个空输入框（从前到后）
 */
function focusFirstEmptyInput() {
    const inputFields = [
        document.getElementById('inputName'),
        document.getElementById('inputPrice'),
        document.getElementById('inputLong'),
        document.getElementById('inputWidth'),
        document.getElementById('inputHeight'),
        document.getElementById('inputWeight'),
        document.getElementById('inputCost'),
        document.getElementById('inputLink'),
        document.getElementById('inputAsin')
    ];
    
    for (const input of inputFields) {
        if (!input.value || input.value.trim() === '') {
            input.focus();
            input.select();
            break;
        }
    }
}

/**
 * 初始化小窗按钮
 */
function initWindowButtons() {
    // 小窗按钮
    const miniButton = document.getElementById('miniButton');
    if (miniButton) {
        miniButton.addEventListener('click', toggleMiniWindow);
    }
}

/**
 * 切换小窗模式
 */
async function toggleMiniWindow() {
    try {
        // 发送消息给background.js，由它统一处理小窗的打开/关闭
        chrome.runtime.sendMessage({ action: 'toggleMiniWindow' }, (response) => {
            console.log('消息发送成功', response);
        });
        
        // 延迟关闭当前窗口（无论是扩展popup还是小窗）
        setTimeout(() => {
            window.close();
        }, 50);
    } catch (error) {
        console.error('切换小窗失败:', error);
        alert('小窗功能调用失败');
    }
}