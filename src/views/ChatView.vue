<script setup lang="ts">
import ChatBox from '@/components/ChatBox.vue'
import HeaderChat from '@/components/HeaderChat.vue'
import RoomChat from '@/components/RoomChat.vue'
import { useChatStore } from '@/stores/chat'
const chatStore = useChatStore()
</script>

<template>
  <HeaderChat />
  <ChatBox v-if="chatStore.roomNo" />
  <RoomChat v-else />
</template>
