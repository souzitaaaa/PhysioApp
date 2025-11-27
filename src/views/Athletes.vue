<template>
  <div>
    <Toolbar class="mb-4">
      <template #start>
        <IconField>
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText placeholder="Procurar" size="small" />
        </IconField>
      </template>
      <template #center>
        <Button
          icon="pi pi-upload"
          severity="secondary"
          text
          @click="exportCSV($event)"
          size="small"
          v-tooltip.bottom="{ value: 'Exportar Informação', showDelay: 500, hideDelay: 250 }"
        />
      </template>
      <template #end>
        <Button
          icon="pi pi-plus"
          class="mr-2"
          severity="success"
          label="Criar Atleta"
          size="small"
        />
      </template>
    </Toolbar>

    <DataTable ref="dt" :value="athletes" dataKey="athletesID">
      <Column header="Nome" style="min-width: 16rem">
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <Avatar
              icon="pi pi-user"
              class="mr-2"
              style="background-color: #ece9fc; color: #2a1261"
              shape="circle"
            />
            <span>{{ data.name }}</span>
          </div>
        </template>
      </Column>
      <Column field="taux_division.division" header="Escalão"></Column>
      <Column header="Idade">
        <template #body="{ data }">
          <div class="flex flex-col">
            <span class="">(calcular idade)</span>
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
          <Button
          icon="pi pi-eye"
          severity="secondary"
          variant="outlined"
          size="small"
          @click="editProduct(slotProps.data)"
          />
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
      athletes: [],
    }
  },
  watch: {},
  mounted() {
    this.getAthleteData()
  },
  methods: {
    async getAthleteData() {
      const { data } = await supabase.from('t_athlete').select(`*,
                                      taux_division ( division )`)
      this.athletes = data
    },
    exportCSV() {
      this.$refs.dt.exportCSV()
    },
  },
}
</script>
