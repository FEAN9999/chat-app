<script setup lang="ts">
import { onMounted, ref, inject } from 'vue'
import { db, auth } from '../firebase/firebase'
import { v4 as uuid } from 'uuid'
import {
  serverTimestamp,
  Timestamp,
  onSnapshot,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  setDoc,
  query,
  collection,
  where,
  getDocs
} from 'firebase/firestore'
const vs = inject('$vs')
const searchData = ref('')
const selectedUser = ref({}) as any
const valueInputMessage = ref('')
const listMessages = ref([]) as any
const listUsers = ref([]) as any
const sendMessage = async () => {
  if (valueInputMessage.value === '') {
    return
  }
  const combinedId = await getCombineId(selectedUser.value)
  await updateDoc(doc(db, 'chats', combinedId), {
    messages: arrayUnion({
      id: uuid(),
      text: valueInputMessage.value,
      senderId: auth.currentUser?.uid,
      date: Timestamp.now()
    })
  })
  await updateDoc(doc(db, 'userChats', auth.currentUser!.uid), {
    [combinedId + '.lastMessage']: {
      text: valueInputMessage.value
    },
    [combinedId + '.date']: serverTimestamp()
  })

  await updateDoc(doc(db, 'userChats', selectedUser.value.userInfo.uid), {
    [combinedId + '.lastMessage']: {
      text: valueInputMessage.value
    },
    [combinedId + '.date']: serverTimestamp()
  })
  valueInputMessage.value = ''
}
const handleSelectUser = async (user: any) => {
  vs.loading({
    container: '#content',
    scale: 0.6
  })
  const combinedId = await getCombineId(user)
  selectedUser.value = user
  const res = await getDoc(doc(db, 'chats', combinedId))
  if (!res.exists()) {
    await setDoc(doc(db, 'chats', combinedId), { messages: [] })
    await updateDoc(doc(db, 'userChats', auth.currentUser!.uid), {
      [combinedId + '.userInfo']: {
        uid: user.userInfo.uid,
        displayName: user.userInfo.displayName
      },
      [combinedId + '.date']: serverTimestamp()
    })

    await updateDoc(doc(db, 'userChats', user.uid), {
      [combinedId + '.userInfo']: {
        uid: auth.currentUser!.uid,
        displayName: auth.currentUser!.displayName
      },
      [combinedId + '.date']: serverTimestamp()
    })
  }
  const unSub = onSnapshot(doc(db, 'chats', combinedId), (doc) => {
    listMessages.value = doc.data()!.messages
  })
  vs.loading.close('#content > .con-vs-loading')
  return () => {
    unSub()
  }
}

const onChangeSearch = async (e: any) => {
  const name = e.target.value
  const queryName = query(collection(db, 'users'), where('displayName', '==', name))
  const querySnapshot = await getDocs(queryName)
  querySnapshot.forEach((doc) => {
    console.log(doc.id, ' => ', doc.data())
  })
}
const getCombineId = (user: any) => {
  const combinedId = auth.currentUser
    ? auth.currentUser?.uid > user.userInfo.uid
      ? auth.currentUser?.uid + user.userInfo.uid
      : user.userInfo.uid + auth.currentUser?.uid
    : ''
  return combinedId
}

onMounted(async () => {
  auth.onAuthStateChanged(function (user) {
    if (user) {
      const unsub = onSnapshot(doc(db, 'userChats', user.uid), (doc) => {
        listUsers.value = doc.data()
      })
      return () => {
        unsub()
      }
    }
  })
})
</script>

<template>
  <div class="card">
    <div class="contact">
      <div class="search-contact">
        <vs-input placeholder="Search" size="large" v-model="searchData" @keyup="onChangeSearch" />
      </div>
      <div class="list-contact">
        <div
          class="item-contact"
          v-for="user in listUsers"
          :key="user.uid"
          @click="handleSelectUser(user)"
        >
          <div class="avatar">
            <img
              src="https://demos.wrappixel.com/premium-admin-templates/vuejs/xtreme-vuejs/main/img/1.5954212d.jpg"
            />
          </div>
          <div class="name">
            <div class="name-user">{{ user.userInfo.displayName }}</div>
            <div class="message">{{ user.lastMessage.text }}</div>
          </div>
        </div>
      </div>
    </div>
    <div id="content" class="content vs-con-loading__container">
      <template v-if="selectedUser.userInfo?.uid">
        <div class="name-content">
          <img
            src="https://demos.wrappixel.com/premium-admin-templates/vuejs/xtreme-vuejs/main/img/1.5954212d.jpg"
          />
          <div>{{ selectedUser.userInfo.displayName }}</div>
        </div>
        <div class="list-messsage">
          <div
            :class="['item-message', message.senderId == auth.currentUser?.uid ? 'right' : 'left']"
            v-for="message in listMessages"
            :key="message.id"
          >
            <div class="content-message">
              <img
                src="https://demos.wrappixel.com/premium-admin-templates/vuejs/xtreme-vuejs/main/img/1.5954212d.jpg"
              />
              <div class="text">{{ message.text }}</div>
            </div>
          </div>
        </div>
        <div class="type-message">
          <vs-input
            placeholder="Type and hit Enter"
            size="large"
            v-model="valueInputMessage"
            @keyup.enter="sendMessage"
          />
          <vs-button color="primary" type="filled" size="large" @click="sendMessage"
            >Send</vs-button
          >
        </div></template
      >
      <template v-else>
        <div class="empty-data">
          <h2>Start conversation</h2>
          <h4>Click on the left sidebar contact and start</h4>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  width: 90%;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  position: relative;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 0 solid transparent;
  border-radius: 4px;
  .contact {
    width: 300px;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    .search-contact {
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      .vs-con-input-label {
        width: 100%;
      }
    }
    .list-contact {
      height: 100%;
      overflow: auto;
      .item-contact {
        cursor: pointer;
        padding: 15px 10px;
        display: flex;
        .avatar {
          margin-right: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            border-radius: 50%;
            width: 40px;
            margin-right: 5px;
          }
        }
        .name {
          width: 230px;
          .name-user {
            font-size: 16px;
            font-weight: bold;
          }
          .message {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 14px;
          }
        }
      }
    }
  }
  .content {
    width: 100%;
    .empty-data {
      min-height: calc(100vh - 250px);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-size: 26px;
      h4 {
        font-weight: 500;
      }
    }
    .name-content {
      height: 100px;
      font-weight: bold;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: start;
      padding: 20px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      img {
        border-radius: 50%;
        width: 50px;
        margin-right: 20px;
      }
    }
    .list-messsage {
      min-height: calc(100vh - 450px);
      padding: 10px;
      .item-message {
        display: flex;
        align-items: center;
        font-size: 10px;
        padding: 5px;
        &.left {
          justify-content: start;
          .content-message {
            .text {
              margin-left: 10px;
              background-color: #f8f9fa;
            }
          }
        }
        &.right {
          justify-content: flex-end;
          .content-message {
            flex-direction: row-reverse;
            .text {
              margin-right: 10px;
              background-color: #2962ff;
              color: #fff;
            }
          }
        }
        .content-message {
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 40px;
            border-radius: 50%;
          }
          .text {
            font-size: 16px;
            padding: 10px;
            border-radius: 5px;
          }
        }
      }
    }
    .type-message {
      display: flex;
      align-items: center;
      justify-content: center;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      padding: 20px;
      .vs-con-input-label {
        width: 100%;
        margin-right: 10px;
      }
    }
  }
}
</style>
