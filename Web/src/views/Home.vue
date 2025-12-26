<template>
  <div class="overscroll-auto">
    <div class="flex h-1/2 mb-6">
      <div class="w-full">
        <DataTable ref="dt" :value="athletes" dataKey="athletesID" class="style-table h-full" paginator :rows="4"
          scrollable scrollHeight="flex" tableStyle="table-layout: fixed; width: 100%;">
          <template #header>
            <div class="flex justify-between w-full gap-2">
              <span class="text-xl font-bold">Email</span>
              <span class="text-base font-thin self-end">Ver tudo</span>
            </div>
          </template>

          <!-- Coluna de Nome e Avatar -->
          <Column field="name" header="Nome" style="width: 20%">
            <template #body="{ data }">
              <div class="flex items-center gap-2 overflow-hidden">
                <Avatar :image="data.pfp" class="mr-2 flex-shrink-0" shape="circle" />
                <div class="flex flex-col overflow-hidden">
                  <span class="truncate font-medium">{{ data.name }}</span>
                  <span class="truncate text-sm text-gray-500">
                    {{ data.taux_division?.division }}
                  </span>
                </div>
              </div>
            </template>
          </Column>

          <Column header="Email" style="width: 60%">
            <template #body="{ data }">
              <div class="overflow-hidden">
                <span class="truncate block">
                  {{ data.t_injury_record?.[0]?.resume }}
                </span>
              </div>
            </template>
          </Column>

          <Column header="Estado" style="width: 20%">
            <template #body="{ data }">
              <span class="truncate px-2 py-1 rounded" :class="{
                'bg-red-200 text-red-600': data.t_injury_record?.[0]?.taux_status?.status === 'Erro',
                'bg-green-200 text-green-600': data.t_injury_record?.[0]?.taux_status?.status === 'Fechado',
                'bg-yellow-200 text-yellow-600': data.t_injury_record?.[0]?.taux_status?.status === 'Em Andamento',
                'bg-sky-200 text-sky-600': data.t_injury_record?.[0]?.taux_status?.status === 'Por Responder'
              }">
                {{ data.t_injury_record?.[0]?.taux_status?.status }}
              </span>
            </template>
          </Column>

        </DataTable>
      </div>

    </div>
    <div class="flex h-1/2">
      <div class="w-1/2 mr-3">
        <DataTable ref="dt" :value="athletes" dataKey="athletesID" class="style-table h-full" paginator :rows="4"
          scrollable scrollHeight="flex">
          <template #header>
            <div class="flex justify-between w-full gap-2">
              <span class="text-xl font-bold">Atletas</span>
              <span class="text-base font-thin self-end">Ver tudo</span>
            </div>
          </template>
          <Column field="name" header="Nome">
            <template #body="{ data }">
              <div class="flex items-center gap-1">
                <Avatar :image="data.pfp" class="mr-2" style="background-color: #ece9fc; color: #2a1261"
                  shape="circle" />
                <div class="flex flex-col overflow-hidden">
                  <span class="truncate font-medium">{{ data.name }}</span>
                  <span class="truncate text-sm text-gray-500">
                    {{ data.taux_division?.division }}
                  </span>
                </div>
              </div>
            </template>
          </Column>
          <Column header="Conctato">
            <template #body="{ data }">
              <div class="flex flex-col">
                <span>{{ data.phoneNumber }}</span>
                <span>{{ data.email }}</span>
              </div>
            </template>
          </Column>
          <Column header="Nacionalidade">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <span>{{ data.nationality }}</span>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>

      <div class="w-1/2 ml-3">
        <DataTable ref="dt" :value="athletes" dataKey="athletesID" class="style-table h-full" scrollable
          scrollHeight="flex">
          <template #header>
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span class="text-xl font-bold">Gestão dos Fisios</span>
              <DivisionInjuryChart v-if="divisionData" :divisionData="divisionData" />
            </div>
          </template>

        </DataTable>
      </div>


    </div>
  </div>
</template>

<script>
import { supabase } from '../../utils/supabase'
import DivisionInjuryChart from './AthleteComponents/DivisionInjuryChart.vue'
import { safeGet } from '../../utils/utils.js'
import axios from 'axios';

export default {
  components: { DivisionInjuryChart },
  data() {
    return {
      athletes: [],
      injuryRecords: [],
      divisionData: [],
    }
  },
  watch: {},
  mounted() {
    this.getAthleteData()
    this.getInjuryRecords()
    this.getDivisionData()
  },
  methods: {
    async getDivisionData() {
      const response = await safeGet(
        axios.get('http://localhost:3000/aux/stats/athleteInjurySummary'),
        null
      );
      this.divisionData = response;
      console.log('Health Overview:', response);
    },
    async getInjuryRecords() {
      const { data, error } = await supabase.from('t_injury_record').select(`
      id,
      resume,
      statusID,
      athleteID,
      taux_status (
        status
      )
    `)

      if (error) {
        console.error('Erro ao buscar lesões:', error)
        return
      }

      console.log('Lesões recebidas:', data)

      this.injuryRecords = data
    },
    async getAthleteData() {
      const { data, error } = await supabase.from('t_athlete').select(`
      *,
      taux_division (
        division
      ),
      t_injury_record (
        resume,
        taux_status (
          status
        )
      )
    `)

      if (error) {
        console.error('Erro ao buscar atletas:', error)
        return
      }

      console.log('Atletas recebidos:', data)

      this.athletes = data
    },
  },
}
</script>
