<template>
  <div class="flex flex-col h-full overflow-hidden">
    <DataView ref="dt" :value="email" dataKey="emailID" class="email-table" scrollable scrollHeight="flex">
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
            <Tag severity="danger" class="mr-8">
              Emails com erro [{{ errorCount }}]
            </Tag>
            <Button icon="fa-solid fa-gear" class="mr-2" severity="secondary" size="small" />
          </template>
        </Toolbar>
      </template>
      <template #list="slotProps">
        <div class="flex flex-col overflow-y-auto" style="max-height: calc(100vh - 200px);">
          <div v-for="(item, index) in slotProps.items" :key="item.emailID"
            class="col-12 p-2 rounded-lg border border-slate-300 my-2">

            <!-- Header -->
            <div class="flex justify-between items-start mb-3">
              <div class="flex items-center gap-3 flex-1">
                <Avatar v-if="item.athlete_pfp" :image="item.athlete_pfp" shape="circle" />
                <Avatar v-else :label="item.athlete_name?.charAt(0) || '?'" shape="circle"
                  style="background-color: var(--color-primary); color: white;" class="font-bold text-sm" />
                <div class="flex flex-col flex-1">
                  <div class="font-semibold text-base">{{ item.athlete_name || 'N/A' }}</div>
                  <div class="flex items-end justify-start gap-2">
                    <div class="text-sm text-gray-600">{{ item.from }}</div>
                    <span class="text-xs text-gray-600">({{ item.date }})</span>
                  </div>
                </div>
              </div>
              <div class="flex flex-col items-end gap-2">
                <Tag v-if="item.status" :value="item.status" :severity="item.statusID === 1 ? 'danger' :
                  item.statusID === 2 ? 'success' :
                    item.statusID === 3 ? 'warn' :
                      item.statusID === 4 ? 'info' :
                        'info'" />
              </div>
            </div>

            <!-- Subject -->
            <div class="mb-2 flex gap-2">
              <span class="font-semibold text-gray-700" style="min-width: 80px;">Assunto:</span>
              <span class="font-medium flex-1">{{ item.subject || 'Sem Assunto' }}</span>
            </div>

            <!-- Body Preview -->
            <div class="mb-3 flex gap-2">
              <span class="font-semibold text-gray-700" style="min-width: 80px;">Conteúdo:</span>
              <div class="text-gray-600 line-height-3 break-words overflow-hidden flex-1">
                <div class="line-clamp-3">
                  {{ item.body || 'Sem Conteúdo' }}
                </div>
              </div>
            </div>

            <!-- Ver Mais Button -->
            <div class="flex justify-end">
              <Button label="Relatório Completo" size="small" icon="fa-solid fa-eye" iconPos="right"
                @click="viewEmailDrawer(item)" />
            </div>

          </div>
        </div>
      </template>
      <template #empty>
        <div class="flex flex-col items-center justify-center gap-3 p-6 h-full">
          <i class="fa-solid fa-inbox text-4xl text-gray-400"></i>
          <span class="text-base text-gray-600">Nenhum email encontrado</span>
        </div>
      </template>
    </DataView>
  </div>
</template>

<script>
import { supabase } from '../../utils/supabase'
import { safeGet } from '../../utils/utils.js'
import axios from 'axios';

export default {
  data() {
    return {
      email: [],
      expandedIndex: null,
      emailDrawerVisible: false,
      drawerMode: 'view',
      errorCount: 0,
      selectedEmail: null,
    }
  },
  mounted() {
    this.getEmailData()
    this.getEmailErrorCount()
  },
  methods: {
    async getEmailData() {
      const data = await safeGet(
        axios.get('http://localhost:3000/emails/'),
        []
      );
      this.email = data
    },
    async getEmailErrorCount() {
      const data = await safeGet(
        axios.get('http://localhost:3000/emails/error_count'),
        { count: 0 }
      );

      this.errorCount = data.count
    },
    toggleExpand(index) {
      this.expandedIndex = this.expandedIndex === index ? null : index
    },
    async closeDrawer() {
      this.selectedEmail = null
      this.drawerMode = 'view'
      this.emailDrawerVisible = false
      await this.getEmailData()
    },
    viewEmailDrawer(email) {
      this.selectedEmail = email
      this.drawerMode = 'view'
      this.emailDrawerVisible = true
    },
    exportCSV() {
      this.$refs.dt.exportCSV()
    },
  },
}
</script>