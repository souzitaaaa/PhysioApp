<template>
  <Drawer :visible="visible" position="right" class="w-1/2!" @update:visible="$emit('close')">
    <template #container="{ closeCallback }">
      <!-- Header -->
      <div class="flex justify-end items-center gap-2 px-2 pt-2">
        <Button
          icon="fa-solid fa-ellipsis-vertical"
          severity="contrast"
          text
          size="large"
          @click="toggle"
          aria-haspopup="true"
          aria-controls="actions_menu"
        />
        <Menu ref="menu" id="actions_menu" :model="actions" :popup="true">
          <template #item="{ item, props }">
            <a v-ripple class="flex items-center justify-between w-full" v-bind="props.action">
              <span class="">{{ item.label }}</span>
              <span :class="item.icon" />
            </a>
          </template>
        </Menu>
        <Button
          icon="fa-solid fa-xmark"
          severity="contrast"
          text
          @click="closeCallback"
          size="large"
          v-tooltip.bottom="{ value: 'Fechar', showDelay: 500, hideDelay: 250 }"
        />
      </div>

      <div v-if="user">
        <div class="px-8">
          <h2>
            <img
              :src="user.pfp"
              alt="Foto de Perfil"
              class="inline-block w-40 h-40 rounded-3xl mr-2"
            />
            <span class="text-form-value">{{ user.name }}</span>
          </h2>

          <hr class="h-px my-8 line-hr" />

          <span class="text-form-value text-lg font-medium!">Detalhes Pessoais</span>
          <div class="space-y-2 mt-4">
            <p>
              <span class="text-form-title">Data de Nascimento:</span>
              <span class="text-form-value">{{ user.birthdate }}</span>
            </p>
            <p>
              <span class="text-form-title">Telemóvel:</span>
              <span class="text-form-value">{{ user.phoneNumber }}</span>
            </p>
            <p>
              <span class="text-form-title">Email:</span>
              <span class="text-form-value">{{ user.email }}</span>
            </p>
            <p>
              <span class="text-form-title">Nacionalidade:</span>
              <span class="text-form-value">{{ user.nationality }}</span>
            </p>
            <p>
              <span class="text-form-title">Cargo:</span>
              <span class="text-form-value">{{ user.taux_user_type?.user_type }}</span>
            </p>
            <p>
              <span class="text-form-title">Palavra-Passe:</span>
              <span class="text-form-value">{{ user.password }}</span>
            </p>
          </div>
        </div>
      </div>

      <div v-else>
        <p>Nenhum utilizador selecionado.</p>
      </div>
    </template>
  </Drawer>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      actions: [
        { label: 'Editar', icon: 'fa-solid fa-pen-to-square' },
        { label: 'Apagar', icon: 'fa-solid fa-trash-can' },
      ],
    }
  },
  watch: {},
  mounted() {},
  methods: {
    toggle(event) {
      this.$refs.menu.toggle(event)
    },
  },
}
</script>
