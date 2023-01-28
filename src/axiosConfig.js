import axios from 'axios'

import { useUserStore } from './stores/UserStore'

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000/'
})

instance.interceptors.request.use(function (config) {
  const store = useUserStore()

  if (config.headers.Authorization == null) {
    let token = store.getToken

    if (token === null)
      token = store.setToken()

    config.headers.Authorization = 'Bearer ' + token
  }

  return config
})

instance.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    const store = useUserStore()

    var allowendUnauthorized =
      ['/auth/sign-in', '/settings/delete-account', '/settings/password']
    if (error.response.status === 401 &&
      !allowendUnauthorized.includes(location.pathname)) {
      store.removeToken()
      window.location.href = 'http://localhost:5173/auth/sign-in'
    }

    if(error.response.status === 403) {
      window.location.href = 'http://localhost:5173/not-found'
    }

    return Promise.reject(error)
  }
)

export default instance