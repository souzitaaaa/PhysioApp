<template>
    <Dialog :visible="visible" modal @update:visible="$emit('close')">
        <template #container="{ closeCallback }">
            <div class="p-6 max-w-md mx-auto">

                <!-- Header -->
                <h2 class="text-lg font-bold mb-4 text-center">
                    Tem a certeza que quer remover este email?
                </h2>

                <!-- Description -->
                <p class="mb-4 text-center">
                    Esta ação é irreversível e todos os dados relacionados a este email, vão ser removidos.
                </p>

                <!-- Password input -->
                <div class="mb-4">
                    <label for="password" class="block text-sm mb-1">Password</label>
                    <InputText id="password" v-model="password" type="password" size="small"
                        placeholder="Insira a sua password para confirmação" :invalid="!!passwordError"
                        class="w-full" />
                    <small v-if="passwordError" class="text-red-600 text-xs">{{ passwordError }}</small>

                </div>

                <!-- Buttons -->
                <div class="flex justify-end gap-2 mt-4">

                    <!-- Cancel button -->
                    <Button label="Cancelar" icon="fa-solid fa-arrow-left" severity="secondary" @click="$emit('close')"
                        size="small" />

                    <!-- Delete button -->
                    <Button label="Apagar" icon="fa-solid fa-trash" severity="danger" @click="confirmDelete"
                        size="small" />
                </div>

            </div>
        </template>
    </Dialog>
</template>

<script>
import axios from 'axios';
import { safeGet } from '../../../utils/utils.js'

export default {
    props: {
        visible: {
            type: Boolean,
            required: true,
        },
        email: Object,
    },
    watch: {
        // Reset modal fields when it opens
        visible(val) {
            if (val)
                this.resetModal()
        }
    },
    data() {
        return {
            password: '',
            passwordError: ''
        }
    },
    methods: {
        // Reset password and errors
        resetModal() {
            this.password = ''
            this.passwordError = ''
        },

        // Confirm deletion
        async confirmDelete() {
            this.passwordError = '';

            // Check if password is entered
            if (!this.password) {
                this.passwordError = 'Por favor insira palavra passe.'
                return
            }

            // Call API to delete email
            await axios.delete(`http://localhost:3000/emails/${this.email.emailID}`, {
                data: { password: this.password }
            })
                .then(() => {
                    this.$emit('deleted')
                    this.$emit('close')
                    this.resetModal()
                })
                .catch(err => {
                    if (err.response) {
                        if (err.response.status === 401)
                            this.passwordError = 'Palavra passe inválida.'
                        else if (err.response.status === 404)
                            this.passwordError = 'Atleta não encontrado.'
                        else
                            this.passwordError = 'Erro ao apagar atleta. Tente novamente.'
                    } else
                        this.passwordError = 'Erro de rede. Verifique a conexão.'
                })
        }
    }
}

</script>