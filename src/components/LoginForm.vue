<script setup lang="ts">
import { ref } from 'vue'
import { useCounterStore } from '@/stores/authen'
import { useRouter } from 'vue-router'
import { auth, googleProvider } from '../firebase/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword
} from 'firebase/auth'
import Cookies from 'universal-cookie'
const cookies = new Cookies()
const authen = useCounterStore()
const router = useRouter()
const inputUserName = ref('')
const inputPassword = ref('')
const isLoginForm = ref(true)
const isTerm = ref(false)

const login = async (e: any) => {
  e.preventDefault()
  if (inputUserName.value && inputPassword.value) {
    await signInWithEmailAndPassword(auth, inputUserName.value, inputPassword.value)
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
      })
    // authen.loginAction({ username: inputUserName.value, password: inputPassword.value })
    // router.push('/chat')
  }
}
const registerUser = async () => {
  if (inputUserName.value && inputPassword.value) {
    await createUserWithEmailAndPassword(auth, inputUserName.value, inputPassword.value)
      .then((response) => {
        cookies.set('auth-token', response.user.refreshToken)
        router.push('/chat')
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
const switchForm = (params: number) => {
  isLoginForm.value = params === 1 ? false : true
  clearInput()
}
const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider)
  cookies.set('auth-token', result.user.refreshToken)
  router.push('/chat')
}
const clearInput = () => {
  inputUserName.value = ''
  inputPassword.value = ''
}
</script>

<template>
  <vs-row vs-justify="center">
    <vs-col type="flex" vs-justify="center" vs-align="center" vs-w="auto">
      <vs-card>
        <template v-slot>
          <template v-if="isLoginForm">
            <div class="content-login">
              <div class="header-login">
                <h2>Sign in</h2>
                <p>Don't have an account ? <span @click="switchForm(1)">Sign Up</span></p>
              </div>
              <div class="body-login">
                <vs-input
                  width="300"
                  class="email"
                  :success="false"
                  success-text="The mail is valid"
                  placeholder="Enter Email"
                  v-model="inputUserName"
                >
                </vs-input>
                <vs-input
                  class="password"
                  :danger="false"
                  danger-text="The password does not meet the standards"
                  placeholder="Enter Password"
                  v-model="inputPassword"
                />
              </div>
              <div class="footer-login">
                <vs-checkbox v-model="isTerm">I accept the terms and use</vs-checkbox>
                <vs-button class="custom-button" color="primary" type="filled" @click="login"
                  >Sign In</vs-button
                >
                <div class="social">
                  <div class="content" @click="signInWithGoogle">
                    <vs-icon icon="g_translate" size="small"></vs-icon>
                    <span>Sign in with Google</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="content-login">
              <div class="header-login">
                <h2>Sign Up</h2>
                <p>Already have an account ? <span @click="switchForm(2)">Sign In</span></p>
              </div>
              <div class="body-login">
                <vs-input
                  width="300"
                  class="email"
                  :success="false"
                  success-text="The mail is valid"
                  placeholder="Enter Email"
                  v-model="inputUserName"
                >
                </vs-input>
                <vs-input
                  class="password"
                  :danger="false"
                  danger-text="The password does not meet the standards"
                  placeholder="Enter Password"
                  v-model="inputPassword"
                />
              </div>
              <div class="footer-login">
                <vs-checkbox v-model="isTerm">I accept the terms and use</vs-checkbox>
                <vs-button class="custom-button" color="primary" type="filled" @click="registerUser"
                  >Register</vs-button
                >
                <div class="social">
                  <div class="content" @click="signInWithGoogle">
                    <vs-icon icon="g_translate" size="small"></vs-icon>
                    <span>Sign in with Google</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>
      </vs-card>
    </vs-col>
  </vs-row>
  <!-- <div v-if="isLoginForm">
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div>
        <h3>Email</h3>
        <input type="email" v-model="inputUserName" />
      </div>
      <div>
        <h3>Password</h3>
        <input type="password" autocomplete="on" v-model="inputPassword" />
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
  <div v-else>
    <h1>Sign Up</h1>
    <form @submit.prevent="signIn">
      <div>
        <h3>Email</h3>
        <input type="email" v-model="inputUserName" />
      </div>
      <div>
        <h3>Password</h3>
        <input type="password" autocomplete="on" v-model="inputPassword" />
      </div>
      <button type="submit">Sign In</button>
    </form>
  </div>
  <template v-if="isLoginForm === true">
    <div @click="switchForm(1)">Sign Up</div>
    <div @click="signInWithGoogle">Sign In With Google</div>
  </template>
  <template v-else>
    <div @click="switchForm(2)">Already have account ?</div>
  </template> -->
</template>

<style lang="scss" scoped>
:deep.con-vs-card {
  .vs-card--content {
    height: 100%;
    padding: 24px;
    .content-login {
      .header-login {
        h2 {
          margin-bottom: 8px;
        }
        p {
          font-weight: 500;
          font-size: 10px;
          span {
            color: #2962ff;
            cursor: pointer;
            &:hover {
              color: rgb(0, 58, 220);
            }
          }
        }
      }
      .body-login {
        padding: 20px 0;
        .vs-con-input-label {
          width: 250px;
        }
        .email {
          margin-bottom: 20px;
        }
      }
      .footer-login {
        .vs-checkbox-primary {
          margin-bottom: 20px;
          justify-content: start;
          .vs-checkbox {
            width: 16px;
            height: 16px;
          }
          .con-slot-label {
            font-size: 10px;
          }
          .vs-checkbox--check {
            i {
              font-size: 12px;
            }
          }
        }
        .custom-button {
          width: 100%;
          margin-bottom: 20px;
        }
        .social {
          display: flex;
          justify-content: center;
          align-items: center;
          .content {
            cursor: pointer;
            padding: 4px 16px;
            border: 1px solid #ccc;
            border-radius: 15px;
            font-size: 12px;
            display: flex;
            justify-content: center;
            align-items: center;
            i {
              width: 15px;
              height: 15px;
              font-size: 15px;
              margin-right: 5px;
            }
          }
        }
      }
    }
  }
}
</style>
