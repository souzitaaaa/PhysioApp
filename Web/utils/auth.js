import { computed, ref } from 'vue'
import axios from 'axios'
import api from './apiUtils'

const user = ref(null)
const profile = ref(null)
const loading = ref(true)
const error = ref(null)

// Auth component user
export function useAuth() {
  const isAuth = computed(() => !!user.value)

  // Login
  async function login(email, password) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post('/auth/login/web', { email, password })
      user.value = response.data.user
      profile.value = response.data.profile
      return response.data
    } catch (err) {
      err.value = err.response?.data?.error || 'Login failed'
      throw err
    } finally {
      loading.value = false;
    }
  }

  // Logout
  async function logout() {
    loading.value = true;
    error.value = null;

    try {
      await api.post('/auth/logout')
      user.value = null
      profile.value = null
    } catch (err) {
      err.value = err.response?.data?.error || 'Logout failed'
      throw err
    } finally {
      loading.value = false;
    }
  }

  // Get Me Information
  async function fecthUser() {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/auth/me')
      user.value = response.data.auth
      profile.value = response.data.profile
      return response.data
    } catch (err) {
      user.value = null
      profile.value = null
      error.value = err.response?.data?.error || 'Failed to Fetch user'
      throw err
    } finally {
      loading.value = false;
    }
  }

  // Refresh the Token
  async function refreshToken() {
    try {
      await api.post('/auth/refresh')
      return await fecthUser()
    } catch (err) {
      user.value = null
      profile.value = null
      throw err
    }
  }

  return { user, profile, loading, error, isAuth, login, logout, fecthUser, refreshToken }
}