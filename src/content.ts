// Content script - runs in the context of web pages
console.log('Toolbox content script loaded')

// Example: Listen for messages from popup or background
chrome.runtime.onMessage.addListener((request: any, _sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
    console.log('Content script received message:', request)

    switch (request.type) {
        case 'GET_PAGE_INFO':
            sendResponse({
                title: document.title,
                url: window.location.href,
                domain: window.location.hostname
            })
            break
        case 'HIGHLIGHT_TEXT':
            // Example functionality: highlight text on page
            const selection = window.getSelection()
            if (selection && selection.toString()) {
                const range = selection.getRangeAt(0)
                const span = document.createElement('span')
                span.style.backgroundColor = 'yellow'
                span.style.padding = '2px'
                range.surroundContents(span)
            }
            sendResponse({ success: true })
            break
        case 'EXTRACT_LINKS':
            // 提取所有链接
            const links = Array.from(document.querySelectorAll('a')).map(a => ({
                text: a.textContent?.trim(),
                href: a.href,
                title: a.title
            }))
            sendResponse({ links, count: links.length })
            break
        case 'EXTRACT_IMAGES':
            // 提取所有图片
            const images = Array.from(document.querySelectorAll('img')).map(img => ({
                src: img.src,
                alt: img.alt,
                width: img.width,
                height: img.height
            }))
            sendResponse({ images, count: images.length })
            break
        case 'COUNT_WORDS':
            // 统计字数
            const text = document.body.innerText
            const wordCount = text.length
            const words = text.split(/\s+/).filter(w => w.length > 0)
            sendResponse({
                wordCount,
                words: words.length,
                characters: text.length
            })
            break
        case 'EXTRACT_TEXT':
            // 提取纯文本
            const pageText = document.body.innerText
            sendResponse({
                text: pageText,
                length: pageText.length
            })
            break
        default:
            sendResponse({ error: 'Unknown message type' })
    }

    return true
})