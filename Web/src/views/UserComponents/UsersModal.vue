<template>
    <Dialog :visible="visible" modal @update:visible="$emit('close')">
        <template #container="{ closeCallback }">
            <div class="p-6 max-w-md mx-auto"> <!-- Limit modal width and center -->

                <!-- Header -->
                <h2 class="text-lg font-bold mb-4 text-center">
                    Tem a certeza que quer remover este utilizador?
                </h2>

                <!-- Description -->
                <p class="mb-4 text-center">
                    Esta ação é irreversível e todos os dados relacionados a
                    <strong>{{ user.name }}</strong>, vão ser removidos.
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
                    <Button label="Cancelar" icon="fa-solid fa-arrow-left" severity="secondary" @click="$emit('close')"
                        size="small" />
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
        user: Object,
    },
    watch: {
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
        resetModal() {
            this.password = ''
            this.passwordError = ''
        },
        async confirmDelete() {
            this.passwordError = '';

            if (!this.password) {
                this.passwordError = 'Por favor insira palavra passe.'
                return
            }

            await axios.delete(`http://localhost:3000/users/${this.user.userID}`, {
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