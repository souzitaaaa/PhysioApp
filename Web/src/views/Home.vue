<template>
  <div class="flex flex-col h-full overflow-hidden">
    <div class="flex-1 overflow-y-auto overscroll-contain flex flex-col gap-4">
      <div class="flex h-1/2">
        <div class="w-full">
          <DataTable ref="dt" :value="injuryRecords" dataKey="injuryRecordID" class="style-table h-full" paginator
            :rows="5" scrollable scrollHeight="flex" tableStyle="table-layout: fixed; width: 100%;"
            :rowClass="rowClass">
            <template #header>
              <div class="flex justify-between items-center w-full">
                <span class="text-xl font-semibold">Registos de Lesão</span>
                <span class="text-sm text-gray-500 cursor-pointer hover:underline"
                  @click="goToRoute({ name: 'Email' })">
                  Ver todos
                </span>
              </div>
            </template>

            <Column header=" Atleta" style="width: 22%">
              <template #body="{ data }">
                <div class="flex items-center gap-2 overflow-hidden">
                  <Avatar v-if="data.status !== 'Erro' || data.errorSpecID === 1" :image="data.athlete_pfp"
                    class="mr-2 shrink-0" shape="circle" />
                  <div class="flex flex-col overflow-hidden">
                    <span class="font-medium truncate">{{ data.athlete_name }}</span>
                    <span class="text-sm text-gray-500 truncate">
                      {{ data.athlete_email }}
                    </span>
                  </div>
                </div>
              </template>
            </Column>

            <Column header="Ocorrência" style="width: 45%">
              <template #body="{ data }">
                <div class="flex flex-col gap-1 overflow-hidden">
                  <span class="text-sm text-gray-600 line-clamp-1">
                    {{ data.resume }}
                  </span>
                </div>
              </template>
            </Column>

            <Column header="Estado" style="width: 15%">
              <template #body="{ data }">
                <div class="flex gap-1 items-center">
                  <span class="px-2 py-1 rounded text-sm font-medium w-fit" :class="{
                    'bg-red-100 text-red-700': data.status === 'Erro',
                    'bg-green-100 text-green-700': data.status === 'Fechado',
                    'bg-yellow-100 text-yellow-700': data.status === 'Em Andamento',
                    'bg-sky-100 text-sky-700': data.status === 'Por Responder',
                  }">
                    {{ data.status }}
                  </span>
                  <span v-if="data.status === 'Erro' && data.error" class="text-xs text-red-600 truncate"
                    title="Erro associado">
                    {{ data.error }}
                  </span>
                </div>
              </template>
            </Column>

            <Column header="Datas" style="width: 18%">
              <template #body="{ data }">
                <div class="grid grid-cols-[50px_1fr] gap-x-1 text-sm text-gray-600">
                  <span class="font-semibold">Início:</span>
                  <span>{{ data.dateStart || '—' }}</span>

                  <span class="font-semibold">Fim:</span>
                  <span v-if="data.dateEnd">
                    {{ data.dateEnd }}
                  </span>
                  <span v-else class="italic text-gray-500"> Em curso </span>
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
      <div class="flex h-1/2 gap-4">
        <!-- Atletas -->
        <div class="flex-1">
          <DataTable ref="dt" v-model:filters="filters" :filters="filters" :value="athletes" dataKey="athleteID"
            class="style-table h-full" paginator :rows="5" scrollable scrollHeight="flex" filterDisplay="menu">
            <template #header>
              <div class="flex justify-between items-center w-full">
                <span class="text-xl font-semibold">Atletas</span>
                <span class="text-sm text-gray-500 cursor-pointer hover:underline"
                  @click="goToRoute({ name: 'Atletas' })">
                  Ver todos
                </span>
              </div>
            </template>
            <Column field="division" header="Nome" style="max-width: 8rem" :showFilterMatchModes="false"
              :showFilterOperator="false" :showAddButton="false">
              <template #body="{ data }">
                <div class="flex items-center gap-2 min-w-0">
                  <Avatar :image="data.pfp" class="mr-2" style="background-color: #ece9fc; color: #2a1261"
                    shape="circle" />
                  <div class="flex flex-col min-w-0">
                    <div class="flex items-center gap-1 min-w-0">
                      <span class="truncate max-w-auto font-medium">
                        {{ data.name }}
                      </span>
                      <i v-if="data.injuredBit" class="fa-solid fa-truck-medical text-red-600 shrink-0"
                        style="font-size: 0.8rem" />
                    </div>
                    <span class="truncate text-sm text-gray-500 max-w-auto">
                      {{ data.division }}
                    </span>
                  </div>
                </div>
              </template>

              <template #filter="{ filterModel, filterCallback }">
                <MultiSelect v-model="filterModel.value" :options="uniqueDivisions" placeholder="Selecionar" showClear
                  filter="false" @change="filterCallback()" class="p-column-filter" size="small">
                </MultiSelect>
              </template>
            </Column>

            <Column header="Contacto" style="max-width: 8rem">
              <template #body="{ data }">
                <div class="flex flex-col">
                  <span>{{ data.phoneNumber }}</span>
                  <span class="truncate max-w-auto">{{ data.email }}</span>
                </div>
              </template>
            </Column>
            <Column field="country_name" header="País" style="max-width: 8rem">
              <template #body="{ data }">
                <div class="card flex justify-start">
                  <Tag class="bg-transparent!">
                    <div class="flex items-center gap-2 px-1">
                      <img alt="Country" :src="data.country_flag" class="flag flag-it" style="width: 18px" />
                      <span class="text-sm">{{ data.country_name }}</span>
                    </div>
                  </Tag>
                </div>
              </template>
            </Column>
          </DataTable>
        </div>

        <!-- Gestão -->
        <div class="flex-1">
          <DataTable ref="dt" :value="athletes" dataKey="athletesID" class="style-table h-full" scrollable
            scrollHeight="flex">
            <template #header>
              <div class="flex justify-between items-center w-full">
                <span class="text-xl font-semibold">Estatísticas Gerais</span>
              </div>
              <DivisionInjuryChart v-if="divisionData" :divisionData="divisionData" />
            </template>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DivisionInjuryChart from './AthleteComponents/DivisionInjuryChart.vue'
import { safeGet } from '../../utils/utils.js'
import axios from 'axios'
import { FilterMatchMode, FilterOperator } from '@primevue/core/api'
import { supabase } from '../../utils/supabase'

export default {
  components: { DivisionInjuryChart },
  data() {
    return {
      athletes: [],
      injuryRecords: [],
      divisionData: [],
      filters: {
        division: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.IN }],
        },
      },
      channelInjuries: null,
      channelAthletes: null,
    }
  },
  watch: {},
  mounted() {
    this.getAthleteData()
    this.getInjuryRecords()
    this.getDivisionData()
    this.subscribeInjuryRecords()
    this.subscribeAthletes()
  },
  beforeUnmount() {
    if (this.channelInjuries) supabase.removeChannel(this.channelInjuries)
    if (this.channelAthletes) supabase.removeChannel(this.channelAthletes)
  },

  methods: {
    subscribeInjuryRecords() {
      this.channelInjuries = supabase
        .channel('injury-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 't_injury_record' },
          (payload) => {
            console.log('Alteração em injuryRecords:', payload)
            this.getInjuryRecords()
          },
        )
        .subscribe()
    },

    subscribeAthletes() {
      this.channelAthletes = supabase
        .channel('athletes-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 't_athlete' },
          (payload) => {
            console.log('Alteração em athletes:', payload)
            this.getAthleteData()
          },
        )
        .subscribe()
    },


    goToRoute(target) {
      this.$router.push(target)
    },
    rowClass(rowData) {
      const status = rowData && rowData.status ? String(rowData.status).trim() : ''
      return status === 'Erro' ? 'bg-red-100!' : ''
    },
    async getDivisionData() {
      const response = await safeGet(
        axios.get('http://localhost:3000/aux/stats/athleteInjurySummary'),
        null,
      )
      this.divisionData = response
    },
    async getInjuryRecords() {
      const data = await safeGet(axios.get('http://localhost:3000/records/'), [])
      this.injuryRecords = data
    },
    async getAthleteData() {
      const data = await safeGet(axios.get('http://localhost:3000/athletes/'), [])
      this.athletes = data
    },
  },
  computed: {
    uniqueDivisions() {
      const divisions = this.athletes.map((a) => a.division).filter(Boolean)
      return [...new Set(divisions)].sort()
    },
  },
}
</script>
