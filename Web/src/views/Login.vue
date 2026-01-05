<template>
  <div class="w-full h-full flex flex-col items-center justify-center bg-no-repeat bg-cover bg-center"
    style="background-image: url('/images/background.svg')">
    <!-- Email input -->
    <div class="input-container">
      <input type="text" id="email" v-model="formData.email" required />
      <label for="email">Email</label>
      <span class="underline"></span>
    </div>

    <!-- Password input -->
    <div class="input-container mt-6">
      <input
        :type="showPassword ? 'text' : 'password'"
        id="password"
        v-model="formData.password"
        @focus="isPasswordFocused = true"
        @blur="isPasswordFocused = false"
        required
      />
      <label for="password">Palavra-Passe</label>
      <span class="underline"></span>

      <!-- Ícone Font Awesome -->
      <button
        type="button"
        class="icon-password"
        @click="togglePassword"
        :class="{
          focused: isPasswordFocused,
          filled: formData.password.length > 0
        }"
        :aria-label="showPassword ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'">
        <i class="fa-solid" :class="showPassword ? 'fa-eye' : 'fa-eye-slash'"></i>
      </button>
    </div>
    
    <!-- Login button container -->
    <div class="input-container relative mt-6 w-full flex justify-end">
      <Button
        icon="fa-solid fa-right-to-bracket"
        label="Entrar"
        class="btn-login"
        size="large"
        @click="handleLogin"
      />
    </div>
    <!-- Display form validation errors -->
    <small v-if="errors.email" class="text-red-600 text-xs">{{ errors.email }}</small>
    <small v-if="errors.password" class="text-red-600 text-xs">{{ errors.password }}</small>

    <!-- Display API error -->
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

    // Form data and validation state
    const formData = ref({ email: '', password: '' })
    const errors = ref({})
    const apiError = ref(null)

    // Password toggle and focus state
    const showPassword = ref(false)
    const isPasswordFocused = ref(false)

    const { login } = useAuth()

    // Toggle password visibility
    const togglePassword = () => {
      showPassword.value = !showPassword.value
    }

    // Handle login button click
    const handleLogin = async () => {
      errors.value = validateAuthForm(formData.value)
      if (Object.keys(errors.value).length > 0) return

      try {
        const response = await login(formData.value.email, formData.value.password)
        router.push('/')
      } catch (err) {
        console.error('Erro no login:', err)
        apiError.value = err.response?.data?.error || 'Login failed'
      }
    }

    return { formData, errors, apiError, showPassword, togglePassword, handleLogin, isPasswordFocused }
  }
}
</script>
