<template>
  <div class="statistics">
    <h1>Umumiy statistika</h1>

    <!-- Statistika kartlari -->
    <div class="stats-overview">
      <Card class="stats-card total">
        <template #title>
          <div class="card-title">
            <i class="pi pi-mobile"></i>
            Jami qurilmalar
          </div>
        </template>
        <template #content>
          <div class="stat-content">
            <div class="stat-value">{{ statistics?.total_devices || 0 }}</div>
          </div>
        </template>
      </Card>

      <Card class="stats-card online">
        <template #title>
          <div class="card-title">
            <i class="pi pi-check-circle"></i>
            Online qurilmalar
          </div>
        </template>
        <template #content>
          <div class="stat-content">
            <div class="stat-value">{{ statistics?.online_devices || 0 }}</div>
            <div class="stat-percentage">{{ statistics?.online_percentage || 0 }}%</div>
          </div>
        </template>
      </Card>

      <Card class="stats-card offline">
        <template #title>
          <div class="card-title">
            <i class="pi pi-times-circle"></i>
            Offline qurilmalar
          </div>
        </template>
        <template #content>
          <div class="stat-content">
            <div class="stat-value">{{ statistics?.offline_devices || 0 }}</div>
            <div class="stat-percentage">{{ 100 - (statistics?.online_percentage || 0) }}%</div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Donut diagramma -->
    <Card class="chart-card">
      <template #title>
        <div class="card-title">
          <i class="pi pi-chart-pie"></i>
          Qurilmalar holati
        </div>
      </template>
      <template #content>
        <Chart type="doughnut" :data="chartData" :options="chartOptions" style="height: 300px" />
      </template>
    </Card>

    <!-- Oxirgi faoliyat -->
    <Card class="activity-card">
      <template #title>
        <div class="card-title">
          <i class="pi pi-clock"></i>
          Oxirgi faoliyat
        </div>
      </template>
      <template #content>
        <div class="activity-list">
          <div v-for="(activity, index) in statistics?.recent_activity" :key="index" class="activity-item">
            <i class="pi pi-mobile"></i>
            <div class="activity-info">
              <div class="activity-device">{{ activity.device }}</div>
              <div class="activity-time">{{ activity.last_seen }}</div>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Statistics',
  setup() {
    const store = useStore()
    const statistics = computed(() => store.state.statistics)

    const chartData = computed(() => ({
      labels: ['Online', 'Offline'],
      datasets: [
        {
          data: [
            statistics.value?.online_devices || 0,
            statistics.value?.offline_devices || 0
          ],
          backgroundColor: ['#4caf50', '#f44336'],
          hoverBackgroundColor: ['#66bb6a', '#ef5350']
        }
      ]
    }))

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }

    onMounted(() => {
      store.dispatch('fetchStatistics')
    })

    return {
      statistics,
      chartData,
      chartOptions
    }
  }
}
</script>

<style scoped>
.statistics {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

h1 {
  color: var(--text-primary);
  font-size: 1.75rem;
  margin: 0 0 1rem;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.stats-card {
  background: var(--card-bg) !important;
  border-radius: 1rem;
  transition: transform 0.3s, box-shadow 0.3s;
  overflow: hidden;
}

.stats-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}

.stats-card :deep(.p-card-content) {
  padding: 1.5rem;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  color: var(--text-primary);
  padding: 1rem 1.5rem;
  background: rgba(255,255,255,0.05);
  margin: -1rem -1.5rem 1rem;
}

.card-title i {
  font-size: 1.25rem;
  opacity: 0.9;
}

.stat-content {
  text-align: center;
}

.stat-value {
  font-size: 3rem;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 0.5rem;
}

.stat-percentage {
  font-size: 1.25rem;
  color: var(--text-secondary);
  padding: 0.25rem 1rem;
  background: rgba(255,255,255,0.05);
  border-radius: 1rem;
  display: inline-block;
}

.stats-card.total .stat-value {
  color: #ffffff;
}

.stats-card.online .stat-value {
  color: var(--success-color);
}

.stats-card.offline .stat-value {
  color: var(--danger-color);
}

.chart-card {
  background: var(--card-bg) !important;
  border-radius: 1rem;
  overflow: hidden;
}

.chart-card :deep(.p-card-content) {
  padding: 2rem;
}

:deep(.p-chart) {
  margin: 0 auto;
}

.activity-card {
  background: var(--card-bg) !important;
  border-radius: 1rem;
  overflow: hidden;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255,255,255,0.05);
  border-radius: 0.75rem;
  transition: background-color 0.3s;
}

.activity-item:hover {
  background: rgba(255,255,255,0.08);
}

.activity-item i {
  font-size: 1.5rem;
  color: var(--accent-color);
  background: rgba(63, 81, 181, 0.15);
  padding: 0.75rem;
  border-radius: 0.75rem;
}

.activity-info {
  flex: 1;
}

.activity-device {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.activity-time {
  font-size: 0.875rem;
  color: var(--text-secondary);
}
</style>
