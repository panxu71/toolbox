<template>
  <div class="hash-generator">
    <h3>Hash Generator</h3>
    <div class="input-section">
      <textarea
        v-model="inputText"
        placeholder="Enter text to hash..."
        rows="4"
        class="input-textarea"
      ></textarea>
    </div>
    
    <div class="hash-results">
      <div class="hash-item" v-for="hash in hashes" :key="hash.type">
        <label>{{ hash.type }}:</label>
        <div class="hash-output">
          <input
            :value="hash.value"
            readonly
            class="hash-input"
          />
          <button @click="copyToClipboard(hash.value)" class="copy-btn">
            Copy
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CryptoJS from 'crypto-js'

const inputText = ref('')

const hashes = computed(() => {
  if (!inputText.value) return []
  
  return [
    { type: 'MD5', value: CryptoJS.MD5(inputText.value).toString() },
    { type: 'SHA1', value: CryptoJS.SHA1(inputText.value).toString() },
    { type: 'SHA256', value: CryptoJS.SHA256(inputText.value).toString() },
    { type: 'SHA512', value: CryptoJS.SHA512(inputText.value).toString() }
  ]
})

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}
</script>

<style scoped>
.hash-generator {
  padding: 20px;
}

.input-section {
  margin-bottom: 20px;
}

.input-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: monospace;
  resize: vertical;
}

.hash-results {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.hash-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.hash-item label {
  font-weight: bold;
  color: #333;
}

.hash-output {
  display: flex;
  gap: 10px;
}

.hash-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  background-color: #f9f9f9;
}

.copy-btn {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.copy-btn:hover {
  background-color: #0056b3;
}
</style>