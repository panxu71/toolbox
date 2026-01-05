<template>
    <button class="action-btn" :disabled="disabled" :title="tooltip" @click="$emit('click')">
        ✖️
    </button>
</template>

<script setup lang="ts">
defineProps<{
    icon?: string
    tooltip?: string
    disabled?: boolean
}>()

defineEmits<{
    click: []
}>()
</script>

<style scoped>
.action-btn {
    width: 36px;
    height: 36px;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    color: #64748b;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.action-btn:hover:not(:disabled) {
    background: #e2e8f0;
    color: #1e293b;
}

.action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>