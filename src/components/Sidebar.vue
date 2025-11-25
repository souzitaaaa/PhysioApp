<template>
  <div class="flex justify-center px-5 mt-4">
    <img src="/images/logo-big.svg" alt="Logo" class="max-w-[140px] mb-5" />
  </div>

  <div class="mt-5 flex flex-col gap-3">
    <div v-for="(item, index) in navOptions" :key="index" class="flex justify-end items-center">
      <RouterLink
        :to="item.route"
        class="flex justify-start content-center button-sidebar color-grey-details"
      >
        <i :class="['fa-solid', item.icon, 'text-2xl']"></i>
        <h1 class="text-base ms-6">{{ item.text }}</h1>
      </RouterLink>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navOptions: [
        { text: 'Início', icon: 'fa-house', route: '/' },
        { text: 'Emails', icon: 'fa-envelope', route: '/email' },
        { text: 'Atletas', icon: 'fa-dumbbell', route: '/atletas' },
        { text: 'Utilizadores', icon: 'fa-users', route: '/utilizadores' },
      ],
    }
  },
  mounted() {
  }
}

</script>
