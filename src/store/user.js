import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    isLoggedIn: false,
    token: localStorage.getItem('token') || ''
  }),
  actions: {
    login(username, token) {
      this.username = username
      this.isLoggedIn = true
      this.token = token
      localStorage.setItem('token', token)
    },
    logout() {
      this.username = ''
      this.isLoggedIn = false
      this.token = ''
      localStorage.removeItem('token')
    }
  }
})
