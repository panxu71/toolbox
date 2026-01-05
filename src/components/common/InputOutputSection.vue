<template>
    <div class="input-output-section">
        <div class="section-header">
            <h3 class="section-title">{{ title }}</h3>
            <div class="section-info" v-if="info">
                <span class="info-text">{{ info }}</span>
            </div>
            <div class="section-actions">
                <slot name="actions"></slot>
            </div>
        </div>

        <div class="section-content">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    title: string
    info?: string
}>()
</script>

<style scoped>
.input-output-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    overflow: hidden;
    margin-bottom: 1.5rem;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    background: var(--bg-color);
    border-bottom: 1px solid var(--border-color);
}

.section-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-color);
    margin: 0;
}

.section-info {
    flex: 1;
    margin-left: 1rem;
}

.info-text {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.section-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.section-content {
    padding: 1.5rem;
}
</style>