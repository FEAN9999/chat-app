import { defineStore } from 'pinia'

export const useCounterStore = defineStore('authen', {
  state: () => ({ username: '', password: '', isLogin: false, token: '' }),
  actions: {
    loginAction(params: any) {
      this.username = params.username
      this.password = params.password
      this.isLogin = true
    },
    logoutAction() {
      this.isLogin = false
    }
  }
})
