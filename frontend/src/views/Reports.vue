<template>
  <div class="reports">
    <div class="reports-header">
      <div class="header-content">
        <h1>Qurilmalar hisoboti</h1>
        <div class="summary-info">
          <div class="stat-item">
            <span class="stat-value">{{ report?.total_devices || 0 }}</span>
            <span class="stat-label">Jami qurilmalar</span>
          </div>
          <div class="stat-item success">
            <span class="stat-value">{{ report?.active_devices || 0 }}</span>
            <span class="stat-label">Faol</span>
          </div>
          <div class="stat-item danger">
            <span class="stat-value">{{ report?.inactive_devices || 0 }}</span>
            <span class="stat-label">Nofaol</span>
          </div>
          <div class="stat-item info">
            <span class="stat-value">{{ calculateAverageUptime(report?.devices) }}%</span>
            <span class="stat-label">O'rtacha ishlash</span>
          </div>
        </div>
      </div>
      <div class="period-selector">
        <span class="period-label">Davr:</span>
        <div class="period-buttons">
          <Button 
            :class="{ active: period === 'daily' }" 
            @click="setPeriod('daily')"
            class="p-button-rounded"
            label="Kunlik"
            icon="pi pi-calendar"
          />
          <Button 
            :class="{ active: period === 'weekly' }" 
            @click="setPeriod('weekly')"
            class="p-button-rounded"
            label="Haftalik"
            icon="pi pi-calendar-week"
          />
          <Button 
            :class="{ active: period === 'monthly' }" 
            @click="setPeriod('monthly')"
            class="p-button-rounded"
            label="Oylik"
            icon="pi pi-calendar-plus"
          />
        </div>
      </div>
    </div>

    <div class="report-content" v-if="report">
      <div class="report-overview">
        <!-- Umumiy statistika -->
        <div class="stats-grid">
          <Card class="stat-card total">
            <template #content>
              <div class="stat-icon">
                <i class="pi pi-server"></i>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ report.total_devices }}</span>
                <span class="stat-label">Jami qurilmalar</span>
              </div>
            </template>
          </Card>

          <Card class="stat-card active">
            <template #content>
              <div class="stat-icon">
                <i class="pi pi-check-circle"></i>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ report.active_devices }}</span>
                <span class="stat-label">Faol qurilmalar</span>
                <span class="stat-percentage">{{ (report.active_devices / report.total_devices * 100).toFixed(1) }}%</span>
              </div>
            </template>
          </Card>

          <Card class="stat-card inactive">
            <template #content>
              <div class="stat-icon">
                <i class="pi pi-times-circle"></i>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ report.inactive_devices }}</span>
                <span class="stat-label">Nofaol qurilmalar</span>
                <span class="stat-percentage">{{ (report.inactive_devices / report.total_devices * 100).toFixed(1) }}%</span>
              </div>
            </template>
          </Card>

          <Card class="stat-card uptime">
            <template #content>
              <div class="stat-icon">
                <i class="pi pi-clock"></i>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ calculateAverageUptime(report.devices) }}%</span>
                <span class="stat-label">O'rtacha ishlash vaqti</span>
              </div>
            </template>
          </Card>
        </div>

        <!-- Batafsil ma'lumotlar -->
        <Card class="details-table">
          <template #title>
            <div class="table-header">
              <div class="header-left">
                <i class="pi pi-list"></i>
                <h2>Batafsil ma'lumotlar</h2>
              </div>
              <div class="header-actions">
                <Button icon="pi pi-filter" label="Filtrlash" class="p-button-outlined" @click="toggleFilters" />
                <Button icon="pi pi-download" label="Hisobotni yuklash" @click="downloadReport" />
              </div>
            </div>
          </template>
          <template #content>
            <!-- Filtrlar paneli -->
            <div class="filters-panel" v-if="showFilters">
              <div class="filter-group">
                <label>Holat</label>
                <MultiSelect v-model="filters.status" :options="statusOptions" optionLabel="name" 
                           placeholder="Tanlang" class="filter-input" />
              </div>
              <div class="filter-group">
                <label>Joylashuv</label>
                <MultiSelect v-model="filters.location" :options="locationOptions" optionLabel="name" 
                           placeholder="Tanlang" class="filter-input" />
              </div>
              <div class="filter-group">
                <label>Ishlash vaqti</label>
                <Slider v-model="filters.uptime" range class="filter-slider" />
                <span class="filter-value">{{ filters.uptime[0] }}% - {{ filters.uptime[1] }}%</span>
              </div>
            </div>

            <!-- Qurilmalar jadvali -->
            <DataTable 
              :value="filteredDevices" 
              :paginator="true" 
              :rows="20"
              paginatorTemplate="PageLinks"
              class="p-datatable-sm devices-list"
              :loading="loading"
              sortField="lastupdate"
              :sortOrder="-1"
              :rowHover="true"
              responsiveLayout="scroll"
              stripedRows
            >
              <Column field="number" header="Qurilma nomi" sortable style="width: 300px">
                <template #body="slotProps">
                  <div class="device-cell">
                    <div class="device-icon">
                      <i class="pi pi-desktop"></i>
                    </div>
                    <div class="device-info">
                      <span class="device-name">{{ slotProps.data.number }}</span>
                      <span class="device-description">{{ slotProps.data.description }}</span>
                    </div>
                  </div>
                </template>
              </Column>
              <Column field="status_period" header="Holat" sortable style="width: 120px">
                <template #body="slotProps">
                  <span :class="['device-status', slotProps.data.status_period]">
                    {{ slotProps.data.status_period === 'active' ? 'Online' : 'Offline' }}
                  </span>
                </template>
              </Column>
              <Column field="lastupdate" header="Oxirgi faollik" sortable style="width: 200px">
                <template #body="slotProps">
                  <div class="timestamp-cell">
                    <span class="time">{{ formatDate(slotProps.data.lastupdate) }}</span>
                  </div>
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import moment from 'moment'

export default {
  name: 'Reports',
  setup() {
    const store = useStore()
    const period = ref('weekly')
    const report = ref(null)
    const loading = ref(false)
    const showFilters = ref(false)
    const selectedDevices = ref([])

    // Filtr opsiyalari
    const filters = ref({
      status: [],
      location: [],
      uptime: [0, 100]
    })

    const statusOptions = [
      { name: 'Faol', value: 'active' },
      { name: 'Nofaol', value: 'inactive' }
    ]

    const locationOptions = computed(() => {
      if (!report.value?.devices) return []
      const locations = [...new Set(report.value.devices.map(d => d.description))]
      return locations.map(loc => ({ name: loc, value: loc }))
    })

    // Qurilmalarni filtrlash
    const filteredDevices = computed(() => {
      if (!report.value?.devices) return []
      
      return report.value.devices.filter(device => {
        const statusMatch = filters.value.status.length === 0 || 
                          filters.value.status.includes(device.status_period)
        
        const locationMatch = filters.value.location.length === 0 || 
                            filters.value.location.includes(device.description)
        
        const uptimeMatch = device.uptime >= filters.value.uptime[0] && 
                           device.uptime <= filters.value.uptime[1]
        
        return statusMatch && locationMatch && uptimeMatch
      })
    })

    const fetchReport = async () => {
      loading.value = true
      try {
        const response = await fetch(`http://127.0.0.1:8007/api/report?type=${period.value}`)
        const data = await response.json()
        report.value = data.report
        
        // Qurilmalar uchun ishlash vaqtini hisoblash
        report.value.devices = report.value.devices.map(device => ({
          ...device,
          uptime: calculateDeviceUptime(device)
        }))
      } catch (error) {
        console.error('Hisobot olishda xatolik:', error)
      } finally {
        loading.value = false
      }
    }

    const calculateDeviceUptime = (device) => {
      // Simulyatsiya: Haqiqiy ma'lumotlar backend'dan kelishi kerak
      return Math.floor(Math.random() * (100 - 50) + 50)
    }

    const calculateAverageUptime = (devices) => {
      if (!devices || devices.length === 0) return 0
      const total = devices.reduce((sum, device) => sum + device.uptime, 0)
      return (total / devices.length).toFixed(1)
    }

    const setPeriod = async (newPeriod) => {
      period.value = newPeriod
      await fetchReport()
    }

    const toggleFilters = () => {
      showFilters.value = !showFilters.value
    }

    const formatDate = (timestamp) => {
      if (!timestamp) return 'Mavjud emas'
      return moment(timestamp).format('DD.MM.YYYY HH:mm')
    }

    const downloadReport = () => {
      if (!report.value) return

      const data = selectedDevices.value.length > 0 
        ? selectedDevices.value 
        : report.value.devices

      const csvData = data.map(device => ({
        'Qurilma': device.number,
        'Tavsif': device.description || '',
        'Holat': device.status_period === 'active' ? 'Faol' : 'Nofaol',
        'Ishlash vaqti': `${device.uptime}%`,
        'Oxirgi faollik': formatDate(device.lastupdate)
      }))

      const csvContent = "data:text/csv;charset=utf-8," + 
        Object.keys(csvData[0]).join(",") + "\n" +
        csvData.map(row => Object.values(row).join(",")).join("\n")

      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", `qurilmalar_hisoboti_${period.value}_${moment().format('YYYY-MM-DD')}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    onMounted(() => {
      fetchReport()
    })

    return {
      period,
      report,
      loading,
      showFilters,
      selectedDevices,
      filters,
      statusOptions,
      locationOptions,
      filteredDevices,
      setPeriod,
      toggleFilters,
      formatDate,
      downloadReport,
      calculateAverageUptime
    }
  }
}
</script>

<style scoped>
.reports {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
}

.reports-header {
  background: var(--card-bg);
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
}

h1 {
  color: var(--text-primary);
  font-size: 1.75rem;
  margin: 0;
  flex-shrink: 0;
}

.summary-info {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.stat-item {
  background: rgba(255,255,255,0.05);
  padding: 1rem 1.5rem;
  border-radius: 0.8rem;
  min-width: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.stat-item.success .stat-value {
  color: var(--success-color);
}

.stat-item.danger .stat-value {
  color: var(--danger-color);
}

.stat-item.info .stat-value {
  color: var(--accent-color);
}

.report-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: 1rem;
}

.period-selector {
  display: flex;
  gap: 1rem;
}

.period-selector :deep(.p-button) {
  background: rgba(255,255,255,0.1);
  border: none;
  color: var(--text-secondary);
  transition: all 0.3s;
}

.period-selector :deep(.p-button.active) {
  background: var(--accent-color);
  color: var(--text-primary);
}

.period-selector :deep(.p-button:hover) {
  background: var(--accent-color);
  color: var(--text-primary);
  transform: translateY(-2px);
}

.report-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.summary-card {
  background: var(--card-bg) !important;
  border-radius: 1rem;
  overflow: hidden;
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

.summary-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  padding: 1rem 0;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem;
  background: rgba(255,255,255,0.05);
  border-radius: 1rem;
  transition: transform 0.3s;
}

.summary-item:hover {
  transform: translateY(-5px);
}

.summary-item label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.summary-item span {
  font-size: 2rem;
  font-weight: bold;
  line-height: 1.2;
}

.summary-item span.total {
  color: var(--accent-color);
}

.summary-item span.active {
  color: var(--success-color);
}

.summary-item span.inactive {
  color: var(--danger-color);
}

.devices-list {
  background: var(--card-bg) !important;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.devices-list :deep(.p-datatable-header) {
  background: var(--card-bg);
  border: none;
  padding: 1rem;
}

.devices-list :deep(.p-datatable-thead > tr > th) {
  background: var(--card-bg);
  border: none;
  color: var(--text-secondary);
  font-weight: 600;
  padding: 1rem;
  text-transform: uppercase;
  font-size: 0.75rem;
}

.devices-list :deep(.p-datatable-tbody > tr) {
  background: var(--card-bg);
  transition: all 0.2s ease;
}

.devices-list :deep(.p-datatable-tbody > tr:hover) {
  background: rgba(255, 255, 255, 0.05);
}

.devices-list :deep(.p-datatable-tbody > tr > td) {
  border: none;
  padding: 0.8rem 1rem;
  color: var(--text-primary);
}

.device-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.device-icon {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.device-icon i {
  color: var(--text-primary);
  font-size: 1.2rem;
}

.device-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.device-name {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.95rem;
}

.device-description {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.device-status {
  padding: 0.4rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  text-align: center;
  display: inline-block;
  min-width: 80px;
}

.device-status.active {
  background: rgba(76, 175, 80, 0.15);
  color: var(--success-color);
}

.device-status.inactive {
  background: rgba(244, 67, 54, 0.15);
  color: var(--danger-color);
}

.timestamp-cell {
  display: flex;
  align-items: center;
}

.time {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.device-link {
  color: var(--accent-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.device-link:hover {
  color: var(--text-primary);
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.status-badge::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-badge.active {
  background: rgba(76, 175, 80, 0.15);
  color: var(--success-color);
}

.status-badge.active::before {
  background: var(--success-color);
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.status-badge.inactive {
  background: rgba(244, 67, 54, 0.15);
  color: var(--danger-color);
}

.status-badge.inactive::before {
  background: var(--danger-color);
  box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.2);
}

/* Paginatsiya stillari */
.devices-list :deep(.p-paginator) {
  background: var(--card-bg);
  border: none;
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.devices-list :deep(.p-paginator-element) {
  color: var(--text-secondary);
  border: none;
  background: transparent;
  width: 2.2rem;
  height: 2.2rem;
  margin: 0 0.1rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.devices-list :deep(.p-paginator-pages) {
  display: flex;
  gap: 0.2rem;
}

:deep(.p-paginator .p-paginator-element:not(.p-highlight):not(.p-disabled):hover) {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

:deep(.p-paginator .p-paginator-element.p-highlight) {
  background: var(--accent-color);
  color: var(--text-primary);
}

:deep(.p-paginator .p-paginator-current) {
  color: var(--text-secondary);
  margin: 0 1rem;
}

:deep(.p-dropdown) {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

:deep(.p-dropdown:not(.p-disabled):hover) {
  border-color: var(--accent-color);
}

:deep(.p-dropdown-panel) {
  background: var(--card-bg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

:deep(.p-dropdown-item) {
  color: var(--text-secondary);
  padding: 0.75rem 1rem;
  border-radius: 4px;
  margin: 0.2rem;
}

:deep(.p-dropdown-item:hover) {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

:deep(.p-dropdown-item.p-highlight) {
  background: var(--accent-color);
  color: var(--text-primary);
}
</style>
