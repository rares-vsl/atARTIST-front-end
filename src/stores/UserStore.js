import { defineStore } from 'pinia'

import axios from '@/axiosConfig.js'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: {},
        token: '',
    }),

    getters: {
        getUser(state) {
            return state.user
        },
        getToken(state) {
            return state.token
        }
    },
    actions: {
        async signUp(user) {
            const response = await axios.post('auth/register', user)

            this.token = response.data.data.token.value
            this.user = response.data.data.user

            localStorage.setItem('user_token', this.token)
            localStorage.setItem('remember_me', true)
            localStorage.setItem('session_expires_at', response.data.data.token.expires_at)
        },
        async signIn(user) {
            const response = await axios.post('auth/login', user)

            this.token = response.data.data.token.value
            this.user = response.data.data.user

            localStorage.setItem('user_token', this.token)
            localStorage.setItem('remember_me', user.remember_me)
            localStorage.setItem('session_expires_at', response.data.data.token.expires_at)
        },
        setToken() {
            this.token = localStorage.getItem('user_token')

            if (this.token === null)
                return ''

            let remember_me = localStorage.getItem('remember_me')

            if (remember_me)
                return this.token

            let expires_at = localStorage.getItem('session_expires_at')

            if ((Date.now() > expires_at)) {
                this.removeToken()
            }

            return this.token
        },
        removeToken(){
            localStorage.removeItem('user_token')
            localStorage.removeItem('remember_me')
            localStorage.removeItem('session_expires_at')
        },
        async signOut() {
            const response = await axios.delete('auth/logout')

            this.removeToken()
        },
        async verifyEmail(id, hash, expires, signature) {
            const response = await axios.get('auth/email/verify/' + id + '/' + hash, {
                params: {
                    expires: expires,
                    signature: signature
                }
            })
            
            this.user.verified_email = true
        },
        async fetchUser() {
            const response = await axios.get('auth/user')

            this.user = response.data.data.user
        },
        async updateAccount(user) {
            if (this.user.username != user.username)
                await this.updateUsername(user.username)
            if (this.user.email != user.email)
                await this.updateEmail(user.email)

            return 'Account updated successfully!'
        },
        async updateUsername(username) {
            const url = 'v1/users/' + this.user.username + '/username'
            const response = await axios.patch(url, { username: username })
            this.user.username = response.data.data.user.username
        },
        async updateEmail(email) {
            const url = 'v1/users/' + this.user.username + '/email'
            const response = await axios.patch(url, { email: email })
            this.user.email = response.data.data.user.email
        },
        async updateName(name) {
            const url = 'v1/users/' + this.user.username
            const response = await axios.patch(url, { name: name })
            this.user.name = response.data.data.user.name
            return response.data.data.message
        },
        async restoreAccount(){
            const url = 'v1/users/' + this.user.username + '/delete'
            const response = await axios.patch(url)

            this.user.status = true
        }
    }
})  