<template>
  <div>
    <Toolbar class="mb-4">
      <template #start>
        <IconField>
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText placeholder="Procurar" size="small" />
        </IconField>
      </template>
      <template #end>
        <Button
          icon="pi pi-plus"
          class="mr-2"
          severity="success"
          label="Criar Utilizador"
          size="small"
        />
      </template>
    </Toolbar>

    <DataTable ref="dt" :value="users" dataKey="userID" class="style-table">
      <Column header="Nome" style="min-width: 16rem">
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <Avatar
              icon="pi pi-user"
              class="mr-2"
              style="background-color: #ece9fc; color: #2a1261"
              shape="circle"
            />
            <span>{{ data.name }}</span>
          </div>
        </template>
      </Column>
      <Column header="Idade">
        <template #body="{ data }">
          <div class="flex flex-col">
            <span class="">(calcular idade)</span>
            <span class="text-xs">{{ data.birthdate }}</span>
          </div>
        </template>
      </Column>
      <Column header="Telemóvel">
        <template #body="{ data }">
          <div class="flex flex-col">
            <span class="text-base">{{ data.phoneNumber }}</span>
          </div>
        </template>
      </Column>
      <Column header="Email">
        <template #body="{ data }">
          <div class="flex flex-col">
            <span class="text-base">{{ data.email }}</span>
          </div>
        </template>
      </Column>
      <Column header="Palavra-Passe">
        <template #body="{ data }">
          <div class="flex flex-col">
            <span class="text-base">{{ data.password }}</span>
          </div>
        </template>
      </Column>
      <Column :exportable="false" style="min-width: 3rem">
        <template #body="slotProps">
          <Button
          icon="pi pi-eye"
          severity="secondary"
          variant="outlined"
          size="small"
          @click="editProduct(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script>
import { supabase } from '../../utils/supabase'

export default {
  components: {},
  data() {
    return {
      users: [],
    }
  },
  watch: {},
  mounted() {
    this.getUserData()
  },
  methods: {
    async getUserData() {
      const { data } = await supabase.from('t_user').select(`*`)
      this.users = data
    },
    exportCSV() {
      this.$refs.dt.exportCSV()
    },
  },
}
</script>
