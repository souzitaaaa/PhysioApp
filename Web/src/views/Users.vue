<template>
  <div class="flex flex-col h-full overflow-hidden">
    <span class="text-xs font-medium text-gray-600 px-1 pb-1">Estatísticas mensais</span>
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
      <!-- Emails Card -->
      <Card class="shadow-md! border border-slate-300 lg:col-span-1 bg-gray-150! h-24">
        <template #content>
          <div class="flex items-center gap-2 mb-2">
            <i class="text-sm font-bold fa-solid fa-envelope text-gray-700"></i>
            <span class="text-sm font-bold text-gray-700">Emails Recebidos</span>
          </div>
          <div class="px-2 flex items-center justify-between">
            <span class="text-2xl font-bold text-gray-800">
              {{ userStatistics?.emails_this_month ?? '-' }}
            </span>
            <Tag v-if="userStatistics?.emails_percent_change !== null &&
              userStatistics?.emails_percent_change !== undefined &&
              !isNaN(userStatistics?.emails_percent_change)"
              :severity="userStatistics.emails_percent_change >= 0 ? 'success' : 'danger'"
              :icon="userStatistics.emails_percent_change >= 0 ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down'"
              v-tooltip.bottom="{
                value: userStatistics.emails_percent_change >= 0
                  ? `Aumento de ${Math.abs(userStatistics.emails_percent_change).toFixed(1)}% em emails enviados comparado ao mês passado (${userStatistics.emails_last_month} → ${userStatistics.emails_this_month})`
                  : `Diminuição de ${Math.abs(userStatistics.emails_percent_change).toFixed(1)}% em emails enviados comparado ao mês passado (${userStatistics.emails_last_month} → ${userStatistics.emails_this_month})`,
                showDelay: 300,
                hideDelay: 200,
                class: 'text-xs'
              }">
              {{ Math.abs(userStatistics.emails_percent_change).toFixed(1) }}%
            </Tag>
            <span v-else class="text-xs text-gray-400">-</span>
          </div>
        </template>
      </Card>
      <!-- Cases Closed Card -->
      <Card class="shadow-md! border border-slate-300 lg:col-span-1 bg-gray-150! h-24">
        <template #content>
          <div class="flex items-center gap-2 mb-2">
            <i class="text-sm font-bold fa-solid fa-check-circle text-gray-700"></i>
            <span class="text-sm font-bold text-gray-700">Lesões Fechadas</span>
          </div>
          <div class="px-2 flex items-center justify-between">
            <span class="text-2xl font-bold text-gray-800">
              {{ userStatistics?.cases_closed_this_month ?? '-' }}
            </span>
            <Tag v-if="userStatistics?.cases_closed_percent_change !== null &&
              userStatistics?.cases_closed_percent_change !== undefined &&
              !isNaN(userStatistics?.cases_closed_percent_change)"
              :severity="userStatistics.cases_closed_percent_change >= 0 ? 'success' : 'danger'"
              :icon="userStatistics.cases_closed_percent_change >= 0 ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down'"
              v-tooltip.bottom="{
                value: userStatistics.cases_closed_percent_change >= 0
                  ? `Aumento de ${Math.abs(userStatistics.cases_closed_percent_change).toFixed(1)}% em casos fechados comparado ao mês passado (${userStatistics.cases_closed_last_month} → ${userStatistics.cases_closed_this_month})`
                  : `Diminuição de ${Math.abs(userStatistics.cases_closed_percent_change).toFixed(1)}% em casos fechados comparado ao mês passado (${userStatistics.cases_closed_last_month} → ${userStatistics.cases_closed_this_month})`,
                showDelay: 300,
                hideDelay: 200,
                class: 'text-xs'
              }">
              {{ Math.abs(userStatistics.cases_closed_percent_change).toFixed(1) }}%
            </Tag>
            <span v-else class="text-xs text-gray-400">-</span>
          </div>
        </template>
      </Card>

      <!-- Notes Card -->
      <Card class="shadow-md! border border-slate-300 lg:col-span-1 bg-gray-150! h-24">
        <template #content>
          <div class="flex items-center gap-2 mb-2">
            <i class="text-sm font-bold fa-solid fa-note-sticky text-gray-700"></i>
            <span class="text-sm font-bold text-gray-700">Notas Efetuadas</span>
          </div>
          <div class="px-2 flex items-center justify-between">
            <span class="text-2xl font-bold text-gray-800">
              {{ userStatistics?.notes_this_month ?? '-' }}
            </span>
            <Tag v-if="userStatistics?.notes_percent_change !== null &&
              userStatistics?.notes_percent_change !== undefined &&
              !isNaN(userStatistics?.notes_percent_change)"
              :severity="userStatistics.notes_percent_change >= 0 ? 'success' : 'danger'"
              :icon="userStatistics.notes_percent_change >= 0 ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down'"
              v-tooltip.bottom="{
                value: userStatistics.notes_percent_change >= 0
                  ? `Aumento de ${Math.abs(userStatistics.notes_percent_change).toFixed(1)}% em notas criadas comparado ao mês passado (${userStatistics.notes_last_month} → ${userStatistics.notes_this_month})`
                  : `Diminuição de ${Math.abs(userStatistics.notes_percent_change).toFixed(1)}% em notas criadas comparado ao mês passado (${userStatistics.notes_last_month} → ${userStatistics.notes_this_month})`,
                showDelay: 300,
                hideDelay: 200,
                class: 'text-xs'
              }">
              {{ Math.abs(userStatistics.notes_percent_change).toFixed(1) }}%
            </Tag>
            <span v-else class="text-xs text-gray-400">-</span>
          </div>
        </template>
      </Card>

      <!-- Reminders Card -->
      <Card class="shadow-md! border border-slate-300 lg:col-span-1 bg-gray-150! h-24">
        <template #content>
          <div class="flex items-center gap-2 mb-2">
            <i class="text-sm font-bold fa-solid fa-bell text-gray-700"></i>
            <span class="text-sm font-bold text-gray-700">Lembretes Criados</span>
          </div>
          <div class="px-2 flex items-center justify-between">
            <span class="text-2xl font-bold text-gray-800">
              {{ userStatistics?.reminders_created_this_month ?? '-' }}
            </span>
            <Tag v-if="userStatistics?.reminders_percent_change !== null &&
              userStatistics?.reminders_percent_change !== undefined &&
              !isNaN(userStatistics?.reminders_percent_change)"
              :severity="userStatistics.reminders_percent_change >= 0 ? 'success' : 'danger'"
              :icon="userStatistics.reminders_percent_change >= 0 ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down'"
              v-tooltip.bottom="{
                value: userStatistics.reminders_percent_change >= 0
                  ? `Aumento de ${Math.abs(userStatistics.reminders_percent_change).toFixed(1)}% em lembretes criados comparado ao mês passado (${userStatistics.reminders_created_last_month} → ${userStatistics.reminders_created_this_month})`
                  : `Diminuição de ${Math.abs(userStatistics.reminders_percent_change).toFixed(1)}% em lembretes criados comparado ao mês passado (${userStatistics.reminders_created_last_month} → ${userStatistics.reminders_created_this_month})`,
                showDelay: 300,
                hideDelay: 200,
                class: 'text-xs'
              }">
              {{ Math.abs(userStatistics.reminders_percent_change).toFixed(1) }}%
            </Tag>
            <span v-else class="text-xs text-gray-400">-</span>
          </div>
        </template>
      </Card>
    </div>

    <DataTable ref="dt" :value="users" dataKey="userID" class="style-table" scrollable scrollHeight="flex">
      <template #header>
        <Toolbar class="border-0!">
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
      </template>
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
      userStatistics: [],
      userDrawerVisible: false,
      drawerMode: 'view',
    }
  },
  watch: {},
  mounted() {
    this.getUserData()
    this.loadUsersStatistics()
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
    async loadUsersStatistics() {
      const response = await safeGet(
        axios.get('http://localhost:3000/aux/stats/users/statistics'),
        null
      );
      this.userStatistics = response[0];
      console.log('loadUsersStatistics:', response[0]);
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
