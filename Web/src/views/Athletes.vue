<template>
  <div class="flex flex-col h-full overflow-hidden">
    <span class="text-xs font-medium text-gray-600 px-1 pb-1">Estatísticas mensais</span>
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
      <!-- Health Overview Card -->
      <Card class="shadow-md! border border-slate-300 lg:col-span-1 bg-gray-150! h-24">
        <template #content>
          <div class="flex items-center gap-2 mb-2">
            <i class="text-sm font-bold fa-solid fa-heart-pulse text-gray-700"></i>
            <span class="text-sm font-bold text-gray-700">Saudáveis</span>
          </div>
          <div class="px-2 flex items-center justify-between">
            <span class="text-2xl font-bold text-gray-800">
              {{ athleteStatistics?.healthy_athletes_current ?? '-' }}
            </span>
            <Tag v-if="athleteStatistics?.healthy_athletes_percent_change !== null &&
              athleteStatistics?.healthy_athletes_percent_change !== undefined &&
              !isNaN(athleteStatistics?.healthy_athletes_percent_change)"
              :severity="athleteStatistics.healthy_athletes_percent_change >= 0 ? 'success' : 'danger'"
              :icon="athleteStatistics.healthy_athletes_percent_change >= 0 ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down'"
              v-tooltip.bottom="{
                value: athleteStatistics.healthy_athletes_percent_change >= 0
                  ? `Aumento de ${Math.abs(athleteStatistics.healthy_athletes_percent_change).toFixed(1)}% em atletas saudáveis comparado ao mês passado (${athleteStatistics.healthy_athletes_last_month} → ${athleteStatistics.healthy_athletes_current})`
                  : `Diminuição de ${Math.abs(athleteStatistics.healthy_athletes_percent_change).toFixed(1)}% em atletas saudáveis comparado ao mês passado (${athleteStatistics.healthy_athletes_last_month} → ${athleteStatistics.healthy_athletes_current})`,
                showDelay: 300,
                hideDelay: 200,
                class: 'text-xs'
              }">
              {{ Math.abs(athleteStatistics.healthy_athletes_percent_change).toFixed(1) }}%
            </Tag>
            <span v-else class="text-xs text-gray-400">-</span>
          </div>
        </template>
      </Card>

      <!-- Injured Athletes Card -->
      <Card class="shadow-md! border border-slate-300 lg:col-span-1 bg-gray-150! h-24">
        <template #content>
          <div class="flex items-center gap-2 mb-2">
            <i class="text-sm font-bold fa-solid fa-suitcase-medical text-gray-700"></i>
            <span class="text-sm font-bold text-gray-700">Lesionados</span>
          </div>
          <div class="px-2 flex items-center justify-between">
            <span class="text-2xl font-bold text-gray-800">
              {{ athleteStatistics?.injured_athletes_current ?? '-' }}
            </span>
            <Tag v-if="athleteStatistics?.injured_athletes_percent_change !== null &&
              athleteStatistics?.injured_athletes_percent_change !== undefined &&
              !isNaN(athleteStatistics?.injured_athletes_percent_change)"
              :severity="athleteStatistics.injured_athletes_percent_change <= 0 ? 'success' : 'danger'"
              :icon="athleteStatistics.injured_athletes_percent_change <= 0 ? 'fa-solid fa-arrow-down' : 'fa-solid fa-arrow-up'"
              v-tooltip.bottom="{
                value: athleteStatistics.injured_athletes_percent_change >= 0
                  ? `Aumento de ${Math.abs(athleteStatistics.injured_athletes_percent_change).toFixed(1)}% em atletas lesionados comparado ao mês passado (${athleteStatistics.injured_athletes_last_month} → ${athleteStatistics.injured_athletes_current})`
                  : `Diminuição de ${Math.abs(athleteStatistics.injured_athletes_percent_change).toFixed(1)}% em atletas lesionados comparado ao mês passado (${athleteStatistics.injured_athletes_last_month} → ${athleteStatistics.injured_athletes_current})`,
                showDelay: 300,
                hideDelay: 200,
                class: 'text-xs'
              }">
              {{ Math.abs(athleteStatistics.injured_athletes_percent_change).toFixed(1) }}%
            </Tag>
            <span v-else class="text-xs text-gray-400">-</span>
          </div>
        </template>
      </Card>

      <!-- Injury Records Card -->
      <Card class="shadow-md! border border-slate-300 lg:col-span-1 bg-gray-150! h-24">
        <template #content>
          <div class="flex items-center gap-2 mb-2">
            <i class="text-sm font-bold fa-solid fa-book-medical text-gray-700"></i>
            <span class="text-sm font-bold text-gray-700">Registos</span>
          </div>
          <div class="px-2 flex items-center justify-between">
            <span class="text-2xl font-bold text-gray-800">
              {{ athleteStatistics?.injuries_this_month ?? '-' }}
            </span>
            <Tag v-if="athleteStatistics?.injuries_this_month_percent_change !== null &&
              athleteStatistics?.injuries_this_month_percent_change !== undefined &&
              !isNaN(athleteStatistics?.injuries_this_month_percent_change)"
              :severity="athleteStatistics.injuries_this_month_percent_change >= 0 ? 'danger' : 'success'"
              :icon="athleteStatistics.injuries_this_month_percent_change >= 0 ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down'"
              v-tooltip.bottom="{
                value: athleteStatistics.injuries_this_month_percent_change >= 0
                  ? `Aumento de ${Math.abs(athleteStatistics.injuries_this_month_percent_change).toFixed(1)}% em novos registos de lesões este mês comparado ao mês passado (${athleteStatistics.injuries_last_month} → ${athleteStatistics.injuries_this_month})`
                  : `Diminuição de ${Math.abs(athleteStatistics.injuries_this_month_percent_change).toFixed(1)}% em novos registos de lesões este mês comparado ao mês passado (${athleteStatistics.injuries_last_month} → ${athleteStatistics.injuries_this_month})`,
                showDelay: 300,
                hideDelay: 200,
                class: 'text-xs'
              }">
              {{ Math.abs(athleteStatistics.injuries_this_month_percent_change).toFixed(1) }}%
            </Tag>
            <span v-else class="text-xs text-gray-400">-</span>
          </div>
        </template>
      </Card>

      <!-- Total Athletes Card -->
      <Card class="shadow-md! border border-slate-300 lg:col-span-1 bg-gray-150! h-24">
        <template #content>
          <div class="flex items-center gap-2 mb-2">
            <i class="text-sm font-bold fa-solid fa-users text-gray-700"></i>
            <span class="text-sm font-bold text-gray-700">Total</span>
          </div>
          <div class="px-2 flex items-center justify-between">
            <span class="text-2xl font-bold text-gray-800">
              {{ athleteStatistics?.total_athletes ?? '-' }}
            </span>
          </div>
        </template>
      </Card>
    </div>

    <DataTable ref="dt" v-model:filters="filters" :value="athletes" stripedRows dataKey="athleteID"
      class="style-table shadow-md!" paginator :rows="9" scrollable scrollHeight="flex" :filters="filters"
      filterDisplay="menu" :globalFilterFields="['name', 'email']">
      <template #header>
        <Toolbar class="border-0!">
          <template #start>
            <IconField>
              <InputIcon>
                <i class="fa-solid fa-magnifying-glass" />
              </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Procurar (nome ou email)" size="small" />
            </IconField>
          </template>
          <template #center>
            <Button v-if="1 == true" icon="fa-solid fa-download" severity="secondary" text @click="exportCSV($event)"
              size="small" v-tooltip.bottom="{ value: 'Exportar Informação', showDelay: 500, hideDelay: 250 }" />
          </template>
          <template #end>
            <Button icon="fa-solid fa-plus" class="mr-2" severity="success" label="Criar Atleta" size="small"
              @click="createAthleteDrawer" />
          </template>
        </Toolbar>

      </template>
      <Column field="name" header="Nome" style="width: 30%">
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <Avatar :image="data.pfp" class="mr-2" style="background-color: #ece9fc; color: #2a1261" shape="circle" />
            <span>{{ data.name }}</span>
            <i v-if="data.injuredBit" class="fa-solid fa-truck-medical text-red-600 font-medium"
              style="font-size: 0.8rem"></i>
          </div>
        </template>
      </Column>
      <Column field="division" header="Escalão" filterField="division" :showFilterMatchModes="false"
        :showFilterOperator="false" :showAddButton="false" :filterMenuStyle="{ width: '8rem' }" style="width: 10%">
        <template #body="{ data }">
          {{ data.division }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <MultiSelect v-model="filterModel.value" :options="uniqueDivisions" placeholder="Selecionar" showClear
            @change="filterCallback()" class="p-column-filter" size="small">
          </MultiSelect>
        </template>
      </Column>
      <Column field="age" header="Idade" style="width: 10%">
        <template #body="{ data }">
          <div class="flex flex-col">
            <span class="">{{ data.age }}</span>
            <span class="text-xs">{{ data.birthdate }}</span>
          </div>
        </template>
      </Column>
      <Column field="country_name" header="País" style="width: 10%">
        <template #body="{ data }">
          <div class="card flex justify-start">
            <Tag class="bg-transparent!">
              <div class="flex items-center gap-2 px-1">
                <img alt="Country" :src='data.country_flag' class="flag flag-it" style="width: 18px" />
                <span class="text-sm">{{ data.country_name }}</span>
              </div>
            </Tag>
          </div>
        </template>
      </Column>
      <Column field="email" header="Contactos">
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
import { uploadImageToSupabase, getStoragePathFromUrl } from '../../utils/utils'
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
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
      athleteStatistics: [],
      selectedAthlete: null,
      athleteDrawerVisible: false,
      filters: {},
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
    },
    uniqueDivisions() {
      // Extract unique divisions from athletes array
      const divisions = this.athletes.map(a => a.division).filter(Boolean);
      return [...new Set(divisions)].sort();
    }
  },
  created() {
    this.initFilters();
  },
  watch: {
  },
  mounted() {
    this.getAthleteData()
    this.loadAthletesStatistics()
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
    async loadAthletesStatistics() {
      const response = await safeGet(
        axios.get('http://localhost:3000/aux/stats/athletes/statistics'),
        null
      );
      this.athleteStatistics = response[0];
    },
    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        division: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.IN }
          ]
        }
      }
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
            countryID: formData.countryID,
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

      if (formData.pfp instanceof File) {

        const { data: oldAthlete } = await supabase
          .from('t_athlete')
          .select('pfp')
          .eq('athleteID', formData.athleteID)
          .single();

        if (oldAthlete?.pfp) {
          const oldPath = getStoragePathFromUrl(oldAthlete.pfp);

          if (oldPath) {
            await supabase.storage
              .from('athlete-images')
              .remove([oldPath]);
          }
        }

        pfpUrl = await uploadImageToSupabase(formData.pfp, "athlete-images");
      }

      const { data, error } = await supabase
        .from('t_athlete')
        .update({
          name: formData.name,
          birthdate: formData.birthdate,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          pfp: pfpUrl,
          countryID: formData.countryID,
          divisionID: formData.divisionID,
        })
        .eq('athleteID', formData.athleteID)
        .select();

      if (error) {
        console.error(error);
        return;
      }

      if (callback) await callback();

      await this.getAthleteData();
    },
  },
}
</script>