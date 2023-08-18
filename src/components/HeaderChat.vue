<script setup lang="ts">
import { ref } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useRouter } from 'vue-router'
import { auth } from '../firebase/firebase'
import { signOut } from 'firebase/auth'
import Cookies from 'universal-cookie'
const cookie = new Cookies()
const chatStore = useChatStore()
const router = useRouter()
const isToggleMenu = ref(false)
const signOutUser = async () => {
  await signOut(auth)
  cookie.remove('auth-token')
  chatStore.roomNo = ''
  router.push('/')
}
const toggleMenu = () => {
  isToggleMenu.value = !isToggleMenu.value
}
</script>

<template>
  <div class="header-chat-wrapper">
    <div class="title">Chat App</div>
    <div class="user">
      <img
        class="avatar"
        @click="toggleMenu"
        src="https://demos.wrappixel.com/premium-admin-templates/vuejs/xtreme-vuejs/main/img/1.5954212d.jpg"
      />
      <Transition>
        <div v-if="isToggleMenu" class="toggle-wrapper">
          <div class="info-user">
            <img
              src="https://demos.wrappixel.com/premium-admin-templates/vuejs/xtreme-vuejs/main/img/1.5954212d.jpg"
            />
            <div class="info-wrapper">
              <div class="name">
                {{ auth.currentUser?.displayName }}
              </div>
              <div class="email">
                {{ auth.currentUser?.email }}
              </div>
            </div>
          </div>
          <div class="list-option">
            <div class="item-option" @click="signOutUser">
              <vs-icon icon="logout" size="small"></vs-icon>
              Sign out
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.25s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.header-chat-wrapper {
  width: 100%;
  padding: 10px 30px;
  position: fixed;
  top: 0;
  z-index: 50;
  background-color: #2962ff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .title {
    color: #fff;
    font-size: 30px;
    font-weight: bold;
  }
  .user {
    position: relative;
    .toggle-wrapper {
      box-shadow: 1px 0 20px rgba(0, 0, 0, 0.08);
      width: 300px;
      background-color: #fff;
      border-radius: 10px;
      position: absolute;
      right: 0;
      top: 60px;
      .info-user {
        padding: 10px;
        background-color: #2962ff;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        img {
          border-radius: 50%;
          width: 60px;
          margin-right: 20px;
        }
        .info-wrapper {
        }
      }
      .list-option {
        .item-option {
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 10px 20px;
          font-size: 16px;
          i {
            margin-right: 10px;
          }
          &:hover {
            background-color: #f8f9fa;
          }
        }
      }
    }
    .avatar {
      cursor: pointer;
      border-radius: 50%;
      width: 40px;
    }
  }
}
</style>
