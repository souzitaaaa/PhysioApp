<template>
  <Drawer :visible="visible" :closeOnEscape="!athleteDeleteModalVisible" position="right" class="w-1/2!"
    @update:visible="$emit('close')">
    <template #container="{ closeCallback }">
      <div class="flex flex-col h-full">

        <!-- Header -->
        <div class="flex justify-end items-center gap-2 px-2 pt-2">
          <Button v-if="mode === 'view'" icon="fa-solid fa-ellipsis-vertical" severity="contrast" text @click="toggle"
            aria-haspopup="true" aria-controls="actions_menu" />
          <Menu v-if="selectedPage == 0" ref="menu" id="actions_menu" :model="actions" :popup="true">
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

        <!-- <span class="text-xs!">
          {{ JSON.stringify(formData, null, 2) }}
        </span>
        <span class="text-xs!">
          {{ JSON.stringify(accountableFormData, null, 2) }}
        </span>
        <span class="text-xs!">
          {{ JSON.stringify(injuryRecord, null, 2) }}
        </span> -->

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
              <span v-if="formData.injuredBit" class="inline-flex items-center gap-2 text-red-600 font-medium mt-1">
                <i class="fa-solid fa-truck-medical"></i>
                Lesionado
              </span>
            </div>
          </div>

          <hr class="h-px my-4 line-hr" />

          <!-- Secção 2 First Page -->
          <div v-if="selectedPage == 0">
            <span class="text-form-value text-lg font-medium!">Detalhes Pessoais</span>

            <div class="space-y-1 mt-2">
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
              <!-- Divisão -->
              <p class="grid grid-cols-12 items-center gap-2">
                <span class="text-form-title text-sm col-span-3">Divisão:</span>
              <div class="col-span-5">
                <span v-if="mode === 'view'" class="text-form-value">
                  {{ formData.division }}
                </span>

                <div v-else>
                  <Select v-model="formData.divisionID" :options="divisions" optionLabel="division"
                    optionValue="divisionID" size="small" :invalid="!!errors.divisionID" fluid />
                  <small v-if="errors.divisionID" class="text-red-600 text-xs">{{ errors.divisionID }}</small>
                </div>
              </div>
              </p>
            </div>

            <hr class="h-px my-4 line-hr" />

            <!-- Secção 3 -->
            <span class="text-form-value text-lg font-medium!">Detalhes dos Responsáveis</span>
            <div class="space-y-1 mt-2">
              <template v-for="(item, index) in viewAccountables" :key="index">

                <p class="grid grid-cols-12 items-center gap-2">
                  <span class="text-form-title text-sm col-span-3">Nome {{ Number(index) + 1 }}:</span>
                <div class="col-span-5">
                  <span v-if="mode === 'view'" class="text-form-value">{{ item.name }} </span>
                  <span v-if="mode === 'view'" class="text-form-value text-sm text-slate-600!"> ({{ item.relation }})
                  </span>

                  <div v-else>
                    <InputText v-model="item.name" size="small" type="email"
                      :invalid="!!errorsAccountables?.[index]?.name" fluid />
                    <small v-if="errorsAccountables?.[index]?.name" class="text-red-600 text-xs">{{
                      errorsAccountables?.[index]?.name }}</small>
                  </div>
                </div>
                <div v-if="mode === 'edit' || mode === 'add'" class="col-span-3">
                  <Select v-model="item.relationID" :options="relations" optionLabel="relation" placeholder="Parentesco"
                    optionValue="relationID" size="small" :invalid="!!errorsAccountables?.[index]?.relation" fluid />
                  <small v-if="errorsAccountables?.[index]?.relation" class="text-red-600 text-xs">{{
                    errorsAccountables?.[index]?.relation }}</small>
                </div>
                </p>
                <p class="grid grid-cols-12 items-center gap-2">
                  <span class="text-form-title text-sm col-span-3">Email {{ Number(index) + 1 }}:</span>

                <div class="col-span-5">
                  <span v-if="mode === 'view'" class="text-form-value">{{ item.email }} </span>
                  <div v-else>
                    <InputText v-model="item.email" size="small" type="email"
                      :invalid="!!errorsAccountables?.[index]?.email" fluid />
                    <small v-if="errorsAccountables?.[index]?.email" class="text-red-600 text-xs">{{
                      errorsAccountables?.[index]?.email }}</small>
                  </div>
                </div>
                </p>
                <p class="grid grid-cols-12 items-center gap-2">
                  <span class="text-form-title text-sm col-span-3">Telefone {{ Number(index) + 1 }}:</span>
                <div class="col-span-5">
                  <span v-if="mode === 'view'" class="text-form-value">{{ item.phoneNumber }} </span>

                  <div v-else>
                    <InputText v-model="item.phoneNumber" size="small" type="email"
                      :invalid="!!errorsAccountables?.[index]?.phoneNumber" fluid />
                    <small v-if="errorsAccountables?.[index]?.phoneNumber" class="text-red-600 text-xs">{{
                      errorsAccountables?.[index]?.phoneNumber }}</small>
                  </div>
                </div>
                </p>

              </template>
            </div>
          </div>


          <!-- Secção 2 First Page -->
          <div v-if="selectedPage == 1">
            <span class="text-form-value text-lg font-medium!">Histórico Clínico</span>

            <div class="space-y-1 mt-2">

              <Accordion>
                <AccordionPanel v-for="element in this.injuryRecord" :key="element.injuryRecordID"
                  :value="element.injuryRecordID">
                  <AccordionHeader>
                    <span class="flex items-center gap-2 w-full">
                      <span class="font-bold">{{ element.title }}</span>
                      <span v-if="element.statusID === 3"
                        class="fa-solid fa-circle fa-2xs ml-auto mr-2 text-red-600 leading-none"></span>
                      <span v-if="element.statusID === 2" class="text-sm ml-auto mr-4">{{ element.dateStart }} - {{
                        element.dateEnd }}</span>
                      <span v-if="element.statusID === 3" class="text-sm mr-4">{{ element.dateStart }} - {{
                        element.status }}</span>
                    </span>
                  </AccordionHeader>
                  <AccordionContent>
                    <div class="space-y-1">
                      <!-- Email -->
                      <p class="grid grid-cols-12 items-center gap-2">
                        <span class="text-form-title col-span-3">Em cargo de:</span>
                      <div class="col-span-9">
                        <span class="text-form-value">{{ element.physioName }}</span>
                      </div>
                      </p>

                      <p class="grid grid-cols-12 items-center gap-2">
                        <span class="text-form-title col-span-3">Mensagem:</span>
                      <div class="col-span-9">
                        <span class="text-form-value">{{ element.resume }}</span>
                      </div>
                      </p>
                    </div>
                    <hr class="h-px my-4 line-hr" />
                    <span class="text-form-title">Acompanhamento:</span>

                    <Timeline :value="element.notes" class="compact-timeline">
                      <template #opposite="slotProps">
                        <small class="text-surface-500 dark:text-surface-400">
                          {{ slotProps.item.date }}
                        </small>
                      </template>

                      <template #content="slotProps">
                        {{ slotProps.item.text }}
                      </template>
                    </Timeline>


                  </AccordionContent>
                </AccordionPanel>
              </Accordion>

            </div>
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

          <!-- Detalhes -->
          <Button v-if="mode === 'view' && selectedPage === 1" icon="fa-solid fa-caret-left" label="Detalhes do Atleta"
            class="px-5" size="small" @click="changeContent(0)" />

          <!-- Histórico Clínico -->
          <Button v-if="mode === 'view' && selectedPage === 0" icon="fa-solid fa-caret-right" label="Histórico Clínico"
            class="px-5" size="small" @click="changeContent(1)" />
        </div>
      </div>
    </template>
  </Drawer>

  <AthletesModal :visible="athleteDeleteModalVisible" :athlete="formData" @deleted="handleAthleteDeleted"
    @close="closeDeleteModal">
  </AthletesModal>
</template>

<script>
import { validateAthleteForm, validateAccountableForm, getEmptyAthlete, getEmptyAccountable } from '../../../utils/athleteUtils';
import AthletesModal from './AthletesModal.vue';
import axios from 'axios';
import { safeGet, getAuxTable } from '../../../utils/utils.js'

export default {
  components: {
    AthletesModal
  },
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
  emits: ["close", "addAthlete", "updateAthlete"],
  data() {
    return {
      // Data Helpers
      actions: [
        { label: 'Editar', icon: 'fa-solid fa-pen-to-square', command: () => this.startEditMode() },
        { label: 'Apagar', icon: 'fa-solid fa-trash-can', command: () => this.showDeleteConfirmation() },
      ],
      divisions: [],
      relations: [],
      injuryRecord: [],
      // Main
      formData: null,
      accountable: null,
      accountableFormData: null,
      athleteDeleteModalVisible: false,
      // Helpers
      selectedPage: 0,
      errors: {},
      errorsAccountables: {}
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
        if (this.mode === 'view' && this.formData.athleteID)
          this.loadAccountables(this.formData.athleteID);

      },
      immediate: true,
    },
  },
  computed: {
    viewAccountables() {
      if (this.mode === 'view') {
        return this.accountableFormData.filter(item => !item._isNew && (item.name || item.relation));
      }
      return this.accountableFormData;
    }
  },
  mounted() {
    this.loadDivions()
    this.loadRelations()
  },
  methods: {
    async loadDivions() {
      this.divisions = await getAuxTable('divisions')
    },
    async loadRelations() {
      this.relations = await getAuxTable('relations')
    },
    async loadAthleteHistory(athleteID) {
      const data = await safeGet(
        axios.get(`http://localhost:3000/athletes/${athleteID}/history`),
        []
      );

      this.injuryRecord = data;
    },
    async loadAccountables(athleteID) {
      const data = await safeGet(
        axios.get(`http://localhost:3000/athletes/${athleteID}/accountables`),
        []
      );

      this.accountable = data;

      const maxAccountables = 2;
      this.accountableFormData = [];

      for (let i = 0; i < maxAccountables; i++) {
        if (data[i]) {
          this.accountableFormData.push({ ...data[i], _isNew: false });
        } else {
          this.accountableFormData.push({
            name: '',
            email: '',
            phoneNumber: '',
            relationID: null,
            athleteID,
            _isNew: true
          });
        }
      }
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
      this.athleteDeleteModalVisible = true;
    },
    closeDeleteModal() {
      this.athleteDeleteModalVisible = false;
    },
    handleAthleteDeleted() {
      this.athleteDeleteModalVisible = false;
      this.$emit('close');
    },
    cancelAction() {
      if (this.mode === 'add') this.$emit('close')
      else if (this.mode === 'edit') {
        this.formData = this.athlete ? { ...this.athlete } : getEmptyAthlete()
        this.accountableFormData = this.accountable ? [...this.accountable] : getEmptyAccountable(this.athlete.athleteID)
        this.errors = {}
        this.errorsAccountables = {}
        this.$emit('update:mode', 'view')
      }
    },
    resetDrawer() {
      this.formData = this.athlete ? { ...this.athlete } : getEmptyAthlete()
      this.accountableFormData = getEmptyAccountable()
      this.errors = {}
      this.errorsAccountables = {}
      this.selectedPage = 0
    },
    onFileSelect(event) {
      this.formData.pfp = event.files[0] || null
    },
    async changeContent(pageToGo) {
      this.selectedPage = pageToGo;
      if (pageToGo == 1)
        await this.loadAthleteHistory(this.formData.athleteID)
    },
    async addAccountables(athleteID) {
      const payload = Object.values(this.accountableFormData).filter(
        item => item.name || item.email || item.phoneNumber || item.relationID
      );

      if (payload.length === 0) return;

      await axios.post(
        `http://localhost:3000/athletes/${athleteID}/accountables`,
        payload
      );

      await this.loadAccountables(athleteID);
    },
    async saveAccountables() {
      const updates = [];
      const additions = [];

      this.accountableFormData.forEach(item => {
        if (item._isNew) {
          if (item.name || item.email || item.phoneNumber || item.relationID)
            additions.push(item);
        } else
          updates.push(item);
      });

      for (const acc of updates) {
        await axios.put(
          `http://localhost:3000/athletes/${this.formData.athleteID}/accountables/${acc.accountableID}`,
          acc
        );
      }

      if (additions.length > 0) {
        await axios.post(
          `http://localhost:3000/athletes/${this.formData.athleteID}/accountables`,
          additions
        );
      }

      await this.loadAccountables(this.formData.athleteID);
    },
    async save() {
      this.errors = validateAthleteForm(this.formData)
      this.errorsAccountables = validateAccountableForm(Object.values(this.accountableFormData))
      if (Object.keys(this.errors).length > 0 || Object.keys(this.errorsAccountables).length > 0) return

      const birthdateObj = this.formData.birthdate instanceof Date
        ? this.formData.birthdate
        : new Date(this.formData.birthdate)

      const payload = {
        ...this.formData,
        birthdate: birthdateObj.toISOString().split('T')[0]
      }

      if (this.mode === 'add') {
        this.$emit('addAthlete', payload, async (athleteID) => {
          console.log("athleteID: ", athleteID);
          await this.addAccountables(athleteID);
          this.$emit('update:mode', 'view')
        });
      }
      else if (this.mode === 'edit') {
        this.$emit('updateAthlete', payload, async () => {
          console.log("entrou");
          await this.saveAccountables();
          this.$emit('update:mode', 'view')
        });
      }

    }
  },
}
</script>