// 权重总和计算
function calculateWeightTotal() {
    const weightInputs = document.querySelectorAll('.weight-input');
    let total = 0;
    weightInputs.forEach(input => {
        total += parseInt(input.value) || 0;
    });
    document.getElementById('weightTotal').textContent = total;
}

// 返回按钮
const returnButton = document.getElementById('returnButton');
returnButton.addEventListener('click', function() {
    window.location.href = '../../html/popup.html';
});

// 打开键盘快捷方式页面
const openShortcutsPage = document.getElementById('openShortcutsPage');
if (openShortcutsPage) {
    openShortcutsPage.addEventListener('click', function() {
        // Edge浏览器键盘快捷方式页面
        chrome.tabs.create({ url: 'edge://extensions/shortcuts' });
    });
}

// 保存设置到存储
async function saveSettingsToStorage() {
    try {
        const settings = {
            // 重量冗余设置
            weightRedundancyMode: document.querySelector('input[name="weightRedundancyMode"]:checked').value,
            weightRedundancyRatio: parseFloat(document.getElementById('weightRedundancyProportion').value) || 10,
            weightRedundancyFixed: parseFloat(document.getElementById('weightRedundancyFixed').value) || 50,
            
            // 尺寸冗余设置
            lengthRedundancy: parseFloat(document.getElementById('lengthRedundancy').value) || 5,
            widthRedundancy: parseFloat(document.getElementById('widthRedundancy').value) || 5,
            heightRedundancy: parseFloat(document.getElementById('heightRedundancy').value) || 5,
            
            // 成本冗余设置
            costRedundancyMode: document.querySelector('input[name="costRedundancyMode"]:checked').value,
            costRedundancyRatio: parseFloat(document.getElementById('costRedundancyProportion').value) || 5,
            costRedundancyFixed: parseFloat(document.getElementById('costRedundancyFixed').value) || 5,
            
            // 体积重计算参数
            volumeWeightDivisor: parseInt(document.getElementById('volumeWeightDivisor').value) || 8000,
            
            // 尺寸限制设置
            sizeLimits: {
                france: {
                    maxLength: parseFloat(document.getElementById('franceMaxLength').value) || 60,
                    minMaxLength: parseFloat(document.getElementById('franceMinMaxLength').value) || 15,
                    minMidLength: parseFloat(document.getElementById('franceMinMidLength').value) || 10,
                    maxSum: parseFloat(document.getElementById('franceMaxSum').value) || 90
                },
                uk: {
                    '0-2kg': {
                        maxLength: parseFloat(document.getElementById('uk0-2kgMaxLength').value) || 60,
                        minMaxLength: parseFloat(document.getElementById('uk0-2kgMinMaxLength').value) || 21,
                        minMidLength: parseFloat(document.getElementById('uk0-2kgMinMidLength').value) || 10,
                        maxLengthLimit: parseFloat(document.getElementById('uk0-2kgMaxLengthLimit').value) || 60,
                        maxWidthLimit: parseFloat(document.getElementById('uk0-2kgMaxWidthLimit').value) || 40,
                        maxHeightLimit: parseFloat(document.getElementById('uk0-2kgMaxHeightLimit').value) || 40,
                        maxVolume: parseFloat(document.getElementById('uk0-2kgMaxVolume').value) || 0.04
                    },
                    '2-15kg': {
                        maxLength: parseFloat(document.getElementById('uk2-15kgMaxLength').value) || 120,
                        minMaxLength: parseFloat(document.getElementById('uk2-15kgMinMaxLength').value) || 21,
                        minMidLength: parseFloat(document.getElementById('uk2-15kgMinMidLength').value) || 10,
                        maxSum: parseFloat(document.getElementById('uk2-15kgMaxSum').value) || 150,
                        maxVolume: parseFloat(document.getElementById('uk2-15kgMaxVolume').value) || 0.04
                    }
                }
            },
            
            // 汇率设置
            eurRate: parseFloat(document.getElementById('eurRate').value) || 7.5,
            gbpRate: parseFloat(document.getElementById('gbpRate').value) || 9.2,
            
            // 运费模板设置
            shippingTemplates: {
                france: getShippingSegments('france'),
                uk: getShippingSegments('uk')
            },
            
            // 权重设置
            weights: getWeightSettings()
        };
        
        await Storage.saveSettings(settings);
        alert('设置已保存');
    } catch (error) {
        console.error('保存设置失败:', error);
        alert('保存设置失败，请重试');
    }
}

// 获取运费段数据
function getShippingSegments(country) {
    const container = document.getElementById(country + 'WeightSegments');
    const segments = container.querySelectorAll('.weight-segment');
    const result = [];
    
    segments.forEach(segment => {
        result.push({
            min: parseFloat(segment.querySelector('.range-min').value) || 0,
            max: parseFloat(segment.querySelector('.range-max').value) || 15,
            registrationFee: parseFloat(segment.querySelector('.reg-fee').value) || 0,
            shippingFee: parseFloat(segment.querySelector('.ship-fee').value) || 0,
            otherFee: parseFloat(segment.querySelector('.other-fee').value) || 0
        });
    });
    
    return result;
}

// 获取权重设置数据
function getWeightSettings() {
    return {
        shippingMethod: parseInt(document.getElementById('weight-shippingMethod').value) || 5,
        rating: parseInt(document.getElementById('weight-rating').value) || 10,
        ratingCount: parseInt(document.getElementById('weight-ratingCount').value) || 5,
        listingTime: parseInt(document.getElementById('weight-listingTime').value) || 5,
        monthlySales: parseInt(document.getElementById('weight-monthlySales').value) || 15,
        deliveryTime: parseInt(document.getElementById('weight-deliveryTime').value) || 10,
        supplyCount: parseInt(document.getElementById('weight-supplyCount').value) || 5,
        impressionScore: parseInt(document.getElementById('weight-impressionScore').value) || 5,
        estimatedAdFee: parseInt(document.getElementById('weight-estimatedAdFee').value) || 10,
        competition: parseInt(document.getElementById('weight-competition').value) || 15,
        volumeWeight: parseInt(document.getElementById('weight-volumeWeight').value) || 5,
        pricePotential: parseInt(document.getElementById('weight-pricePotential').value) || 10,
        differentiation: parseInt(document.getElementById('weight-differentiation').value) || 10
    };
}

// 保存按钮
const saveButton = document.getElementById('saveButton');
saveButton.addEventListener('click', saveSettingsToStorage);

// 监听权重输入变化
document.querySelectorAll('.weight-input').forEach(input => {
    input.addEventListener('input', calculateWeightTotal);
});

// 重量冗余模式切换
const weightRedundancyModeRadios = document.querySelectorAll('input[name="weightRedundancyMode"]');
const weightProportionItem = document.getElementById('weightProportionItem');
const weightFixedItem = document.getElementById('weightFixedItem');

function updateWeightRedundancyMode() {
    const selectedMode = document.querySelector('input[name="weightRedundancyMode"]:checked').value;
    if (selectedMode === 'proportion') {
        weightProportionItem.classList.remove('hidden');
        weightFixedItem.classList.add('hidden');
    } else {
        weightProportionItem.classList.add('hidden');
        weightFixedItem.classList.remove('hidden');
    }
}

weightRedundancyModeRadios.forEach(radio => {
    radio.addEventListener('change', updateWeightRedundancyMode);
});

// 成本冗余模式切换
const costRedundancyModeRadios = document.querySelectorAll('input[name="costRedundancyMode"]');
const costProportionItem = document.getElementById('costProportionItem');
const costFixedItem = document.getElementById('costFixedItem');

function updateCostRedundancyMode() {
    const selectedMode = document.querySelector('input[name="costRedundancyMode"]:checked').value;
    if (selectedMode === 'proportion') {
        costProportionItem.classList.remove('hidden');
        costFixedItem.classList.add('hidden');
    } else {
        costProportionItem.classList.add('hidden');
        costFixedItem.classList.remove('hidden');
    }
}

costRedundancyModeRadios.forEach(radio => {
    radio.addEventListener('change', updateCostRedundancyMode);
});

// 获取实时汇率按钮
const fetchExchangeRateBtn = document.getElementById('fetchExchangeRateBtn');
const eurRateInput = document.getElementById('eurRate');
const gbpRateInput = document.getElementById('gbpRate');

fetchExchangeRateBtn.addEventListener('click', function() {
    fetchExchangeRateBtn.disabled = true;
    fetchExchangeRateBtn.textContent = '获取中...';
    
    // 使用免费汇率API获取人民币兑欧元和英镑汇率
    fetch('https://open.er-api.com/v6/latest/CNY')
        .then(response => response.json())
        .then(data => {
            let updatedCount = 0;
            let message = '汇率已更新:\n';
            
            // 获取欧元汇率 (EUR to CNY)
            if (data.rates.EUR) {
                const eurToCnyRate = (1 / data.rates.EUR).toFixed(2);
                eurRateInput.value = eurToCnyRate;
                message += '欧元: ' + eurToCnyRate + '\n';
                updatedCount++;
            }
            
            // 获取英镑汇率 (GBP to CNY)
            if (data.rates.GBP) {
                const gbpToCnyRate = (1 / data.rates.GBP).toFixed(2);
                gbpRateInput.value = gbpToCnyRate;
                message += '英镑: ' + gbpToCnyRate;
                updatedCount++;
            }
            
            if (updatedCount > 0) {
                alert(message);
            } else {
                throw new Error('无法获取汇率数据');
            }
        })
        .catch(error => {
            console.error('获取汇率失败:', error);
            // 如果API调用失败，使用模拟数据
            const eurMockRate = (7.5 + Math.random() * 0.2 - 0.1).toFixed(2);
            const gbpMockRate = (9.2 + Math.random() * 0.3 - 0.15).toFixed(2);
            eurRateInput.value = eurMockRate;
            gbpRateInput.value = gbpMockRate;
            alert('汇率已更新为模拟数据:\n欧元: ' + eurMockRate + '\n英镑: ' + gbpMockRate);
        })
        .finally(() => {
            fetchExchangeRateBtn.disabled = false;
            fetchExchangeRateBtn.textContent = '获取实时汇率';
        });
});

// 重量段管理 - 新增重量段
document.querySelectorAll('.add-segment').forEach(btn => {
    btn.addEventListener('click', function() {
        const country = this.dataset.country;
        const container = document.getElementById(country + 'WeightSegments');
        const segments = container.querySelectorAll('.weight-segment');
        const newIndex = segments.length;
        
        // 获取最后一个重量段的上限作为新段的下限
        let lastMax = '';
        if (segments.length > 0) {
            const lastSegment = segments[segments.length - 1];
            const maxInput = lastSegment.querySelector('.range-max');
            lastMax = maxInput.value || '';
        }
        
        const newSegment = document.createElement('div');
        newSegment.className = 'weight-segment';
        newSegment.dataset.index = newIndex;
        newSegment.innerHTML = `
            <div class="weight-range">
                <input type="number" class="range-min" value="${lastMax}" min="0" placeholder="下限">
                <span>-</span>
                <input type="number" class="range-max" value="15" min="0" step="0.1" placeholder="上限">
            </div>
            <input type="number" class="reg-fee" value="0" min="0" step="0.1">
            <input type="number" class="ship-fee" value="0" min="0" step="0.1">
            <input type="number" class="other-fee" value="0" min="0" step="0.1">
            <button type="button" class="delete-segment">删除</button>
        `;
        
        container.appendChild(newSegment);
        
        // 绑定删除事件
        bindDeleteEvent(newSegment.querySelector('.delete-segment'));
    });
});

// 重量段管理 - 删除重量段
function bindDeleteEvent(btn) {
    btn.addEventListener('click', function() {
        const segment = this.closest('.weight-segment');
        const container = segment.parentElement;
        segment.remove();
        
        // 更新剩余段的索引
        const segments = container.querySelectorAll('.weight-segment');
        segments.forEach((seg, index) => {
            seg.dataset.index = index;
        });
    });
}

// 绑定所有删除按钮事件
document.querySelectorAll('.delete-segment').forEach(btn => {
    bindDeleteEvent(btn);
});

// 从存储加载设置
async function loadSettingsFromStorage() {
    try {
        const settings = await Storage.getSettings();
        
        // 加载重量冗余设置
        const modeRadio = document.querySelector(`input[name="weightRedundancyMode"][value="${settings.weightRedundancyMode}"]`);
        if (modeRadio) modeRadio.checked = true;
        document.getElementById('weightRedundancyProportion').value = settings.weightRedundancyRatio;
        document.getElementById('weightRedundancyFixed').value = settings.weightRedundancyFixed;
        
        // 加载尺寸冗余设置
        document.getElementById('lengthRedundancy').value = settings.lengthRedundancy;
        document.getElementById('widthRedundancy').value = settings.widthRedundancy;
        document.getElementById('heightRedundancy').value = settings.heightRedundancy;
        
        // 加载成本冗余设置
        const costModeRadio = document.querySelector(`input[name="costRedundancyMode"][value="${settings.costRedundancyMode}"]`);
        if (costModeRadio) costModeRadio.checked = true;
        document.getElementById('costRedundancyProportion').value = settings.costRedundancyRatio;
        document.getElementById('costRedundancyFixed').value = settings.costRedundancyFixed;
        
        // 加载体积重计算参数
        document.getElementById('volumeWeightDivisor').value = settings.volumeWeightDivisor;
        
        // 加载尺寸限制设置
        // 法国
        document.getElementById('franceMaxLength').value = settings.sizeLimits.france.maxLength;
        document.getElementById('franceMinMaxLength').value = settings.sizeLimits.france.minMaxLength;
        document.getElementById('franceMinMidLength').value = settings.sizeLimits.france.minMidLength;
        document.getElementById('franceMaxSum').value = settings.sizeLimits.france.maxSum;
        
        // 英国 0-2kg
        document.getElementById('uk0-2kgMaxLength').value = settings.sizeLimits.uk['0-2kg'].maxLength;
        document.getElementById('uk0-2kgMinMaxLength').value = settings.sizeLimits.uk['0-2kg'].minMaxLength;
        document.getElementById('uk0-2kgMinMidLength').value = settings.sizeLimits.uk['0-2kg'].minMidLength;
        document.getElementById('uk0-2kgMaxLengthLimit').value = settings.sizeLimits.uk['0-2kg'].maxLengthLimit;
        document.getElementById('uk0-2kgMaxWidthLimit').value = settings.sizeLimits.uk['0-2kg'].maxWidthLimit;
        document.getElementById('uk0-2kgMaxHeightLimit').value = settings.sizeLimits.uk['0-2kg'].maxHeightLimit;
        document.getElementById('uk0-2kgMaxVolume').value = settings.sizeLimits.uk['0-2kg'].maxVolume;
        
        // 英国 2-15kg
        document.getElementById('uk2-15kgMaxLength').value = settings.sizeLimits.uk['2-15kg'].maxLength;
        document.getElementById('uk2-15kgMinMaxLength').value = settings.sizeLimits.uk['2-15kg'].minMaxLength;
        document.getElementById('uk2-15kgMinMidLength').value = settings.sizeLimits.uk['2-15kg'].minMidLength;
        document.getElementById('uk2-15kgMaxSum').value = settings.sizeLimits.uk['2-15kg'].maxSum;
        document.getElementById('uk2-15kgMaxVolume').value = settings.sizeLimits.uk['2-15kg'].maxVolume;
        
        // 加载汇率设置
        document.getElementById('eurRate').value = settings.eurRate;
        document.getElementById('gbpRate').value = settings.gbpRate;
        
        // 加载运费模板设置
        loadShippingSegments('france', settings.shippingTemplates.france);
        loadShippingSegments('uk', settings.shippingTemplates.uk);
        
        // 加载权重设置
        loadWeightSettings(settings.weights);
        
        // 更新界面状态
        updateWeightRedundancyMode();
        updateCostRedundancyMode();
        calculateWeightTotal();
    } catch (error) {
        console.error('加载设置失败:', error);
    }
}

// 加载运费段数据到界面
function loadShippingSegments(country, segments) {
    const container = document.getElementById(country + 'WeightSegments');
    // 清除除了表头之外的所有段
    const existingSegments = container.querySelectorAll('.weight-segment');
    existingSegments.forEach(seg => seg.remove());
    
    // 添加新段
    segments.forEach((segment, index) => {
        const newSegment = document.createElement('div');
        newSegment.className = 'weight-segment';
        newSegment.dataset.index = index;
        newSegment.innerHTML = `
            <div class="weight-range">
                <input type="number" class="range-min" value="${segment.min}" min="0" step="0.1" placeholder="下限">
                <span>-</span>
                <input type="number" class="range-max" value="${segment.max}" min="0" step="0.1" placeholder="上限">
            </div>
            <input type="number" class="reg-fee" value="${segment.registrationFee}" min="0" step="0.1">
            <input type="number" class="ship-fee" value="${segment.shippingFee}" min="0" step="0.1">
            <input type="number" class="other-fee" value="${segment.otherFee}" min="0" step="0.1">
            <button type="button" class="delete-segment">删除</button>
        `;
        
        container.appendChild(newSegment);
        bindDeleteEvent(newSegment.querySelector('.delete-segment'));
    });
}

// 加载权重设置到界面
function loadWeightSettings(weights) {
    const weightIds = [
        'shippingMethod', 'rating', 'ratingCount', 'listingTime', 'monthlySales',
        'deliveryTime', 'supplyCount', 'impressionScore', 'estimatedAdFee',
        'competition', 'volumeWeight', 'pricePotential', 'differentiation'
    ];
    
    weightIds.forEach(id => {
        const input = document.getElementById(`weight-${id}`);
        if (input && weights[id] !== undefined) {
            input.value = weights[id];
        }
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    loadSettingsFromStorage();
});