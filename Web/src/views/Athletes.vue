<template>
  <div class="flex flex-col h-full overflow-hidden">

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
      <!-- Health Overview Card -->
      <Card class="shadow-md! border border-slate-300 lg:col-span-1 bg-gray-150! h-48">
        <template #content>
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-chart-pie text-black"></i>
            <span class="text-sm font-bold text-gray-700">Estado de Saúde dos Atletas</span>
          </div>
          <div class="px-2 flex flex-col justify-center items-center h-full">
            <HealthPieChart v-if="healthOverview" :chartData="healthOverview" :height="120" />
            <div v-else class="flex items-center justify-center h-28 text-gray-400">
              <i class="fa-solid fa-spinner fa-spin text-2xl"></i>
            </div>
          </div>
        </template>
      </Card>


      <!-- Placeholder Cards -->
      <Card class="shadow-md lg:col-span-1 bg-amber-200! h-48"></Card>
      <Card class="shadow-md lg:col-span-1 bg-amber-200! h-48"></Card>
      <Card class="shadow-md! border border-slate-300 lg:col-span-1 bg-gray-150! h-48">
        <template #content>
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-calendar text-black"></i>
            <span class="text-sm font-bold text-gray-700">Lesões nos Últimos 12 Meses</span>
          </div>
          <div class="px-2 flex flex-col justify-center items-center h-full">
            <MonthlyInjuriesChart v-if="injuriesByMonth" :chartData="injuriesByMonth" :height="120" />
            <div v-else class="flex items-center justify-center h-28 text-gray-400">
              <i class="fa-solid fa-spinner fa-spin text-2xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Stats Cards Section -->
    <!-- <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
      <Card class="shadow-md lg:col-span-1">
        <template #title>
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-chart-bar text-purple-500"></i>
            <span class="text-lg">Distribuição de Lesões por Escalão</span>
          </div>
        </template>
<template #content>
          <DivisionInjuryChart v-if="divisionStats.length > 0" :divisionData="divisionStats" :height="280" />
          <div v-else class="flex items-center justify-center h-64 text-gray-400">
            <i class="fa-solid fa-spinner fa-spin text-2xl"></i>
          </div>
        </template>
</Card>
</div> -->

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
        <Button v-if="1 === true" icon="fa-solid fa-download" severity="secondary" text @click="exportCSV($event)"
          size="small" v-tooltip.bottom="{ value: 'Exportar Informação', showDelay: 500, hideDelay: 250 }" />
      </template>
      <template #end>
        <Button icon="fa-solid fa-plus" class="mr-2" severity="success" label="Criar Atleta" size="small"
          @click="createAthleteDrawer" />
      </template>
    </Toolbar>

    <DataTable ref="dt" :value="athletes" stripedRows dataKey="athleteID" class="style-table" paginator :rows="10"
      scrollable scrollHeight="flex">
      <Column header="Nome" style="min-width: 16rem">
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <Avatar :image="data.pfp" class="mr-2" style="background-color: #ece9fc; color: #2a1261" shape="circle" />
            <span>{{ data.name }}</span>
            <i v-if="data.injuredBit" class="fa-solid fa-truck-medical text-red-600 font-medium"
              style="font-size: 0.8rem"></i>
          </div>
        </template>
      </Column>
      <Column field="division" header="Escalão"></Column>
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
            @click="editAthlete(slotProps.data)" />
        </template>
      </Column>
    </DataTable>
  </div>
  <AthletesDrawer :visible="athleteDrawerVisible" :athlete="selectedAthlete" :mode="drawerMode" @close="closeDrawer"
    @add-athlete="handleAddAthlete" @update-athlete="updateAthlete" @update:mode="drawerMode = $event"></AthletesDrawer>
</template>

<script>
import { supabase } from '../../utils/supabase'
import AthletesDrawer from './AthleteComponents/AthletesDrawer.vue'
import HealthPieChart from './AthleteComponents/HealthPieChart.vue'
import MonthlyInjuriesChart from './AthleteComponents/MonthlyInjuriesChart.vue'
import { uploadImageToSupabase } from '../../utils/utils'
import axios from 'axios';
import { safeGet } from '../../utils/utils.js'

export default {
  components: {
    AthletesDrawer,
    HealthPieChart,
    MonthlyInjuriesChart
  },
  data() {
    return {
      athletes: [],
      healthOverview: [],
      injuriesByMonth: [],
      selectedAthlete: null,
      athleteDrawerVisible: false,
      drawerMode: 'view',
    }
  },
  computed: {
    totalAthletes() {
      return this.athletes.length
    },
    healthyAthletes() {
      return this.athletes.filter(a => !a.injuredBit).length
    },
    injuredAthletes() {
      return this.athletes.filter(a => a.injuredBit).length
    }
  },
  watch: {},
  mounted() {
    this.getAthleteData()
    this.loadHealthOverview()
    this.loadInjuriesByMonth()
  },
  methods: {
    async getAthleteData(athleteID) {
      const endpoint = athleteID
        ? `http://localhost:3000/athletes/${athleteID}`
        : `http://localhost:3000/athletes`;

      const data = await safeGet(axios.get(endpoint), athleteID ? null : []);

      if (athleteID) return data;

      this.athletes = data;
    },
    async loadHealthOverview() {
      const response = await safeGet(
        axios.get('http://localhost:3000/aux/stats/athleteSummary'),
        null
      );
      this.healthOverview = response[0];
      console.log('Health Overview:', response[0]);
    },
    async loadInjuriesByMonth() {
      const response = await safeGet(
        axios.get('http://localhost:3000/aux/stats/injuriesByMonth'),
        null
      );
      this.injuriesByMonth = response;
    },
    exportCSV() {
      this.$refs.dt.exportCSV()
    },
    async closeDrawer() {
      this.selectedAthlete = null
      this.drawerMode = 'view'
      this.athleteDrawerVisible = false
      await this.getAthleteData();
    },
    createAthleteDrawer() {
      this.selectedAthlete = null
      this.drawerMode = 'add'
      this.athleteDrawerVisible = true
    },
    editAthlete(athleteData) {
      this.selectedAthlete = athleteData
      this.drawerMode = 'view'
      this.athleteDrawerVisible = true
    },
    async handleAddAthlete(payload, callback) {
      const athleteID = await this.addAthlete(payload);
      if (callback) callback(athleteID);
    },
    async addAthlete(formData) {
      const pfpUrl =
        formData.pfp instanceof File
          ? await uploadImageToSupabase(formData.pfp, "athlete-images")
          : formData.pfp || null

      const { data, error } = await supabase
        .from('t_athlete')
        .insert([
          {
            name: formData.name,
            birthdate: formData.birthdate,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            pfp: pfpUrl,
            nationality: formData.nationality,
            divisionID: formData.divisionID,
          },
        ])
        .select(`athleteID`)

      if (error) {
        console.log(error)
        //! NAO ESQUECER TOASTER
        return
      }

      const newAthlete = await this.getAthleteData(data[0].athleteID)
      await this.getAthleteData()

      this.selectedAthlete = newAthlete
      this.drawerMode = 'view'
      this.athleteDrawerVisible = true

      return data[0].athleteID
    },
    async updateAthlete(formData, callback) {
      let pfpUrl = formData.pfp;

      if (formData.pfp instanceof File)
        pfpUrl = await uploadImageToSupabase(formData.pfp, "athlete-images");

      const { data, error } = await supabase.from('t_athlete').update([
        {
          name: formData.name,
          birthdate: formData.birthdate,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          pfp: pfpUrl,
          nationality: formData.nationality,
          divisionID: formData.divisionID,
        },
      ])
        .eq('athleteID', formData.athleteID)
        .select()

      if (error) {
        console.log(error)
        return
      }

      if (callback)
        await callback();

      const newAthlete = await this.getAthleteData(data[0].athleteID)

      await this.getAthleteData()

      this.selectedAthlete = newAthlete
      this.drawerMode = 'view'
      this.athleteDrawerVisible = true

    },
  },
}
</script>
