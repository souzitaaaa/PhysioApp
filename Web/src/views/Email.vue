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
        <Button icon="fa-solid fa-gear" class="mr-2" severity="secondary" size="small" />
      </template>
    </Toolbar>

    <DataTable ref="dt" :value="emails" dataKey="emailID" class="email-table">
      <Column class="subject-column">
        <template #body="{ data, index }">
          <div
            class="flex flex-col p-5 table-email"
            :class="{ 'expanded': expandedIndex === index }"
            @click="toggleExpand(index)"
          >
            <div class="flex justify-between items-center">
              <span>{{ data.sender }}</span>
              <span>{{ data.dateSended }}</span>
            </div>

            <div class="text-small-grey subject mt-2">
              {{ data.subject }}
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
    }
  },
  mounted() {
    this.getEmailData()
  },
  methods: {
    async getEmailData() {
      const { data } = await supabase.from('t_email').select(`*`)
      this.emails = data
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
