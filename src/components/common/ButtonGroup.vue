<template>
    <div class="button-group">
        <slot />
    </div>
</template>

<script setup lang="ts">
// ButtonGroup component - provides a container for grouped buttons
// Usage: Wrap buttons with this component to get grouped styling
</script>

<style scoped>
.button-group {
    display: inline-flex;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    overflow: hidden;
}

:deep(.group-btn) {
    padding: 6px 12px;
    background: var(--bg-primary);
    border: none;
    border-right: 1px solid var(--border-color);
    border-radius: 0;
    color: var(--text-secondary);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    min-width: 60px;
    text-align: center;
}

:deep(.group-btn:first-child) {
    border-top-left-radius: var(--radius-sm);
    border-bottom-left-radius: var(--radius-sm);
}

:deep(.group-btn:last-child) {
    border-top-right-radius: var(--radius-sm);
    border-bottom-right-radius: var(--radius-sm);
    border-right: none;
}

:deep(.group-btn:hover) {
    background: var(--bg-secondary);
    color: var(--text-primary);
}

:deep(.group-btn:active) {
    background: var(--bg-tertiary);
}
</style>