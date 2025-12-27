import { ref } from 'vue'
import axios from 'axios'

const user = ref(null)
const loading = ref(true)

const api = axios.create({
  baseURL: 'http://localhost:3000',
})

function setToken(token) {
  if (token) {
    localStorage.setItem('access_token', token)
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    localStorage.removeItem('access_token')
    delete api.defaults.headers.common.Authorization
  }
}

// Initialize auth on app load
async function initAuth() {
  const token = localStorage.getItem('access_token')

  if (!token) {
    loading.value = false
    return
  }

  setToken(token)

  try {
    const { data } = await api.get('/auth/me')
    user.value = data
  } catch {
    setToken(null)
    user.value = null
  } finally {
    loading.value = false
  }
}

initAuth()

export function useAuth() {
  const signIn = async (email, password) => {
    const { data } = await api.post('/auth/login', {
      email,
      password,
    })

    setToken(data.session.access_token)
    user.value = data.user
  }

  const signOut = async () => {
    await api.post('/auth/logout')
    setToken(null)
    user.value = null
  }

  return {
    user,
    loading,
    signIn,
    signOut,
  }
}
