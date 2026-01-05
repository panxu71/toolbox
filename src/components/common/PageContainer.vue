<template>
    <div class="page-container">
        <PageHeader :title="title" @back="$emit('back')">
            <template #actions>
                <slot name="header-actions"></slot>
            </template>
        </PageHeader>

        <div class="page-content">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import PageHeader from './PageHeader.vue'

defineProps<{
    title: string
}>()

defineEmits<{
    back: []
}>()
</script>

<style scoped>
.page-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--bg-color);
}

.page-content {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
}
</style>