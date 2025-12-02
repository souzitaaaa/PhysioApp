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
        <template #body="{ data }">
          <div class="flex flex-col p-5 table-email">
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
  components: {},
  data() {
    return {
      emails: [],
    }
  },
  watch: {},
  mounted() {
    this.getEmailData()
  },
  methods: {
    async getEmailData() {
      const { data } = await supabase.from('t_email').select(`*`)
      this.emails = data
    },
    exportCSV() {
      this.$refs.dt.exportCSV()
    },
  },
}
</script>
