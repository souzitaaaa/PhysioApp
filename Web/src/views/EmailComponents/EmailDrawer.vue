<template>
    <Drawer :visible="visible" position="right" class="w-1/2!" @update:visible="$emit('close')">
        <template #container="{ closeCallback }">
            <div class="flex flex-col h-full">
                <!-- Header -->
                <div class="flex justify-end items-center gap-2 px-2 pt-2">
                    <Button v-if="mode === 'view' && formData.statusID === 1" icon="fa-solid fa-ellipsis-vertical"
                        severity="contrast" text @click="toggle" aria-haspopup="true" aria-controls="actions_menu" />
                    <Menu ref="menu_email" id="actions_menu" :model="actions" :popup="true">
                        <template #item="{ item, props }">
                            <a v-ripple class="flex items-center justify-between w-full px-2 py-1" v-bind="props.item"
                                @click="item.command">
                                <span class="">{{ item.label }}</span>
                                <span :class="item.icon" />
                            </a>
                        </template>
                    </Menu>
                    <Button v-if="mode === 'view'" icon="fa-solid fa-xmark" severity="contrast" text
                        @click="closeCallback" v-tooltip.bottom="{ value: 'Fechar', showDelay: 500, hideDelay: 250 }" />
                </div>
                <div class="flex-1 overflow-y-auto px-8">
                    <span class="text-form-value text-lg font-medium!">Conteúdo Original</span>

                    <div class="space-y-1 mt-2">
                        <p class="grid grid-cols-12 items-start gap-2">
                            <span class="text-form-title text-sm col-span-2">De:</span>
                            <span class="text-form-value col-span-10 whitespace-pre-wrap">
                                {{ formData.from }}
                            </span>
                        </p>
                        <p class="grid grid-cols-12 items-start gap-2">
                            <span class="text-form-title text-sm col-span-2">Dia:</span>
                            <span class="text-form-value col-span-10 whitespace-pre-wrap">
                                {{ formData.date }}
                            </span>
                        </p>
                        <p class="grid grid-cols-12 items-start gap-2">
                            <span class="text-form-title text-sm col-span-2">Assunto:</span>
                            <span class="text-form-value col-span-10 whitespace-pre-wrap">
                                {{ formData.subject }}
                            </span>
                        </p>
                        <div class="grid grid-cols-12 items-start gap-2">
                            <span class="text-form-title text-sm col-span-2">Conteúdo:</span>
                            <span class="text-form-value col-span-10 whitespace-pre-wrap">
                                {{ formData.body }}
                            </span>
                        </div>
                    </div>
                    <hr class="h-px my-4 line-hr" />

                    <span class="text-form-value text-lg font-medium! mr-4">Extração Feita</span>
                    <span class="text-form-value text-sm font-semibold! text-red-500!"> {{ formData.error }}</span>

                    <div class="space-y-1 mt-2">
                        <p class="grid grid-cols-12 items-start gap-2">
                            <span class="text-form-title text-sm col-span-2">Título:</span>
                            <span v-if="mode === 'view'" class="text-form-value col-span-10 whitespace-pre-wrap">
                                {{ formData.injury_title }}
                            </span>
                        <div v-else class="text-form-value col-span-5 whitespace-pre-wrap">
                            <InputText v-model="formData.injury_title" size="small" type="text"
                                :invalid="!!errors.injury_title" fluid />
                            <small v-if="errors.injury_title" class="text-red-600 text-xs">{{ errors.injury_title
                            }}</small>
                        </div>
                        </p>
                        <p class="grid grid-cols-12 items-start gap-2">
                            <span class="text-form-title text-sm col-span-2">Resumo:</span>
                            <span v-if="mode === 'view'" class="text-form-value col-span-10 whitespace-pre-wrap">
                                {{ formData.injury_resume }}
                            </span>
                        <div v-else class="text-form-value col-span-5 whitespace-pre-wrap">
                            <InputText v-model="formData.injury_resume" size="small" type="text"
                                :invalid="!!errors.injury_resume" fluid />
                            <small v-if="errors.injury_resume" class="text-red-600 text-xs">{{ errors.injury_resume
                            }}</small>
                        </div>
                        </p>
                        <p class="grid grid-cols-12 items-start gap-2">
                            <span class="text-form-title text-sm col-span-2">Atleta:</span>
                            <span v-if="mode === 'view'" class="text-form-value col-span-10 whitespace-pre-wrap">
                                {{ formData.athlete_name }} ({{ formData.athlete_phone }})
                            </span>
                        <div v-else class="text-form-value col-span-5 whitespace-pre-wrap">
                            <Select v-model="formData.athleteID" :options="athletes" optionLabel="name"
                                optionValue="athleteID" size="small" :invalid="!!errors.athleteID" fluid
                                placeholder="Selecionar" filter>
                                <template #value="slotProps">
                                    <div v-if="slotProps.value" class="flex items-center gap-2">
                                        <!-- find the country object by ID -->
                                        <Avatar :image="athletes.find(a => a.athleteID === slotProps.value)?.pfp"
                                            shape="circle" />
                                        <span>{{athletes.find(a => a.athleteID === slotProps.value)?.name}}</span>
                                    </div>
                                    <span v-else>{{ slotProps.placeholder }}</span>
                                </template>
                                <!-- Dropdown options with flag -->
                                <template #option="slotProps">
                                    <div class="flex items-center gap-2">
                                        <Avatar :image="slotProps.option.pfp" shape="circle" />
                                        <span>{{ slotProps.option.name }}</span>
                                    </div>
                                </template>
                            </Select>
                            <small v-if="errors.athleteID" class="text-red-600 text-xs">{{ errors.athleteID
                            }}</small>
                        </div>
                        </p>
                        <p class="grid grid-cols-12 items-start gap-2">
                            <span class="text-form-title text-sm col-span-2">Fisioterapeuta:</span>
                            <span v-if="mode === 'view'" class="text-form-value col-span-10 whitespace-pre-wrap">
                                {{ formData.physioName }} ({{ formData.physio_phone }})
                            </span>
                        <div v-else class="text-form-value col-span-5 whitespace-pre-wrap">
                            <Select v-model="formData.userID" :options="physios" optionLabel="name" optionValue="userID"
                                size="small" :invalid="!!errors.userID" fluid placeholder="Selecionar" filter>
                                <template #value="slotProps">
                                    <div v-if="slotProps.value" class="flex items-center gap-2">
                                        <!-- find the country object by ID -->
                                        <Avatar :image="physios.find(a => a.userID === slotProps.value)?.pfp"
                                            shape="circle" />
                                        <span>{{physios.find(a => a.userID === slotProps.value)?.name}}</span>
                                    </div>
                                    <span v-else>{{ slotProps.placeholder }}</span>
                                </template>
                                <!-- Dropdown options with flag -->
                                <template #option="slotProps">
                                    <div class="flex items-center gap-2">
                                        <Avatar :image="slotProps.option.pfp" shape="circle" />
                                        <span>{{ slotProps.option.name }}</span>
                                    </div>
                                </template>
                            </Select>
                            <small v-if="errors.userID" class="text-red-600 text-xs">{{ errors.userID
                            }}</small>
                        </div>
                        </p>
                        <p v-if="formData.errorSpecID === 1 && mode === 'edit'"
                            class="grid grid-cols-12 items-start gap-2">
                            <span class="mt-2 text-form-title text-sm col-span-12">Apesar da não identificação do
                                responsável, confirma que o
                                registo criado é valido para o atleta identificado?</span>
                            <ToggleSwitch v-model="correctInformation" size="small"
                                :invalid="!!errors.correctInformation" fluid />
                            <small v-if="errors.correctInformation" class="text-red-600 text-xs">{{
                                errors.correctInformation
                            }}</small>
                        </p>
                    </div>
                </div>

                <!-- Footer -->
                <div class="flex justify-end gap-3 px-4 pb-4 sticky">

                    <!-- Cancelar -->
                    <Button v-if="mode === 'edit'" icon="fa-solid fa-xmark" label="Cancelar" class="px-5" size="small"
                        severity="secondary" @click="cancelAction" />

                    <!-- Guardar -->
                    <Button v-if="mode === 'edit' || mode === 'add'" icon="fa-solid fa-floppy-disk" label="Guardar"
                        class="px-5" size="small" @click="save" />

                    <!-- Corrigir Erros -->
                    <Button v-if="mode === 'view' && email.statusID === 1" icon="fa-solid fa-triangle-exclamation"
                        label="Corrigir Erros" class="px-5" size="small" severity="danger" @click="correctError" />

                </div>
            </div>
        </template>
    </Drawer>

    <EmailModal :visible="emailDeleteModalVisible" :email="formData" @deleted="handleEmailDeleted"
        @close="closeDeleteModal"></EmailModal>

</template>

<script>
import { safeGet } from '../../../utils/utils.js'
import axios from 'axios';
import EmailModal from './EmailModal.vue';

export default {
    components: {
        EmailModal
    },
    props: {
        visible: {
            type: Boolean,
            required: true
        },
        email: Object,
        mode: {
            type: String,
            default: 'view'
        }
    },
    emits: ["close"],
    data() {
        return {
            // Data Helpers
            actions: [
                { label: 'Apagar', icon: 'fa-solid fa-trash-can', command: () => this.showDeleteConfirmation() },
            ],
            athletes: [],
            physios: [],
            // Main
            formData: null,
            // Helpers
            errors: {},
            correctInformation: false,
            emailDeleteModalVisible: false,
        }
    },
    watch: {
        visible(val) {
            if (val)
                this.resetDrawer()
        },
        email: {
            handler(val) {
                this.formData = val
            },
            immediate: true,
        },
    },
    mounted() {
        this.loadAthletes();
        this.loadPhysios();
    },
    methods: {
        async loadAthletes() {
            this.athletes = await safeGet(axios.get(`http://localhost:3000/athletes`), []);
        },
        async loadPhysios() {
            this.physios = await safeGet(axios.get(`http://localhost:3000/users`), []);
        },
        toggle(event) {
            if (this.$refs.menu_email) {
                this.$refs.menu_email.toggle(event)
            }
        },
        closeDeleteModal() {
            this.emailDeleteModalVisible = false;
        },
        handleEmailDeleted() {
            this.emailDeleteModalVisible = false;
            this.$emit('close');
        },
        showDeleteConfirmation() {
            this.emailDeleteModalVisible = true;
        },
        correctError() {
            this.$emit('update:mode', 'edit')
        },
        cancelAction() {
            if (this.mode === 'edit') {
                this.formData = this.email
                this.errors = {}
                this.emailDeleteModalVisible = false
                this.correctInformation = false
                this.$emit('update:mode', 'view')
            }
        },
        resetDrawer() {
            this.formData = this.email
            this.emailDeleteModalVisible = false
            this.correctInformation = false
            this.errors = {}
        },
    },
}
</script>