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
        <Button icon="fa-solid fa-plus" class="mr-2" severity="success" label="Criar Utilizador" size="small"
          @click="createUserDrawer" />
      </template>
    </Toolbar>

    <DataTable ref="dt" :value="users" dataKey="userID" class="style-table" scrollable scrollHeight="flex">
      <Column header="Nome" style="min-width: 16rem">
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <Avatar :image="data.pfp" class="mr-2" style="background-color: #ece9fc; color: #2a1261" shape="circle" />
            <span>{{ data.name }}</span>
            <i :class="[
              'fa-solid',
              data.notification_status ? 'fa-bell' : 'fa-bell-slash',
              'text-slate-600',
              'font-medium'
            ]" style="font-size: 0.8rem" />
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
import { supabase } from '../../utils/supabase'
import { uploadImageToSupabase } from '../../utils/utils'
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

      if (userID) return data;

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
    createUserDrawer() {
      this.selectedUser = null
      this.drawerMode = 'add'
      this.userDrawerVisible = true
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
      const userID = await this.addUser(payload);
      if (callback) callback(userID);
    },
    async addUser(formData) {
      const pfpUrl =
        formData.pfp instanceof File
          ? await uploadImageToSupabase(formData.pfp, "user-images")
          : formData.pfp || null

      const { data, error } = await supabase
        .from('t_user')
        .insert([
          {
            name: formData.name,
            birthdate: formData.birthdate,
            email: formData.email,  
            phoneNumber: formData.phoneNumber,
            pfp: pfpUrl,
            nationality: formData.nationality,
            usertypeID: formData.usertypeID,
            password: '123',
            notification_status: formData.notification_status ? formData.notification_status : false
          },
        ])
        .select(`userID`)

      if (error) {
        console.log(error)
        //! NAO ESQUECER TOASTER
        return
      }

      const newUser = await this.getUserData(data[0].userID)
      await this.getUserData()

      this.selectedUser = newUser
      this.drawerMode = 'view'
      this.userDrawerVisible = true

      return data[0].userID
    },
    async updateUser(formData, callback) {
      let pfpUrl = formData.pfp;

      if (formData.pfp instanceof File)
        pfpUrl = await uploadImageToSupabase(formData.pfp, 'user-images');

      const { data, error } = await supabase.from('t_user').update([
        {
          name: formData.name,
          birthdate: formData.birthdate,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          pfp: pfpUrl,
          nationality: formData.nationality,
          usertypeID: formData.usertypeID,
          notification_status: formData.notification_status ? formData.notification_status : false
        },
      ])
        .eq('userID', formData.userID)
        .select()

      if (error) {
        console.log(error)
        return
      }

      if (callback)
        await callback();

      const newUser = await this.getUserData(data[0].userID)
      console.log("newUser: ", newUser)

      await this.getUserData()

      this.selectedUser = newUser
      this.drawerMode = 'view'
      this.userDrawerVisible = true
    }
  },
}
</script>
