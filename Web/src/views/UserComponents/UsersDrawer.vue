<template>
  <Drawer :visible="visible" :closeOnEscape="!userDeleteModalVisible" position="right" class="w-1/2!"
    @update:visible="$emit('close')">
    <template #container="{ closeCallback }">
      <div class="flex flex-col h-full">
        <!-- Header -->
        <div class="flex justify-end items-center gap-2 px-2 pt-2">
          <Button v-if="mode === 'view'" icon="fa-solid fa-ellipsis-vertical" severity="contrast" text @click="toggle"
            aria-haspopup="true" aria-controls="actions_menu" />
          <Menu ref="menu" id="actions_menu" :model="actions" :popup="true">
            <template #item="{ item, props }">
              <a v-ripple class="flex items-center justify-between w-full px-2 py-1" v-bind="props.item"
                @click="item.command">
                <span class="">{{ item.label }}</span>
                <span :class="item.icon" />
              </a>
            </template>
          </Menu>
          <Button v-if="mode === 'view'" icon="fa-solid fa-xmark" severity="contrast" text @click="closeCallback"
            v-tooltip.bottom="{ value: 'Fechar', showDelay: 500, hideDelay: 250 }" />
        </div>

        <span class="text-xs!">
          {{ JSON.stringify(formData, null, 2) }}
        </span>

        <div class="flex-1 overflow-y-auto px-8">
          <!-- Secção 1 -->
          <div class="flex items-center gap-4">
            <img v-if="mode === 'view'" :src="formData.pfp" alt="Foto de Perfil" class="w-32 h-32 rounded-3xl" />
            <FileUpload v-else ref="pfpUpload" mode="basic" size="small" customUpload accept="image/*"
              :maxFileSize="1000000" @upload="onUpload" chooseLabel="Foto" severity="contrast" class="p-button-outlined"
              @select="onFileSelect" />
            <div class="flex flex-col flex-1">
              <span v-if="mode === 'view'" class="text-form-value text-xl font-semibold">
                {{ formData.name }}
              </span>
              <div v-else>
                <InputText v-model="formData.name" size="small" type="text" :invalid="!!errors.name" fluid></InputText>
                <small v-if="errors.name" class="text-red-600 text-xs">{{ errors.name }}</small>
              </div>
            </div>
          </div>

          <hr class="h-px my-4 line-hr" />

          <span class="text-form-value text-lg font-medium!">Detalhes Pessoais</span>

          <div class="space-y-1 mt-2">
            <!-- UserType -->
            <p class="grid grid-cols-12 items-center gap-2">
              <span class="text-form-title text-sm col-span-3">Cargo:</span>
            <div class="col-span-5">
              <span v-if="mode === 'view'" class="text-form-value">
                {{ formData.user_type }}
              </span>
              <div v-else>
                <Select v-model="formData.usertypeID" :options="userTypes" optionLabel="user_type"
                  optionValue="usertypeID" size="small" :invalid="!!errors.usertypeID" fluid />
                <small v-if="errors.usertypeID" class="text-red-600 text-xs">{{ errors.usertypeID }}</small>
              </div>
            </div>
            </p>
            <!-- Email -->
            <p class="grid grid-cols-12 items-center gap-2">
              <span class="text-form-title text-sm col-span-3">Email:</span>
            <div class="col-span-5">
              <span v-if="mode === 'view'" class="text-form-value">{{ formData.email }}</span>

              <div v-else>
                <InputText v-model="formData.email" size="small" type="email" :invalid="!!errors.email" fluid />
                <small v-if="errors.email" class="text-red-600 text-xs">{{ errors.email }}</small>
              </div>
            </div>
            </p>
            <!-- Telefone -->
            <p class="grid grid-cols-12 items-center gap-2">
              <span class="text-form-title text-sm col-span-3">Telefone:</span>
            <div class="col-span-5">
              <span v-if="mode === 'view'" class="text-form-value">{{ formData.phoneNumber }}</span>

              <div v-else>
                <InputNumber v-model="formData.phoneNumber" size="small" inputId="integeronly"
                  :invalid="!!errors.phoneNumber" fluid />
                <small v-if="errors.phoneNumber" class="text-red-600 text-xs">{{ errors.phoneNumber }}</small>
              </div>
            </div>
            </p>
            <!-- Data de Nascimento -->
            <p class="grid grid-cols-12 items-center gap-2">
              <span class="text-form-title text-sm col-span-3">Data de Nascimento:</span>
            <div class="col-span-5">
              <span v-if="mode === 'view'" class="text-form-value">{{ formData.birthdate }}</span>

              <div v-else>
                <DatePicker v-model="formData.birthdate" dateFormat="yy-mm-dd" size="small"
                  :invalid="!!errors.birthdate" fluid />
                <small v-if="errors.birthdate" class="text-red-600 text-xs">{{ errors.birthdate }}</small>
              </div>
            </div>
            </p>
            <!-- Nacionalidade -->
            <p class="grid grid-cols-12 items-center gap-2">
              <span class="text-form-title text-sm col-span-3">Nacionalidade:</span>
            <div class="col-span-5">
              <span v-if="mode === 'view'" class="text-form-value">{{ formData.nationality }}</span>

              <div v-else>
                <InputText v-model="formData.nationality" size="small" type="text" :invalid="!!errors.nationality"
                  fluid />
                <small v-if="errors.nationality" class="text-red-600 text-xs">{{ errors.nationality }}</small>
              </div>
            </div>
            </p>
          </div>

        </div>

        <!-- Footer -->
        <div class="flex justify-end gap-3 px-4 pb-4 sticky">
          <!-- Cancelar -->
          <Button v-if="mode !== 'view'" icon="fa-solid fa-xmark" label="Cancelar" class="px-5" size="small"
            severity="secondary" @click="cancelAction" />

          <!-- Guardar -->
          <Button v-if="mode === 'edit' || mode === 'add'" icon="fa-solid fa-floppy-disk" label="Guardar" class="px-5"
            size="small" @click="save" />
        </div>

      </div>
    </template>
  </Drawer>
</template>

<script>
import { getEmptyUser, validateUserForm } from '../../../utils/userUtils';
import axios from 'axios';
import { safeGet, getAuxTable } from '../../../utils/utils.js'

export default {
  components: {},
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    user: Object,
    mode: {
      type: String,
      default: 'view'
    }
  },
  emits: ["close", "addUser", "updateUser"],
  data() {
    return {
      // Data Helpers
      actions: [
        { label: 'Editar', icon: 'fa-solid fa-pen-to-square', command: () => this.startEditMode() },
        { label: 'Apagar', icon: 'fa-solid fa-trash-can', command: () => this.showDeleteConfirmation() },
      ],
      userTypes: [],
      userDeleteModalVisible: false,
      // Main
      formData: null,
      // Helpers
      errors: {},
    }
  },
  watch: {
    visible(val) {
      if (val)
        this.resetDrawer()
    },
    user: {
      handler(val) {
        this.formData = val ? { ...val } : getEmptyUser()
      },
      immediate: true,
    },
  },
  computed: {
  },
  mounted() {
    this.loadUserTypes()
  },
  methods: {
    async loadUserTypes() {
      this.userTypes = await getAuxTable('userType')
    },
    toggle(event) {
      if (this.$refs.menu) {
        this.$refs.menu.toggle(event)
      }
    },
    startEditMode() {
      this.$emit('update:mode', 'edit')
    },
    showDeleteConfirmation() {
      this.userDeleteModalVisible = true;
    },
    resetDrawer() {
      this.formData = this.user ? { ...this.user } : getEmptyUser()
      this.errors = {}
    },
    onFileSelect(event) {
      this.formData.pfp = event.files[0] || null
    },
    cancelAction() {
      if (this.mode === 'add') this.$emit('close')
      else if (this.mode === 'edit') {
        this.formData = this.user ? { ...this.user } : getEmptyUser()
        this.errors = {}
        this.$emit('update:mode', 'view')
      }
    },
    async save() {
      this.errors = validateUserForm(this.formData)
    }
  }
}
</script>