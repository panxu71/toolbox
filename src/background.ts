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
        default:
            sendResponse({ error: 'Unknown message type' });
    }

    return true; // Keep message channel open for async response
});