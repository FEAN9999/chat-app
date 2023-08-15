<script setup lang="ts">
import { useCounterStore } from '@/stores/authen'
import { useChatStore } from '@/stores/chat'
import { useRouter } from 'vue-router'
import { auth } from '../firebase/firebase'
import { signOut } from 'firebase/auth'
import Cookies from 'universal-cookie'
const cookie = new Cookies()
const authen = useCounterStore()
const chatStore = useChatStore()
const router = useRouter()
const logout = async () => {
  await signOut(auth)
  authen.logoutAction()
  cookie.remove('auth-token')
  chatStore.roomNo = ''
  router.push('/')
}
</script>

<template>
  <div class="header-chat-wrapper">
    {{ authen.username }}
    <button @click="logout">Logout</button>
  </div>
</template>

<style scoped></style>
