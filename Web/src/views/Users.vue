<template>
  <div>
    <Toolbar class="mb-4">
      <template #start>
        <IconField>
          <InputIcon>
            <i class="fa-solid fa-magnifying-glass" />
          </InputIcon>
          <InputText placeholder="Procurar" size="small" />
        </IconField>
      </template>
      <template #end>
        <Button
          icon="fa-solid fa-plus"
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
            <Avatar :image="data.pfp" class="mr-2" style="background-color: #ece9fc; color: #2a1261" shape="circle" />
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
            icon="fa-solid fa-eye"
            severity="secondary"
            variant="outlined"
            size="small"
            @click="editUser(slotProps.data)" />
        

        </template>
      </Column>
    </DataTable>
  </div>
  <UsersDrawer :visible="userDrawerVisible" :user="selectedUser" @close="userDrawerVisible = false"></UsersDrawer>
</template>

<script>
import { supabase } from '../../utils/supabase'
import UsersDrawer from '../components/UsersDrawer.vue'

export default {
  components: {
    UsersDrawer
  },
  data() {
    return {
      users: [],
      selectedUser: null,
      userDrawerVisible: false
    }
  },
  watch: {},
  mounted() {
    this.getUserData()
  },
  methods: {
    async getUserData() {
      const { data } = await supabase.from('t_user').select(`*,
                                      taux_user_type ( user_type )`)
      this.users = data
    },
    exportCSV() {
      this.$refs.dt.exportCSV()
    },
    editUser(userData) {
      this.selectedUser = userData
      this.userDrawerVisible = true
    }
  },
}
</script>
