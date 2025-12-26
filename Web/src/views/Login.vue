<template>
  <form @submit.prevent="handleLogin">
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button>Login</button>
    <p v-if="error">{{ error }}</p>
  </form>
</template>

<script>
import { useAuth } from '../../utils/auth.js'

export default {
  name: 'Auth',
  data() {
    return {
      email: '',
      password: '',
      error: null
    }
  },
  setup() {
    const { signIn } = useAuth()
    return { signIn }
  },
  methods: {
    async handleLogin() {
      this.error = null
      try {
        await this.signIn(this.email, this.password)
      } catch (err) {
        this.error = err.message
      }
    }
  }
}
</script>