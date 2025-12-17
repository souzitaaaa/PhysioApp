<template>
  <div class="flex h-1/2 mb-6">
    <div class="w-full">
      <DataTable ref="dt">
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="text-xl font-bold">Email</span>
          </div>
        </template>
        <Column field="name" header="Nome">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <div class="flex flex-col">
              </div>
            </div>
          </template>
        </Column>
        <Column header="Email">
          <template #body="{ data }">
            <div class="flex flex-col">
            </div>
          </template>
        </Column>
        <Column header="Estado">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
            </div>
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
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="text-xl font-bold">Atletas</span>
          </div>
        </template>
        <Column field="name" header="Nome">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <Avatar :image="data.pfp" class="mr-2" style="background-color: #ece9fc; color: #2a1261" shape="circle" />
              <span>{{ data.name }}</span>
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
      <DataTable ref="dt" :value="athletes" dataKey="athletesID">
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="text-xl font-bold">Atletas</span>
          </div>
        </template>
        <Column field="name" header="Nome">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <Avatar icon="pi pi-user" class="mr-2" style="background-color: #ece9fc; color: #2a1261" shape="circle" />
              <span>{{ data.name }}</span>
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
