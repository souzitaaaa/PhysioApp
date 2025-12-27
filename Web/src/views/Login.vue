<template>
  <div class="w-full h-full flex flex-col mt-16 p-4">
    <!-- Header -->
    <div class="flex flex-col items-center justify-center shrink-0 mb-8">
      <img src="/images/logo-big-dark.svg" alt="Logo" class="max-w-48 mb-2" />
      <p class="text-black-900 text-xl font-semibold mb-2">
        Bem-vindo novamente
      </p>
      <p class="text-black-600 text-sm text-center">
        Caso esteja com dificuldades a aceder à plataforma, contacte o Administrador
      </p>
    </div>

    <div class="border-t border-gray-300 mx-12"></div>


    <!-- Content -->
    <div class="flex-1 flex items-start justify-center my-8">
      <div class="w-2/3 max-w-xl flex flex-col gap-6">
        <!-- Email -->
        <div class="flex flex-col gap-1">
          <label for="email">Email</label>
          <InputText id="email" v-model="formData.email" :invalid="!!errors.email" fluid />
          <small v-if="errors.email" class="text-red-600 text-xs">{{ errors.email }}</small>
        </div>

        <!-- Password -->
        <div class="flex flex-col gap-1">
          <label for="password">Palavra-Passe</label>
          <Password id="password" v-model="formData.password" :invalid="!!errors.password" :feedback="false" toggleMask
            fluid />
          <small v-if="errors.password" class="text-red-600 text-xs">{{ errors.password }}</small>
        </div>

        <!-- Action -->
        <Button icon="fa-solid fa-right-to-bracket" label="Entrar" class="w-full" size="large" @click="handleLogin" />
        <small v-if="apiError" class="text-red-600 text-xs">{{ apiError }}</small>
      </div>
    </div>


  </div>
</template>


<script>
import { useAuth } from '../../utils/auth.js'
import { validateAuthForm } from '../../utils/authUtils.js';

export default {
  name: 'Auth',
  data() {
    return {
      // Main
      formData: {
        email: '',
        password: '',
      },
      // Helpers
      errors: {},
      apiError: null,
    }
  },
  setup() {
    const { signIn } = useAuth()
    return { signIn }
  },
  methods: {
    async handleLogin() {
      this.errors = validateAuthForm(this.formData)
      if (Object.keys(this.errors).length > 0) return

      try {
        await this.signIn(
          this.formData.email,
          this.formData.password
        )

        this.$router.push('/')
      } catch (err) {
        this.apiError =
          err.response?.data?.error || 'Login failed'
      }
    }

  }
}
</script>