<template>
  <div class="flex flex-col h-full overflow-hidden">
    <!-- Email DataView component -->
    <DataView ref="dt" :value="filteredEmail" dataKey="emailID" class="email-table" scrollable scrollHeight="flex">
      
      <!-- Header -->
      <template #header>
        <Toolbar class="border-0!">
          <template #start>
            <IconField>
              <InputIcon>
                <i class="fa-solid fa-magnifying-glass" />
              </InputIcon>
              <InputText v-model="searchTerm" placeholder="Procurar" size="small" @input="applyFilter" />
            </IconField>
          </template>


          <template #end>
            <Button class="mr-8" severity="danger" size="small" icon="fa-solid fa-triangle-exclamation"
              :outlined="!showOnlyErrors" :label="`Emails com erro [${errorCount}]`" @click="toggleErrorFilter" />

            <Button icon="fa-brands fa-google" class="mr-2" :severity="gmailConnected ? 'success' : 'danger'"
              size="small" :label="gmailConnected ? 'Gmail Conectado' : 'Conectar Gmail'" :disabled="gmailConnected"
              @click="connectGmail" />
          </template>
        </Toolbar>
      </template>

      <!-- Email list -->
      <template #list="slotProps">
        <div class="flex flex-col overflow-y-auto" style="max-height: calc(100vh - 140px);">
          <div v-for="item in slotProps.items" :key="item.emailID"
            class="col-12 p-2 rounded-lg border border-slate-300 my-2">

            <!-- Email header -->
            <div class="flex justify-between items-start mb-3">
              <div class="flex items-center gap-3 flex-1">
                <Avatar v-if="item.athlete_pfp" :image="item.athlete_pfp" shape="circle" class="mr-2 avatar-circle" />
                <Avatar v-else :label="item.athlete_name?.charAt(0) || '?'" shape="circle"
                  style="background-color: var(--color-primary); color: white;" class="font-bold text-sm" />

                <!-- Athlete info -->
                <div class="flex flex-col flex-1">
                  <div class="font-semibold text-base">
                    {{ item.athlete_name || 'N/A' }}
                  </div>
                  <div class="flex items-end gap-2">
                    <div class="text-sm text-gray-600">{{ item.from }}</div>
                    <span class="text-xs text-gray-600">({{ item.date }})</span>
                  </div>
                </div>
              </div>

              <Tag v-if="item.status" :value="item.statusID === 1 ? `Error: ${item.error}` : item.status" :severity="item.statusID === 1
                ? 'danger'
                : item.statusID === 2
                  ? 'success'
                  : item.statusID === 3
                    ? 'warn'
                    : 'info'" />
            </div>

            <!-- Email subject -->
            <div class="mb-2 flex gap-2">
              <span class="font-semibold text-gray-700" style="min-width: 80px;">Assunto:</span>
              <span class="font-medium flex-1">
                {{ item.subject || 'Sem Assunto' }}
              </span>
            </div>

            <!-- Email body -->
            <div class="mb-3 flex gap-2">
              <span class="font-semibold text-gray-700" style="min-width: 80px;">Conteúdo:</span>
              <div class="text-gray-600 break-words overflow-hidden flex-1">
                <div class="line-clamp-3">
                  {{ item.body || 'Sem Conteúdo' }}
                </div>
              </div>
            </div>

            <!-- View email button -->
            <div class="flex justify-end">
              <Button label="Relatório Completo" size="small" icon="fa-solid fa-eye" iconPos="right"
                @click="viewEmailDrawer(item)" />
            </div>
          </div>
        </div>
      </template>

      <!-- Empty state -->
      <template #empty>
        <div class="flex flex-col items-center justify-center gap-3 p-6 h-full">
          <i class="fa-solid fa-inbox text-4xl text-gray-400"></i>

          <span v-if="showOnlyErrors" class="text-base text-gray-600">
            Nenhum email com erro
          </span>

          <span v-else class="text-base text-gray-600">
            Nenhum email corresponde ao filtro
          </span>
        </div>
      </template>
    </DataView>
  </div>

  <!-- Email drawer component -->
  <EmailDrawer :visible="emailDrawerVisible" :email="selectedEmail" :mode="drawerMode" @close="closeDrawer"
    @update-email="updateEmail" @update:mode="drawerMode = $event" />
</template>

<script>
import EmailDrawer from './EmailComponents/EmailDrawer.vue'
import api from '../../utils/apiUtils'
import { supabase } from '../../utils/supabase';

export default {
  components: { EmailDrawer },

  data() {
    return {
      email: [],
      filteredEmail: [],
      showOnlyErrors: false,
      emailDrawerVisible: false,
      drawerMode: 'view',
      errorCount: 0,
      selectedEmail: null,
      searchTerm: '',
      channel: null,
      gmailConnected: false
    }
  },
  mounted() {
    this.getEmailData()
    this.getEmailErrorCount()
    this.checkGmailToken()
    this.subcribeEmails()
  },
  beforeUnmount() {
    if (this.channel) {
      supabase.removeChannel(this.channel)
    }
  },
  methods: {
    // subscribe to email changes
    subcribeEmails() {
      this.channel = supabase
        .channel('emails-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            shcema: 'public',
            table: 't_email'
          },
          (payload) => {
            console.log('alteraçao:', payload)

            this.getEmailData()
            this.getEmailErrorCount()
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 't_injury_record'
          },
          (payload) => {
            console.log('Injury Record alterado:', payload)
            this.getEmailData() // ou alguma função específica de injury record
            this.getEmailErrorCount()
          }
        )
        .subscribe()
    },

    // check Gmail token
    async checkGmailToken() {
      try {
        const response = await api.get('/gmail/check-token')
        this.gmailConnected = response.data.connected && !response.data.expired
      } catch (error) {
        console.error('Error checking Gmail token:', error)
        this.gmailConnected = false
      }
    },

    // fetch all emails
    async getEmailData() {
      try {
        const response = await api.get('/emails')
        this.email = response.data
        this.applyFilter()
      } catch {
        this.email = []
        this.filteredEmail = []
      }
    },

    // fetch email error count
    async getEmailErrorCount() {
      try {
        const response = await api.get('/emails/error_count')
        console.log("getEmailErrorCount: ", response.data.count)
        this.errorCount = response.data.count
      } catch {
        this.errorCount = 0
      }
    },

    // apply search and error filters
    applyFilter() {
      const term = this.searchTerm.toLowerCase().trim()

      let result = this.email

      if (this.showOnlyErrors) {
        result = result.filter(e => e.statusID === 1)
      }

      if (term) {
        result = result.filter(e =>
          [
            e.athlete_name,
            e.from,
            e.subject,
            e.body,
            e.status,
            e.error
          ]
            .filter(Boolean)
            .some(field =>
              field.toString().toLowerCase().includes(term)
            )
        )
      }

      this.filteredEmail = result
    },

    // toggle error filter
    toggleErrorFilter() {
      this.showOnlyErrors = !this.showOnlyErrors
      this.applyFilter()
    },

    // open email drawer
    viewEmailDrawer(email) {
      this.selectedEmail = email
      this.drawerMode = 'view'
      this.emailDrawerVisible = true
    },

    // close email drawer
    async closeDrawer() {
      this.selectedEmail = null
      this.drawerMode = 'view'
      this.emailDrawerVisible = false
      await this.getEmailData()
    },

    // update email record
    async updateEmail(formData, callback) {
      await api.put(`/emails/${formData.injuryRecordID}`, formData)
      if (callback) await callback()
      await this.getEmailData()
      await this.getEmailErrorCount()
      this.closeDrawer()
    },

    // connect Gmail
    async connectGmail() {
      const response = await api.get('/gmail/auth')
      if (response.data?.url) {
        window.location.href = response.data.url
      }
    }
  }
}
</script>
