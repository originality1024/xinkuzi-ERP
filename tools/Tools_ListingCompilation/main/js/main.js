document.addEventListener('DOMContentLoaded', function() {
    initKeywordImport();
    initCharCount();
    initPreview();
    initSave();
    initInsertButtons();
    initKeywordGrading();
});

function initKeywordImport() {
    const importBtn = document.getElementById('importKeywords');
    const fileInput = document.getElementById('keywordFile');
    
    importBtn.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            const content = event.target.result;
            parseAndImportKeywords(content);
        };
        reader.readAsText(file);
    });
}

function parseAndImportKeywords(content) {
    const lines = content.split(/[\n\r]+/).filter(line => line.trim());
    const categoryTextareas = document.querySelectorAll('.category-textarea');
    
    lines.forEach((line, index) => {
        const textareaIndex = index % categoryTextareas.length;
        const textarea = categoryTextareas[textareaIndex];
        const currentValue = textarea.value.trim();
        textarea.value = currentValue ? currentValue + '\n' + line : line;
    });
    
    alert('关键词导入成功！');
}

function initCharCount() {
    const titleInput = document.getElementById('productTitle');
    const titleCharCount = titleInput.nextElementSibling;
    
    titleInput.addEventListener('input', function() {
        titleCharCount.textContent = this.value.length + '/200';
    });
    
    const searchTermsInput = document.getElementById('searchTerms');
    const searchCharCount = searchTermsInput.nextElementSibling;
    
    searchTermsInput.addEventListener('input', function() {
        searchCharCount.textContent = this.value.length + '/249';
    });
}

function initPreview() {
    const previewBtn = document.getElementById('previewListing');
    const modal = document.getElementById('previewModal');
    const closeBtn = document.querySelector('.close');
    
    previewBtn.addEventListener('click', function() {
        generatePreview();
        modal.style.display = 'block';
    });
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function generatePreview() {
    const title = document.getElementById('productTitle').value;
    const bullets = document.querySelectorAll('.bullet-textarea');
    const description = document.getElementById('productDescription').value;
    const searchTerms = document.getElementById('searchTerms').value;
    
    let html = '';
    
    if (title) {
        html += '<h3>商品标题</h3>';
        html += '<p style="font-size: 16px; font-weight: bold; color: #232f3e;">' + escapeHtml(title) + '</p>';
    }
    
    html += '<h3>五点描述</h3>';
    html += '<ul>';
    bullets.forEach((bullet, index) => {
        if (bullet.value.trim()) {
            html += '<li><strong>卖点' + (index + 1) + ':</strong> ' + escapeHtml(bullet.value) + '</li>';
        }
    });
    html += '</ul>';
    
    if (description) {
        html += '<h3>商品描述</h3>';
        html += '<div>' + description + '</div>';
    }
    
    if (searchTerms) {
        html += '<h3>搜索关键词</h3>';
        html += '<p style="font-family: monospace; font-size: 12px; color: #666; background: #f9f9f9; padding: 10px; border-radius: 4px;">' + escapeHtml(searchTerms) + '</p>';
    }
    
    document.getElementById('previewContent').innerHTML = html || '<p style="color: #999;">暂无内容，请先填写Listing信息</p>';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function initSave() {
    const saveBtn = document.getElementById('saveListing');
    
    saveBtn.addEventListener('click', function() {
        const listingData = {
            title: document.getElementById('productTitle').value,
            bullets: Array.from(document.querySelectorAll('.bullet-textarea')).map(b => b.value),
            description: document.getElementById('productDescription').value,
            searchTerms: document.getElementById('searchTerms').value,
            keywords: {
                core: document.querySelectorAll('.category-textarea')[0].value,
                longTail: document.querySelectorAll('.category-textarea')[1].value,
                attribute: document.querySelectorAll('.category-textarea')[2].value,
                competitor: document.querySelectorAll('.category-textarea')[3].value
            },
            grading: {
                heat: document.getElementById('heatLevel').value,
                competition: document.getElementById('competitionLevel').value
            },
            savedAt: new Date().toISOString()
        };
        
        localStorage.setItem('listingData', JSON.stringify(listingData));
        alert('Listing保存成功！');
    });
    
    loadSavedData();
}

function loadSavedData() {
    const savedData = localStorage.getItem('listingData');
    if (!savedData) return;
    
    try {
        const data = JSON.parse(savedData);
        
        if (data.title) document.getElementById('productTitle').value = data.title;
        if (data.bullets) {
            data.bullets.forEach((bullet, index) => {
                const textareas = document.querySelectorAll('.bullet-textarea');
                if (textareas[index]) textareas[index].value = bullet;
            });
        }
        if (data.description) document.getElementById('productDescription').value = data.description;
        if (data.searchTerms) document.getElementById('searchTerms').value = data.searchTerms;
        
        if (data.keywords) {
            const textareas = document.querySelectorAll('.category-textarea');
            if (textareas[0] && data.keywords.core) textareas[0].value = data.keywords.core;
            if (textareas[1] && data.keywords.longTail) textareas[1].value = data.keywords.longTail;
            if (textareas[2] && data.keywords.attribute) textareas[2].value = data.keywords.attribute;
            if (textareas[3] && data.keywords.competitor) textareas[3].value = data.keywords.competitor;
        }
        
        if (data.grading) {
            if (data.grading.heat) document.getElementById('heatLevel').value = data.grading.heat;
            if (data.grading.competition) document.getElementById('competitionLevel').value = data.grading.competition;
        }
        
        updateCharCounts();
    } catch (e) {
        console.error('加载保存数据失败:', e);
    }
}

function updateCharCounts() {
    const titleInput = document.getElementById('productTitle');
    titleInput.nextElementSibling.textContent = titleInput.value.length + '/200';
    
    const searchInput = document.getElementById('searchTerms');
    searchInput.nextElementSibling.textContent = searchInput.value.length + '/249';
}

function initInsertButtons() {
    const insertBtns = document.querySelectorAll('.insert-btn');
    
    insertBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.dataset.target;
            const keywords = getSelectedKeywords();
            
            if (!keywords) {
                alert('请先勾选并填写关键词');
                return;
            }
            
            insertKeywordsToTarget(target, keywords);
        });
    });
}

function getSelectedKeywords() {
    const checkboxes = document.querySelectorAll('.category-checkbox:checked');
    let keywords = [];
    
    checkboxes.forEach(checkbox => {
        const categoryTextarea = checkbox.closest('.category-item').querySelector('.category-textarea');
        const text = categoryTextarea.value.trim();
        if (text) {
            keywords = keywords.concat(text.split('\n').filter(k => k.trim()));
        }
    });
    
    return keywords.length > 0 ? keywords.join(' ') : null;
}

function insertKeywordsToTarget(target, keywords) {
    switch(target) {
        case 'productTitle':
            const titleInput = document.getElementById('productTitle');
            titleInput.value = (titleInput.value.trim() + ' ' + keywords).trim();
            updateCharCounts();
            break;
            
        case 'bulletPoints':
            const bullets = document.querySelectorAll('.bullet-textarea');
            const emptyBullet = Array.from(bullets).find(b => !b.value.trim());
            if (emptyBullet) {
                emptyBullet.value = keywords;
            } else {
                bullets[bullets.length - 1].value += '\n' + keywords;
            }
            break;
            
        case 'searchTerms':
            const searchInput = document.getElementById('searchTerms');
            searchInput.value = (searchInput.value.trim() + ' ' + keywords).trim();
            updateCharCounts();
            break;
    }
}

function initKeywordGrading() {
    const heatSelect = document.getElementById('heatLevel');
    const competitionSelect = document.getElementById('competitionLevel');
    
    function updateRecommendations() {
        const heat = heatSelect.value;
        const competition = competitionSelect.value;
        
        let recommendations = [];
        
        if (heat === 'high') {
            recommendations.push('- 优先使用高热度关键词');
            recommendations.push('- 在标题和卖点中重点布局');
        } else if (heat === 'medium') {
            recommendations.push('- 作为辅助关键词使用');
            recommendations.push('- 平衡热度与竞争');
        } else {
            recommendations.push('- 可作为补充关键词');
            recommendations.push('- 用于长尾流量获取');
        }
        
        if (competition === 'low') {
            recommendations.push('- 竞争较小，容易获得排名');
            recommendations.push('- 建议加大投放力度');
        } else if (competition === 'medium') {
            recommendations.push('- 需要一定优化才能获得排名');
            recommendations.push('- 注重内容质量和用户体验');
        } else {
            recommendations.push('- 竞争激烈，难度较大');
            recommendations.push('- 建议配合广告投放');
        }
        
        document.getElementById('recommendedKeywords').innerHTML = recommendations.join('<br>');
    }
    
    heatSelect.addEventListener('change', updateRecommendations);
    competitionSelect.addEventListener('change', updateRecommendations);
    
    updateRecommendations();
}