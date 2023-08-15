<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useChatStore } from '@/stores/chat'
import { db, auth } from '../firebase/firebase'
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy
} from 'firebase/firestore'

const contentMessage = reactive({ inputMess: '', listMess: [] as any })
const messagesRef = collection(db, 'messages')
const chatStore = useChatStore()
const sendMessage = async () => {
  if (contentMessage.inputMess === '') {
    return
  }
  const message = {
    name: auth.currentUser?.displayName,
    email: auth.currentUser?.email,
    text: contentMessage.inputMess,
    createdAt: serverTimestamp(),
    roomNo: chatStore.roomNo
  }
  await addDoc(messagesRef, message)
  contentMessage.inputMess = ''
}

onMounted(async () => {
  const queryMessages = query(
    messagesRef,
    where('roomNo', '==', chatStore.roomNo),
    orderBy('createdAt')
  )
  const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
    let messages = [] as any[]
    snapshot.forEach((doc) => {
      messages.push({ ...doc.data(), id: doc.id })
    })
    contentMessage.listMess = messages
  })
  return () => unsubscribe()
})
</script>

<template>
  <div>Chatting</div>
  <div>Welcom to Room : {{ chatStore.roomNo }}</div>
  <div>
    <div v-for="item in contentMessage.listMess" :key="item">{{ item.name }}, {{ item.text }}</div>
  </div>
  <div>
    <input type="textarea" v-model="contentMessage.inputMess" />
    <button @click="sendMessage">Send</button>
  </div>
</template>

<style scoped></style>
../firebase
