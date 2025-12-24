<template>
  <div class="flex flex-col h-full overflow-hidden">
    <Toolbar class="mb-4 border-0!">
      <template #start>
        <IconField>
          <InputIcon>
            <i class="fa-solid fa-magnifying-glass" />
          </InputIcon>
          <InputText placeholder="Procurar" size="small" />
        </IconField>
      </template>
      <template #end>
        <!-- Tag com número de emails com erro -->
        <Tag severity="danger" class="mr-8">
          Emails com erro [{{ errorCount }}]
        </Tag>
        <Button icon="fa-solid fa-gear" class="mr-2" severity="secondary" size="small" />
      </template>
    </Toolbar>

    <DataTable ref="dt" :value="emails" dataKey="emailID" class="email-table" scrollable scrollHeight="flex">
      <Column class="subject-column">
        <template #body="{ data, index }">
          <div class="flex flex-col p-5 table-email" :class="{ 'expanded': expandedIndex === index }"
            @click="toggleExpand(index)">
            <div class="flex justify-between items-center">
              <span>{{ data.from }}</span> 
              <span>{{ data.date }}</span>
            </div>

            <div class="text-small-grey subject mt-2">
              {{ data.body }}
            </div>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script>
import { supabase } from '../../utils/supabase'

export default {
  data() {
    return {
      emails: [],
      expandedIndex: null,
      errorCount: 0,
    }
  },
  mounted() {
    this.getEmailData()
    this.getEmailErrorCount() 
  },
  methods: {
    async getEmailData() {
      const { data, error } = await supabase.from('t_email').select('*')
      if (!error) this.emails = data
    },
    async getEmailErrorCount() {
      const { count, error } = await supabase
        .from('t_injury_record')
        .select('*', { count: 'exact', head: true })
        .eq('statusID', 1)

      if (!error) {
        this.errorCount = count
      } else {
        console.error('Erro ao buscar emails com erro:', error.message)
      }
    },
    toggleExpand(index) {
      this.expandedIndex = this.expandedIndex === index ? null : index
    },
    exportCSV() {
      this.$refs.dt.exportCSV()
    },
  },
}
</script>
