<template>
  <div class="flex flex-col h-full overflow-hidden">

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
        <Button icon="fa-solid fa-plus" class="mr-2" severity="success" label="Criar Utilizador" size="small" />
      </template>
    </Toolbar>

    <DataTable ref="dt" :value="users" dataKey="userID" class="style-table" scrollable scrollHeight="flex">
      <Column header="Nome" style="min-width: 16rem">
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <Avatar :image="data.pfp" class="mr-2" style="background-color: #ece9fc; color: #2a1261" shape="circle" />
            <span>{{ data.name }}</span>
            <i v-if="data.notification_status" class="fa-solid fa-bell text-slate-600 font-medium"
              style="font-size: 0.8rem"></i>
            <i v-else-if="!data.notification_status" class="fa-solid text-slate-600 fa-bell-slash font-medium"
              style="font-size: 0.8rem"></i>
          </div>
        </template>
      </Column>
      <Column header="Cargo">
        <template #body="{ data }">
          <Tag :value="data.user_type" :severity="getSeverityFromUserType(data.usertypeID)"></Tag>
        </template>
      </Column>
      <Column header="Idade">
        <template #body="{ data }">
          <div class="flex flex-col">
            <span class="">{{ data.age }}</span>
            <span class="text-xs">{{ data.birthdate }}</span>
          </div>
        </template>
      </Column>
      <Column field="nationality" header="Nacionalidade"></Column>
      <Column header="Contactos">
        <template #body="{ data }">
          <div class="flex flex-col">
            <span class="text-base">{{ data.phoneNumber }}</span>
            <span class="text-sm">{{ data.email }}</span>
          </div>
        </template>
      </Column>
      <Column :exportable="false" style="min-width: 3rem">
        <template #body="slotProps">
          <Button icon="fa-solid fa-eye" severity="secondary" variant="outlined" size="small"
            @click="editUser(slotProps.data)" />
        </template>
      </Column>
    </DataTable>
  </div>

  <UsersDrawer :visible="userDrawerVisible" :user="selectedUser" :mode="drawerMode" @close="closeDrawer"
    @add-user="handleAddUser" @update-user="updateUser" @update:mode="drawerMode = $event"></UsersDrawer>

</template>

<script>
import UsersDrawer from './UserComponents/UsersDrawer.vue'
import axios from 'axios';
import { safeGet } from '../../utils/utils.js'
import { Tag } from 'primevue';

export default {
  components: {
    UsersDrawer
  },
  data() {
    return {
      users: [],
      selectedUser: null,
      userDrawerVisible: false,
      drawerMode: 'view',
    }
  },
  watch: {},
  mounted() {
    this.getUserData()
  },
  methods: {
    async getUserData(userID) {
      const endpoint = userID
        ? `http://localhost:3000/users/${userID}`
        : `http://localhost:3000/users`;

      const data = await safeGet(axios.get(endpoint), userID ? null : []);

      this.users = data
    },
    exportCSV() {
      this.$refs.dt.exportCSV()
    },
    async closeDrawer() {
      this.selectedUser = null
      this.drawerMode = 'view'
      this.userDrawerVisible = false
      await this.getUserData();
    },
    getSeverityFromUserType(usertypeID) {
      if (usertypeID === 1) return 'danger'
      if (usertypeID === 2) return 'info'
      return 'secondary'
    },
    editUser(userData) {
      this.selectedUser = userData
      this.drawerMode = 'view'
      this.userDrawerVisible = true
    },
    async handleAddUser(payload, callback) {
      // const userID = await this.addAthlete(payload);
      // if (callback) callback(userID);
    },
    async updateUser(formData, callback) {
    }
  },
}
</script>
