<template>
  <div class="flex flex-col h-full overflow-hidden">
    <DataView ref="dt" :value="filteredEmail" dataKey="emailID" class="email-table" scrollable scrollHeight="flex">
      <!-- HEADER -->
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

            <Button icon="fa-solid fa-gear" class="mr-2" severity="secondary" size="small" @click="connectGmail" />
          </template>
        </Toolbar>
      </template>

      <!-- LISTA -->
      <template #list="slotProps">
        <div class="flex flex-col overflow-y-auto" style="max-height: calc(100vh - 140px);">
          <div v-for="item in slotProps.items" :key="item.emailID"
            class="col-12 p-2 rounded-lg border border-slate-300 my-2">
            <!-- HEADER EMAIL -->
            <div class="flex justify-between items-start mb-3">
              <div class="flex items-center gap-3 flex-1">
                <Avatar v-if="item.athlete_pfp" :image="item.athlete_pfp" shape="circle" />
                <Avatar v-else :label="item.athlete_name?.charAt(0) || '?'" shape="circle"
                  style="background-color: var(--color-primary); color: white;" class="font-bold text-sm" />

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

            <!-- ASSUNTO -->
            <div class="mb-2 flex gap-2">
              <span class="font-semibold text-gray-700" style="min-width: 80px;">Assunto:</span>
              <span class="font-medium flex-1">
                {{ item.subject || 'Sem Assunto' }}
              </span>
            </div>

            <!-- CONTEÚDO -->
            <div class="mb-3 flex gap-2">
              <span class="font-semibold text-gray-700" style="min-width: 80px;">Conteúdo:</span>
              <div class="text-gray-600 break-words overflow-hidden flex-1">
                <div class="line-clamp-3">
                  {{ item.body || 'Sem Conteúdo' }}
                </div>
              </div>
            </div>

            <!-- BOTÃO -->
            <div class="flex justify-end">
              <Button label="Relatório Completo" size="small" icon="fa-solid fa-eye" iconPos="right"
                @click="viewEmailDrawer(item)" />
            </div>
          </div>
        </div>
      </template>

      <!-- EMPTY -->
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

  <EmailDrawer :visible="emailDrawerVisible" :email="selectedEmail" :mode="drawerMode" @close="closeDrawer"
    @update-email="updateEmail" @update:mode="drawerMode = $event" />
</template>

<script>
import EmailDrawer from './EmailComponents/EmailDrawer.vue'
import api from '../../utils/apiUtils'

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
      searchTerm: ''
    }
  },

  mounted() {
    this.getEmailData()
    this.getEmailErrorCount()
  },

  methods: {
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

    async getEmailErrorCount() {
      try {
        const response = await api.get('/emails/error_count')
        this.errorCount = response.data.count
      } catch {
        this.errorCount = 0
      }
    },

    applyFilter() {
      const term = this.searchTerm.toLowerCase().trim()

      let result = this.email

      // Filtro de erros
      if (this.showOnlyErrors) {
        result = result.filter(e => e.statusID === 1)
      }

      // Filtro de texto (procura por tudo)
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

    toggleErrorFilter() {
      this.showOnlyErrors = !this.showOnlyErrors
      this.applyFilter()
    },

    viewEmailDrawer(email) {
      this.selectedEmail = email
      this.drawerMode = 'view'
      this.emailDrawerVisible = true
    },

    async closeDrawer() {
      this.selectedEmail = null
      this.drawerMode = 'view'
      this.emailDrawerVisible = false
      await this.getEmailData()
    },

    async updateEmail(formData, callback) {
      await api.put(`/emails/${formData.injuryRecordID}`, formData)
      if (callback) await callback()
      await this.getEmailData()
      await this.getEmailErrorCount()
      this.closeDrawer()
    },

    async connectGmail() {
      const response = await api.get('/gmail/auth')
      if (response.data?.url) {
        window.location.href = response.data.url
      }
    }
  }
}
</script>
