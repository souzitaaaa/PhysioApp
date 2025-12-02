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
      <template #center>
        <Button icon="fa-solid fa-download" severity="secondary" text @click="exportCSV($event)" size="small"
          v-tooltip.bottom="{ value: 'Exportar Informação', showDelay: 500, hideDelay: 250 }" />
      </template>
      <template #end>
        <Button icon="fa-solid fa-plus" class="mr-2" severity="success" label="Criar Atleta" size="small" />
      </template>
    </Toolbar>

    <DataTable ref="dt" :value="athletes" dataKey="athletesID" class="style-table">
      <Column header="Nome" style="min-width: 16rem">
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <Avatar :image="data.pfp" class="mr-2" style="background-color: #ece9fc; color: #2a1261" shape="circle" />
            <span>{{ data.name }}</span>
            <i v-if="data.injuredBit" class="fa-solid fa-truck-medical text-red-600 font-medium" style="font-size: 0.8rem"></i>
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
          <Button icon="fa-solid fa-eye" severity="secondary" variant="outlined" size="small"
            @click="editAthlete(slotProps.data)" />
        </template>
      </Column>
    </DataTable>
  </div>
  <AthletesDrawer :visible="athleteDrawerVisible" :athlete="selectedAthlete" @close="athleteDrawerVisible = false"></AthletesDrawer>
</template>

<script>
import { supabase } from '../../utils/supabase'
import  AthletesDrawer  from '../components/AthletesDrawer.vue'

export default {
  components: {
    AthletesDrawer
  },
  data() {
    return {
      athletes: [],
      selectedAthlete: null,
      athleteDrawerVisible: false
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
    editAthlete(athleteData) {
      this.selectedAthlete = athleteData
      this.athleteDrawerVisible = true
    }
  },
}
</script>
