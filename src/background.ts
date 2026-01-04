// Chrome extension background script
chrome.runtime.onInstalled.addListener(() => {
    console.log('Toolbox extension installed');
});

// Handle extension icon click - open in new tab
chrome.action.onClicked.addListener((_tab) => {
    chrome.tabs.create({
        url: chrome.runtime.getURL('index.html')
    });
});

// Function to fetch IP from ip.me
async function fetchIpFromIpMe(): Promise<{ ip: string; location: string } | { error: string }> {
    try {
        const response = await fetch('https://ip.me');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const html = await response.text();
        // 从HTML中提取IP地址
        const ipMatch = html.match(/<input[^>]*name="ip"[^>]*value="([^"]*)"[^>]*>/);

        if (ipMatch && ipMatch[1]) {
            return {
                ip: ipMatch[1],
                location: '来自IP.me页面'
            };
        } else {
            throw new Error('无法从页面提取IP地址');
        }
    } catch (error) {
        console.error('获取IP.me数据失败:', error);
        return {
            error: error instanceof Error ? error.message : '网络错误'
        };
    }
}

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
    console.log('Message received:', request);

    // Handle different message types
    switch (request.type) {
        case 'GET_TAB_INFO':
            if (sender.tab) {
                sendResponse({
                    tabId: sender.tab.id,
                    url: sender.tab.url,
                    title: sender.tab.title
                });
            }
            break;
        case 'FETCH_IP_ME':
            // 异步获取IP.me数据
            fetchIpFromIpMe().then(result => {
                sendResponse(result);
            }).catch(error => {
                sendResponse({ error: error.message });
            });
            return true; // 保持消息通道开放以支持异步响应
        default:
            sendResponse({ error: 'Unknown message type' });
    }

    return true; // Keep message channel open for async response
});