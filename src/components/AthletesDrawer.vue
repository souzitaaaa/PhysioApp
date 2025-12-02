<template>
  <Drawer :visible="visible" position="right" class="w-1/2!" @update:visible="$emit('close')">
    <template #container="{ closeCallback }">
      <!-- Header -->
      <div class="flex justify-end items-center gap-2 px-2 pt-2">
        {{ athlete }}
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

      <div class="px-8">
        <!-- Secção 1 -->
        <div class="flex items-center gap-4">
          <img :src="athlete.pfp" alt="Foto de Perfil" class="w-32 h-32 rounded-3xl" />
          <div class="flex flex-col">
            <span class="text-form-value text-xl font-semibold">{{ athlete.name }}</span>
            <span
              v-if="athlete.injuredBit"
              class="inline-flex items-center gap-2 text-red-600 font-medium"
            >
              <i class="fa-solid fa-truck-medical"></i>
              Lesionado (estilizar melhor)
            </span>
          </div>
        </div>

        <hr class="h-px my-8 line-hr" />

        <!-- Secção 2 -->
        <span class="text-form-value text-lg font-medium!">Detalhes Pessoais</span>
        <div class="space-y-2 mt-4">
          <p>
            <span class="text-form-title">Email:</span>
            <span class="text-form-value">{{ athlete.email }}</span>
          </p>
          <p>
            <span class="text-form-title">Telefone:</span>
            <span class="text-form-value">{{ athlete.phoneNumber }}</span>
          </p>
          <p>
            <span class="text-form-title">Data de Nascimento:</span>
            <span class="text-form-value">{{ athlete.birthdate }}</span>
          </p>
          <p>
            <span class="text-form-title">Nacionalidade:</span>
            <span class="text-form-value">{{ athlete.nationality }}</span>
          </p>
          <p>
            <span class="text-form-title">Divisão:</span>
            <span class="text-form-value">{{ athlete.taux_division.division }}</span>
          </p>
        </div>

        <hr class="h-px my-8 line-hr" />

        <!-- Secção 3 -->
        <span class="text-form-value text-lg font-medium!">Detalhes dos Responsáveis</span>
        <div class="space-y-2 mt-4">
          <p>
            <span class="text-form-title">Nome:</span>
            <span class="text-form-value">idk</span>
          </p>
          <p>
            <span class="text-form-title">Email:</span>
            <span class="text-form-value">idk</span>
          </p>
          <p>
            <span class="text-form-title">Telefone:</span>
            <span class="text-form-value">idk</span>
          </p>
          <p>
            <span class="text-form-title">Nome 2:</span>
            <span class="text-form-value">idk</span>
          </p>
          <p>
            <span class="text-form-title">Email 2:</span>
            <span class="text-form-value">idk</span>
          </p>
          <p>
            <span class="text-form-title">Telefone 2:</span>
            <span class="text-form-value">idk</span>
          </p>
        </div>
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
    athlete: {
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
