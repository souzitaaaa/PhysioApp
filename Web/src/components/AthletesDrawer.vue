<template>
  <Drawer :visible="visible" position="right" class="w-1/2!" @update:visible="$emit('close')">
    <template #container="{ closeCallback }">
      <div class="flex flex-col h-full">
        
        <!-- Header -->
        <div class="flex justify-end items-center gap-2 px-2 pt-2">
          {{ JSON.stringify(formData, null, 2) }}
          <Button
            v-if="mode === 'view'"
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
              <a v-ripple class="flex items-center justify-between w-full px-2 py-1" v-bind="props.item" @click="item.command">
                <span class="">{{ item.label }}</span>
                <span :class="item.icon" />
              </a>
            </template>
          </Menu>
          <Button
            v-if="mode === 'view'"
            icon="fa-solid fa-xmark"
            severity="contrast"
            text
            @click="closeCallback"
            size="large"
            v-tooltip.bottom="{ value: 'Fechar', showDelay: 500, hideDelay: 250 }"
          />
        </div>

        <div class="flex-1 overflow-y-auto px-8">
          <!-- Secção 1 -->
          <div class="flex items-center gap-4">
            <img v-if="mode === 'view'" :src="formData.pfp" alt="Foto de Perfil" class="w-32 h-32 rounded-3xl" />
            <FileUpload v-else ref="pfpUpload" mode="basic" size="small" customUpload accept="image/*" :maxFileSize="1000000" @upload="onUpload" chooseLabel="Foto" severity="contrast" class="p-button-outlined" @select="onFileSelect"/>
            <div class="flex flex-col flex-1">
              <span v-if="mode === 'view'" class="text-form-value text-xl font-semibold">
                {{ formData.name }}
              </span>
              <div v-else>
                <InputText
                  v-model="formData.name"
                  size="small"
                  type="text"
                  :invalid="!!errors.name"
                  fluid
                ></InputText>
                <small v-if="errors.name" class="text-red-600 text-xs">{{ errors.name }}</small>
              </div>
              <span
                v-if="formData.injuredBit"
                class="inline-flex items-center gap-2 text-red-600 font-medium mt-1"
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
            <!-- Email -->
            <p class="grid grid-cols-12 items-center gap-2">
              <span class="text-form-title text-sm col-span-3">Email:</span>
              <div class="col-span-5">
                <span v-if="mode === 'view'" class="text-form-value">{{ formData.email }}</span>

                <div v-else>
                  <InputText v-model="formData.email" size="small" type="email"
                            :invalid="!!errors.email" fluid />
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
                  <InputNumber
                    v-model="formData.phoneNumber"
                    size="small"
                    inputId="integeronly"
                    :invalid="!!errors.phoneNumber"
                    fluid
                  />
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
                  <DatePicker
                    v-model="formData.birthdate"
                    dateFormat="yy-mm-dd"
                    size="small"
                    :invalid="!!errors.birthdate"
                    fluid
                  />
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
                  <InputText v-model="formData.nationality" size="small" type="text"
                            :invalid="!!errors.nationality" fluid />
                  <small v-if="errors.nationality" class="text-red-600 text-xs">{{ errors.nationality }}</small>
                </div>
              </div>
            </p>
            <!-- Divisão -->
            <p class="grid grid-cols-12 items-center gap-2">
              <span class="text-form-title text-sm col-span-3">Divisão:</span>
              <div class="col-span-5">
                <span v-if="mode === 'view'" class="text-form-value">
                  {{ formData.division }}
                </span>

                <div v-else>
                  <Select v-model="formData.divisionID" :options="divisions" optionLabel="division" optionValue="divisionID" size="small"
                    :invalid="!!errors.divisionID" fluid/>
                  <small v-if="errors.divisionID" class="text-red-600 text-xs">{{ errors.divisionID }}</small>
                </div>
              </div>
            </p>
          </div>

          <hr class="h-px my-8 line-hr" />

          <!-- Secção 3 -->
          <!-- <span class="text-form-value text-lg font-medium!">Detalhes dos Responsáveis</span>
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
          </div> -->
        </div>
        <div class="flex justify-end gap-3 px-4 pb-4 sticky">
          <!-- Cancelar -->
          <Button
            v-if="mode !== 'view'"
            icon="fa-solid fa-xmark"
            label="Cancelar"
            class="px-5"
            size="small"
            severity="secondary"
            @click="cancelAction"
          />

          <!-- Guardar -->
          <Button
            v-if="mode === 'edit' || mode === 'add'"
            icon="fa-solid fa-floppy-disk"
            label="Guardar"
            class="px-5"
            size="small"
            @click="save"
          />

          <!-- Histórico Clínico -->
          <Button
            v-if="mode === 'view'"
            icon="fa-solid fa-caret-right"
            label="Histórico Clínico"
            class="px-5"
            size="small"
            @click="save"
          />
        </div>
      </div>
    </template>
  </Drawer>
</template>

<script>
import { validateAthleteForm, getEmptyAthlete, getAuxDivisionData } from '../../utils/athleteUtils';

export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    athlete: Object,
    mode: {
      type: String,
      default: 'view',
    },
  },
  data() {
    return {
      // Data Helpers
      actions: [
        { label: 'Editar', icon: 'fa-solid fa-pen-to-square', command: () => this.startEditMode() },
        { label: 'Apagar', icon: 'fa-solid fa-trash-can', command: () => this.showDeleteConfirmation() },
      ],
      divisions: [],
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
    athlete: {
      handler(val) {
        this.formData = val ? { ...val } : getEmptyAthlete()
        if (this.formData.birthdate) this.formData.birthdate = new Date(this.formData.birthdate)
      },
      immediate: true,
    },
  },
  mounted() {
    this.loadDivions()
  },
  methods: {
    async loadDivions() {
      this.divisions = await getAuxDivisionData()
    },
    toggle(event) {
      this.$refs.menu.toggle(event)
    },
    startEditMode() {
      this.$emit('update:mode', 'edit')
    },
    showDeleteConfirmation() {
      console.log("showDeleteConfirmation")
    },
    cancelAction() {
      if (this.mode === 'add') this.$emit('close')
      else if (this.mode === 'edit') this.$emit('update:mode', 'view')
    },
    resetDrawer() {
      this.formData = this.athlete ? { ...this.athlete } : getEmptyAthlete()
      this.errors = {}
    },
    onFileSelect(event) {
      this.formData.pfp = event.files[0] || null
    },
    save() {
      this.errors = validateAthleteForm(this.formData)
      if (Object.keys(this.errors).length > 0) return

      const payload = {
        ...this.formData,
        birthdate: this.formData.birthdate?.toISOString().split('T')[0]
      }

      if (this.mode === 'add') this.$emit('add-athlete', payload)
      else if (this.mode === 'edit') this.$emit('update-athlete', payload)

      this.$emit('update:mode', 'view')
    }
  },
}
</script>
