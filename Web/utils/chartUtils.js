export const divisionInjuryChartConfig = {
  getChartOptions(divisions) {
    return {
      chart: {
        type: 'bar',
        height: 450,
        stacked: true,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: 'center'
          },
          borderRadius: 4
        }
      },
      stroke: {
        width: 1,
        colors: ['#fff']
      },
      xaxis: {
        categories: divisions,
      },
      yaxis: {
        title: {
          text: ''
        }
      },
      tooltip: {
        y: {
          formatter: (val, { seriesIndex, w }) => {
            return `${val}`
          }
        }
      },
      fill: {
        opacity: 1
      },
      colors: ['#00E396', '#FF4560', '#FEB019'],
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        offsetY: 10
      }
    }
  },

  getSeries(divisionData) {
    return [
      {
        name: 'Atletas Saudáveis',
        data: divisionData.map(d => d.total_athletes - d.injured_athletes)
      },
      {
        name: 'Atletas Lesionados',
        data: divisionData.map(d => d.injured_athletes)
      },
      {
        name: 'Total de Lesões Registadas',
        data: divisionData.map(d => d.total_injury_records)
      }
    ]
  }
}