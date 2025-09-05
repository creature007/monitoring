<template>
  <div class="dashboard">
    <!-- Statistika kartlari -->
    <div class="stats-cards">
      <Card class="stats-card">
        <template #title>
          <div class="card-title">
            <i class="pi pi-mobile"></i>
            Jami qurilmalar
          </div>
        </template>
        <template #content>
          <div class="stat-value">{{ statistics?.total_devices || 0 }}</div>
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
          <div class="stat-value">{{ statistics?.online_devices || 0 }}</div>
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
          <div class="stat-value">{{ statistics?.offline_devices || 0 }}</div>
        </template>
      </Card>
    </div>

    <!-- Qurilmalar jadvali -->
    <Card class="devices-table">
      <template #title>
        <div class="table-header">
          <h2>Qurilmalar ro'yxati</h2>
          <Button icon="pi pi-refresh" @click="refreshData" />
        </div>
      </template>
      <template #content>
        <DataTable 
          :value="devices" 
          :paginator="true" 
          :rows="20"
          :scrollable="true"
          scrollHeight="calc(100vh - 400px)"
          responsiveLayout="scroll"
          class="p-datatable-sm custom-table"
          :loading="loading"
          stripedRows
          :rowHover="true"
        >
          <Column field="number" header="Qurilma nomi" sortable>
            <template #body="slotProps">
              <router-link :to="'/device/' + slotProps.data.id" class="device-link">
                <div class="device-info">
                  <i class="pi pi-desktop device-icon"></i>
                  <div class="device-details">
                    <span class="device-name">{{ slotProps.data.number }}</span>
                    <span class="device-location">{{ slotProps.data.description }}</span>
                  </div>
                </div>
              </router-link>
            </template>
          </Column>
          <Column field="online" header="Holat" sortable>
            <template #body="slotProps">
              <span :class="['status-badge', slotProps.data.online ? 'online' : 'offline']">
                <i :class="['pi', slotProps.data.online ? 'pi-check-circle' : 'pi-times-circle']"></i>
                {{ slotProps.data.online ? 'Online' : 'Offline' }}
              </span>
            </template>
          </Column>
          <Column field="last_seen" header="Oxirgi faollik" sortable>
            <template #body="slotProps">
              <div class="last-seen">
                <i class="pi pi-clock"></i>
                {{ slotProps.data.last_seen }}
              </div>
            </template>
          </Column>
          <Column header="Bugungi statistika">
            <template #body="slotProps">
              <div class="stats-info" v-if="slotProps.data.today_stats">
                <div class="stat-item">
                  <i class="pi pi-check"></i>
                  <div class="stat-details">
                    <span class="stat-label">Online</span>
                    <span class="stat-value-small">{{ slotProps.data.today_stats.online_hours }}s</span>
                  </div>
                </div>
                <div class="stat-item">
                  <i class="pi pi-times"></i>
                  <div class="stat-details">
                    <span class="stat-label">Offline</span>
                    <span class="stat-value-small">{{ slotProps.data.today_stats.offline_hours }}s</span>
                  </div>
                </div>
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script>
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Dashboard',
  setup() {
    const store = useStore()

    const devices = computed(() => store.state.devices)
    const statistics = computed(() => store.state.statistics)
    const loading = computed(() => store.state.loading)

    const refreshData = async () => {
      await store.dispatch('fetchDevices')
      await store.dispatch('fetchStatistics')
    }

    onMounted(() => {
      refreshData()
    })

    return {
      devices,
      statistics,
      loading,
      refreshData
    }
  }
}
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.stats-cards {
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

.stats-card.online :deep(.p-card-content) {
  color: var(--success-color);
}

.stats-card.offline :deep(.p-card-content) {
  color: var(--danger-color);
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

.stat-value {
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
  line-height: 1.2;
}

.devices-table {
  background: var(--card-bg) !important;
  border-radius: 1rem;
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(255,255,255,0.05);
  margin: -1rem -1.5rem 1rem;
}

.table-header h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.25rem;
}

.custom-table {
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

:deep(.p-datatable-wrapper) {
  border-radius: 1rem;
}

:deep(.p-datatable-tbody > tr) {
  transition: all 0.3s ease;
}

:deep(.p-datatable-tbody > tr:hover) {
  background: rgba(255,255,255,0.08) !important;
  transform: translateY(-2px);
}

.device-link {
  text-decoration: none;
  color: var(--text-primary);
  display: block;
  transition: all 0.3s;
}

.device-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
}

.device-icon {
  font-size: 1.5rem;
  color: var(--accent-color);
  background: rgba(63, 81, 181, 0.15);
  padding: 0.75rem;
  border-radius: 0.75rem;
  transition: all 0.3s;
}

.device-link:hover .device-icon {
  transform: scale(1.1);
  background: var(--accent-color);
  color: var(--text-primary);
}

.device-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.device-name {
  font-weight: 600;
  font-size: 1rem;
  color: var(--text-primary);
}

.device-location {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.status-badge {
  padding: 0.75rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s;
}

.status-badge i {
  font-size: 1rem;
}

.status-badge.online {
  background: rgba(76, 175, 80, 0.15);
  color: var(--success-color);
}

.status-badge.offline {
  background: rgba(244, 67, 54, 0.15);
  color: var(--danger-color);
}

.status-badge:hover {
  transform: translateY(-2px);
  filter: brightness(1.2);
}

.last-seen {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.last-seen i {
  font-size: 1rem;
  opacity: 0.7;
}

.stats-info {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: rgba(255,255,255,0.05);
  border-radius: 1rem;
  transition: all 0.3s;
}

.stat-item:hover {
  transform: translateY(-2px);
  background: rgba(255,255,255,0.08);
}

.stat-item i {
  font-size: 1rem;
  opacity: 0.9;
}

.stat-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
}

.stat-value-small {
  font-weight: 600;
  color: var(--text-primary);
}

/* PrimeVue pagination stillari */
:deep(.p-paginator) {
  background: transparent !important;
  border: none;
  padding: 1rem 0;
}

:deep(.p-paginator .p-paginator-element) {
  background: rgba(255,255,255,0.05);
  border: none;
  color: var(--text-secondary);
  margin: 0 0.25rem;
  min-width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s;
}

:deep(.p-paginator .p-paginator-element:hover) {
  background: rgba(255,255,255,0.1);
  color: var(--text-primary);
  transform: translateY(-2px);
}

:deep(.p-paginator .p-highlight) {
  background: var(--accent-color) !important;
  color: var(--text-primary) !important;
}
</style>
