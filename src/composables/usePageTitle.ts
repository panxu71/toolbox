// 页面标题管理 Composable
import { onMounted, onUnmounted } from 'vue'
import cardsConfig from '../config/cards.json'

const originalTitle = document.title

// 根据卡片ID获取标题
function getCardTitle(cardId: string): string {
    // 遍历所有分类查找对应的卡片
    for (const categoryKey in cardsConfig.cards) {
        const cards = cardsConfig.cards[categoryKey as keyof typeof cardsConfig.cards]

        const card = cards.find((card: any) => card.id === cardId)

        if (card) {
            return card.title
        }
    }

    // 如果找不到，返回卡片ID
    return cardId
}

export function usePageTitle(cardId: string) {
    onMounted(() => {
        const cardTitle = getCardTitle(cardId)
        document.title = `${cardTitle} - Toolbox 工具箱`
    })

    onUnmounted(() => {
        document.title = originalTitle
    })
}