<template>
    <Dialog :visible="visible" modal @update:visible="$emit('close')">
        <template #container="{ closeCallback }">
            <div class="p-6 max-w-md mx-auto"> <!-- Limit modal width and center -->

                <!-- Header -->
                <h2 class="text-lg font-bold mb-4 text-center">
                    Tem a certeza que quer remover este atleta?
                </h2>

                <!-- Description -->
                <p class="mb-4 text-center">
                    Esta ação é irreversível e todos os dados relacionados a
                    <strong>{{ athleteName }}</strong>, vão ser removidos.
                </p>

                <!-- Password input -->
                <div class="mb-4">
                    <label for="password" class="block text-sm mb-1">Password</label>
                    <InputText 
                        id="password" 
                        v-model="password" 
                        type="password" 
                        size="small"
                        placeholder="Insira a sua password para confirmação" 
                        class="w-full"
                    />
                </div>

                <!-- Buttons -->
                <div class="flex justify-end gap-2 mt-4">
                    <Button label="Cancelar" icon="fa-solid fa-arrow-left" severity="secondary"
                        @click="$emit('close')" size="small"/>
                    <Button label="Apagar" icon="fa-solid fa-trash" severity="danger" @click="confirmDelete" size="small"/>
                </div>

            </div>
        </template>
    </Dialog>
</template>

<script>
export default {
    props: {
        visible: {
            type: Boolean,
            required: true,
        },
        athleteName: String,
    },
    data() {
        return {
            password: ''
        }
    },
    methods: {
        confirmDelete() {
            this.$emit('confirm-delete', this.password)
            this.$emit('close')
            this.password = ''
        }
    }
}
</script>
