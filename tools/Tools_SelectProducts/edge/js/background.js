/**
 * 后台服务Worker
 * 处理快捷键命令和窗口管理
 */

// 存储小窗窗口ID
let miniWindowId = null;

// 小窗配置
const MINI_WINDOW_WIDTH = 800;
const MINI_WINDOW_HEIGHT = 300; // 增大高度，确保内容显示完整

/**
 * 监听快捷键命令
 */
chrome.commands.onCommand.addListener((command) => {
    console.log('快捷键命令:', command);
    
    switch (command) {
        case 'open-popup':
            chrome.action.openPopup();
            break;
            
        case 'open-mini-popup':
            openMiniWindow();
            break;
    }
});

/**
 * 监听来自popup的消息
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('收到消息:', message);
    
    switch (message.action) {
        case 'toggleMiniWindow':
            openMiniWindow();
            break;
    }
});

/**
 * 监听窗口关闭事件
 */
chrome.windows.onRemoved.addListener((windowId) => {
    if (windowId === miniWindowId) {
        miniWindowId = null;
    }
});

/**
 * 打开小窗（统一入口）
 */
async function openMiniWindow() {
    try {
        // 检查小窗是否已存在
        if (miniWindowId) {
            try {
                const window = await chrome.windows.get(miniWindowId);
                if (window) {
                    // 小窗存在，关闭它
                    await chrome.windows.remove(miniWindowId);
                    miniWindowId = null;
                    return;
                }
            } catch (error) {
                miniWindowId = null;
            }
        }
        
        // 计算右上角位置
        const position = await calculateTopRightPosition();
        
        console.log('创建小窗位置:', position);
        
        // 创建小窗 - 使用popup类型创建独立窗口（无浏览器标签页和地址栏）
        const result = await chrome.windows.create({
            url: 'html/popup.html',
            type: 'popup',
            width: MINI_WINDOW_WIDTH,
            height: MINI_WINDOW_HEIGHT,
            left: position.left,
            top: position.top,
            focused: true
        });
        
        console.log('小窗创建成功，窗口ID:', result.id);
        miniWindowId = result.id;
        
    } catch (error) {
        console.error('创建小窗失败:', error);
    }
}

/**
 * 计算右上角位置
 */
async function calculateTopRightPosition() {
    // 获取当前活动窗口
    const currentWindow = await chrome.windows.getCurrent();
    
    // 使用当前窗口的位置计算右上角
    const left = (currentWindow.left || 0) + (currentWindow.width || 1920) - MINI_WINDOW_WIDTH - 20;
    const top = (currentWindow.top || 0) + 60; // 稍微向下偏移，避开浏览器标题栏
    
    return { left: Math.max(0, left), top: Math.max(0, top) };
}