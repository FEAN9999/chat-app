<script setup lang="ts">
import ChatBox from '@/components/ChatBox.vue'
import HeaderChat from '@/components/HeaderChat.vue'
</script>

<template>
  <div class="chat-wrapper">
    <HeaderChat />
    <ChatBox />
  </div>
</template>

<style lang="scss" scoped>
.chat-wrapper {
  background-color: #eef5f9;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
