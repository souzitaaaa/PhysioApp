<template>
  <div class="w-full h-full flex flex-col items-center justify-center bg-no-repeat bg-cover bg-center"
    style="background-image: url('/images/background.svg')">
    <!-- Email -->
    <div class="input-container">
      <input type="text" id="email" v-model="formData.email" required />
      <label for="email">Email</label>
      <span class="underline"></span>
    </div>

    <!-- Password -->
    <div class="input-container mt-6">
      <input :type="showPassword ? 'text' : 'password'" id="password" v-model="formData.password" required />
      <label for="password">Palavra-Passe</label>
      <span class="underline"></span>

      <!-- Ícone Font Awesome -->
      <i class="icon-password fa-solid" :class="[showPassword ? 'fa-eye-slash active' : 'fa-eye']"
        @click="togglePassword"></i>

    </div>

    <!-- Botão de login -->
    <Button icon="fa-solid fa-right-to-bracket" label="Entrar" class="w-25 mt-6" size="large" @click="handleLogin" />
    <small v-if="errors.email" class="text-red-600 text-xs">{{ errors.email }}</small>
    <small v-if="errors.password" class="text-red-600 text-xs">{{ errors.password }}</small>
    <small v-if="apiError" class="text-red-600 text-xs mt-2">{{ apiError }}</small>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../utils/auth.js'
import { validateAuthForm } from '../../utils/authUtils.js'

export default {
  name: 'Auth',
  setup() {
    const router = useRouter()
    const formData = ref({ email: '', password: '' })
    const errors = ref({})
    const apiError = ref(null)
    const showPassword = ref(false)

    const { signIn } = useAuth()

    const togglePassword = () => {
      showPassword.value = !showPassword.value
    }

    const handleLogin = async () => {
      errors.value = validateAuthForm(formData.value)
      if (Object.keys(errors.value).length > 0) return

      try {
        const response = await signIn(formData.value.email, formData.value.password)
        router.push('/')
      } catch (err) {
        console.error('Erro no login:', err)
        apiError.value = err.response?.data?.error || 'Login failed'
      }
    }

    return { formData, errors, apiError, showPassword, togglePassword, handleLogin }
  }
}
</script>
