<script setup lang="ts">
import { ref } from 'vue'
import { useChatStore } from '@/stores/chat'

const roomNo = ref('')
const chatStore = useChatStore()
const enterRoom = () => {
  chatStore.roomNo = roomNo.value
}
</script>

<template>
  <div>ROOM</div>
  <div>
    <input type="number" v-model="roomNo" />
    <button @click="enterRoom">Confirm</button>
  </div>
</template>

<style scoped></style>
../firebase
