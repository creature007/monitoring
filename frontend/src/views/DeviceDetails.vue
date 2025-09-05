<template>
  <div class="device-details" v-if="device">
    <div class="header">
      <Button icon="pi pi-arrow-left" @click="$router.push('/')" label="Orqaga" />
      <h1>{{ device.number }}</h1>
    </div>

    <div class="detail-cards">
      <!-- Asosiy ma'lumotlar -->
      <Card class="detail-card">
        <template #title>
          <div class="card-title">
            <i class="pi pi-info-circle"></i>
            Asosiy ma'lumotlar
          </div>
        </template>
        <template #content>
          <div class="info-grid">
            <div class="info-item">
              <label>Holat</label>
              <span :class="['status-badge', device.online ? 'online' : 'offline']">
                {{ device.online ? 'Online' : 'Offline' }}
              </span>
            </div>
            <div class="info-item">
              <label>Oxirgi faollik</label>
              <span>{{ device.last_seen }}</span>
            </div>
            <div class="info-item">
              <label>IMEI</label>
              <span>{{ device.imei || 'Mavjud emas' }}</span>
            </div>
            <div class="info-item">
              <label>Telefon</label>
              <span>{{ device.phone || 'Mavjud emas' }}</span>
            </div>
            <div class="info-item">
              <label>IP manzil</label>
              <span>{{ device.publicip || 'Mavjud emas' }}</span>
            </div>
          </div>
        </template>
      </Card>

      <!-- Statistika -->
      <Card class="detail-card">
        <template #title>
          <div class="card-title">
            <i class="pi pi-chart-line"></i>
            Statistika
          </div>
        </template>
        <template #content>
          <div class="stats-container">
            <div class="period-stats">
              <h3>Bugungi</h3>
              <div class="stats-grid" v-if="device.today_stats">
                <div class="stat-box online">
                  <label>Online</label>
                  <span>{{ device.today_stats.online_hours }}s</span>
                </div>
                <div class="stat-box offline">
                  <label>Offline</label>
                  <span>{{ device.today_stats.offline_hours }}s</span>
                </div>
              </div>
            </div>

            <div class="period-stats">
              <h3>Haftalik</h3>
              <div class="stats-grid" v-if="device.weekly_stats">
                <div class="stat-box online">
                  <label>Online</label>
                  <span>{{ device.weekly_stats.online_hours }}s</span>
                </div>
                <div class="stat-box offline">
                  <label>Offline</label>
                  <span>{{ device.weekly_stats.offline_hours }}s</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Batafsil statistika -->
    <Card class="history-card">
      <template #title>
        <div class="card-title">
          <i class="pi pi-calendar"></i>
          Davr bo'yicha statistika
        </div>
      </template>
      <template #content>
        <div class="date-range">
          <Calendar v-model="startDate" dateFormat="yy-mm-dd" placeholder="Boshlanish sanasi" />
          <Calendar v-model="endDate" dateFormat="yy-mm-dd" placeholder="Tugash sanasi" />
          <Button label="Ko'rish" icon="pi pi-search" @click="fetchDateRangeStats" />
        </div>

        <div class="history-stats" v-if="dateRangeStats">
          <Chart type="line" :data="chartData" :options="chartOptions" style="height: 300px" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import axios from 'axios'
import moment from 'moment'

export default {
  name: 'DeviceDetails',
  setup() {
    const store = useStore()
    const route = useRoute()
    const deviceId = parseInt(route.params.id)

    const startDate = ref(null)
    const endDate = ref(null)
    const dateRangeStats = ref(null)

    const device = computed(() => store.getters.deviceById(deviceId))

    const chartData = computed(() => {
      if (!dateRangeStats.value) return null

      const dates = Object.keys(dateRangeStats.value)
      const onlineHours = dates.map(date => dateRangeStats.value[date].online_hours)
      const offlineHours = dates.map(date => dateRangeStats.value[date].offline_hours)

      return {
        labels: dates,
        datasets: [
          {
            label: 'Online soatlar',
            data: onlineHours,
            borderColor: '#4caf50',
            tension: 0.4
          },
          {
            label: 'Offline soatlar',
            data: offlineHours,
            borderColor: '#f44336',
            tension: 0.4
          }
        ]
      }
    })

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }

    const fetchDateRangeStats = async () => {
      if (!startDate.value || !endDate.value) return

      try {
        const response = await axios.get(`http://127.0.0.1:8007/api/device-stats/${deviceId}`, {
          params: {
            start_date: moment(startDate.value).format('YYYY-MM-DD'),
            end_date: moment(endDate.value).format('YYYY-MM-DD')
          }
        })
        dateRangeStats.value = response.data.stats
      } catch (error) {
        console.error('Statistika olishda xatolik:', error)
      }
    }

    onMounted(() => {
      if (!device.value) {
        store.dispatch('fetchDevices')
      }
    })

    return {
      device,
      startDate,
      endDate,
      dateRangeStats,
      chartData,
      chartOptions,
      fetchDateRangeStats
    }
  }
}
</script>

<style scoped>
.device-details {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.detail-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  color: #666;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item label {
  color: #666;
  font-size: 0.875rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  width: fit-content;
}

.status-badge.online {
  background: #e8f5e9;
  color: #4caf50;
}

.status-badge.offline {
  background: #ffebee;
  color: #f44336;
}

.stats-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.period-stats h3 {
  margin: 0 0 1rem 0;
  color: #666;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat-box {
  padding: 1rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-box.online {
  background: #e8f5e9;
}

.stat-box.offline {
  background: #ffebee;
}

.stat-box label {
  font-size: 0.875rem;
  color: #666;
}

.stat-box span {
  font-size: 1.25rem;
  font-weight: bold;
}

.date-range {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.history-stats {
  margin-top: 2rem;
}
</style>
