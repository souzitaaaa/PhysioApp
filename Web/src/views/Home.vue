<template>
  <div class="overscroll-auto">
    <div class="flex h-1/2 mb-6">
      <div class="w-full">
        <DataTable :value="injuryRecords" dataKey="injuryRecordID" paginator :rows="5" scrollable scrollHeight="flex"
          class="style-table h-full" tableStyle="table-layout: fixed; width: 100%;" :rowClass="rowClass">

          <template #header>
            <div class="flex justify-between items-center w-full">
              <span class="text-xl font-semibold">Registos de Lesão</span>
              <span class="text-sm text-gray-500 cursor-pointer hover:underline" @click="goToRoute({ name: 'Email' })">
                Ver todos
              </span>
            </div>
          </template>

          <Column header=" Atleta" style="width: 22%">
            <template #body="{ data }">
              <div class="flex items-center gap-2 overflow-hidden">
                <Avatar :image="data.athlete_pfp" class="mr-2 shrink-0" shape="circle" />
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
                <span class="text-sm text-gray-600 line-clamp-2">
                  {{ data.resume }}
                </span>
              </div>
            </template>
          </Column>


          <Column header="Estado" style="width: 15%">
            <template #body="{ data }">
              <div class="flex flex-col gap-1">
                <span class="px-2 py-1 rounded text-sm font-medium w-fit" :class="{
                  'bg-red-100 text-red-700': data.status === 'Erro',
                  'bg-green-100 text-green-700': data.status === 'Fechado',
                  'bg-yellow-100 text-yellow-700': data.status === 'Em Andamento',
                  'bg-sky-100 text-sky-700': data.status === 'Por Responder'
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
                <span v-else class="italic text-gray-500">
                  Em curso
                </span>
              </div>
            </template>
          </Column>



        </DataTable>
      </div>

    </div>
    <div class="flex h-1/2">

      <!-- Atletas -->
      <div class="w-1/2 mr-3">
        <DataTable ref="dt" :value="athletes" dataKey="athleteID" class="style-table h-full" paginator :rows="4"
          scrollable scrollHeight="flex">
          <template #header>
            <div class="flex justify-between items-center w-full">
              <span class="text-xl font-semibold">Atletas</span>
              <span class="text-sm text-gray-500 cursor-pointer hover:underline"
                @click="goToRoute({ name: 'Atletas' })">
                Ver todos
              </span>
            </div>
          </template>
          <Column field="name" header="Nome" style="max-width: 8rem">
            <template #body="{ data }">
              <div class="flex items-center gap-2 min-w-0">
                <Avatar :image="data.pfp" class="mr-2" style="background-color: #ece9fc; color: #2a1261"
                  shape="circle" />
                <div class="flex flex-col min-w-0">
                  <div class="flex items-center gap-1 min-w-0">
                    <span class="truncate max-w-[156px] font-medium">
                      {{ data.name }}
                    </span>
                    <i v-if="data.injuredBit" class="fa-solid fa-truck-medical text-red-600 shrink-0"
                      style="font-size: 0.8rem" />
                  </div>
                  <span class="truncate text-sm text-gray-500 max-w-[156px]">
                    {{ data.division }}
                  </span>
                </div>
              </div>
            </template>
          </Column>

          <Column header="Contacto" style="max-width: 8rem">
            <template #body="{ data }">
              <div class="flex flex-col">
                <span>{{ data.phoneNumber }}</span>
                <span class="truncate max-w-[156px]">{{ data.email }}</span>
              </div>
            </template>
          </Column>
          <Column field="country_name" header="País" style="max-width: 8rem">
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
        </DataTable>
      </div>

      <!-- Gestão -->
      <div class="w-1/2 ml-3">
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
</template>

<script>
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
    goToRoute(target) {
      this.$router.push(target);
    },
    rowClass(rowData) {
      const status = rowData && rowData.status ? String(rowData.status).trim() : '';
      return status === 'Erro' ? 'bg-red-100!' : '';
    },
    async getDivisionData() {
      const response = await safeGet(
        axios.get('http://localhost:3000/aux/stats/athleteInjurySummary'),
        null
      );
      this.divisionData = response;
    },
    async getInjuryRecords() {
      const data = await safeGet(
        axios.get('http://localhost:3000/records/'),
        []
      );
      this.injuryRecords = data;
    },
    async getAthleteData() {
      const data = await safeGet(
        axios.get('http://localhost:3000/athletes/'),
        []
      );
      this.athletes = data;
    },
  }
}
</script>
