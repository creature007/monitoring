<template>
  <div class="app-container">
    <nav class="sidebar">
      <div class="nav-brand">
        <i class="pi pi-server"></i>
        Monitoring
      </div>
      <div class="nav-links">
        <router-link to="/" class="nav-link">
          <i class="pi pi-home"></i>
          <span>Dashboard</span>
        </router-link>
        <router-link to="/statistics" class="nav-link">
          <i class="pi pi-chart-bar"></i>
          <span>Statistika</span>
        </router-link>
        <router-link to="/reports" class="nav-link">
          <i class="pi pi-file"></i>
          <span>Hisobotlar</span>
        </router-link>
      </div>
    </nav>

    <main class="main-content">
      <header class="top-bar">
        <div class="top-right">
          <span class="date-time">{{ currentDateTime }}</span>
          <i class="pi pi-bell"></i>
          <i class="pi pi-user"></i>
        </div>
      </header>

      <div class="content-area">
        <Toast />
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'App',
  data() {
    return {
      currentDateTime: ''
    }
  },
  created() {
    this.updateDateTime()
    setInterval(this.updateDateTime, 1000)
  },
  methods: {
    updateDateTime() {
      this.currentDateTime = moment().format('DD.MM.YYYY HH:mm:ss')
    }
  }
}
</script>

<style>
:root {
  --primary-bg: #706c6cff;
  --secondary-bg: #706c6cff;
  --card-bg: #080a1fff;
  --text-primary: #ffffff;
  --text-secondary: #706c6cff;
  --accent-color: #080a1fff;
  --success-color: #4caf50;
  --warning-color: #ff9800;
  --danger-color: #f44336;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: var(--primary-bg);
  color: var(--text-primary);
}

.app-container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 260px;
  background: var(--card-bg);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-primary);
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-link {
  text-decoration: none;
  color: var(--text-secondary);
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: var(--accent-color);
  color: var(--text-primary);
}

.main-content {
  flex: 1;
  background: var(--primary-bg);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.top-bar {
  background: var(--card-bg);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}



.top-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.date-time {
  color: var(--text-secondary);
}

.content-area {
  padding: 2rem;
  flex: 1;
  overflow-y: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* PrimeVue komponentlari uchun stillash */
:deep(.p-card) {
  background: var(--card-bg);
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

:deep(.p-card .p-card-title) {
  color: var(--text-primary);
}

:deep(.p-card .p-card-content) {
  color: var(--text-secondary);
}

:deep(.p-button) {
  background: var(--accent-color);
  border: none;
  border-radius: 0.5rem;
}

:deep(.p-datatable) {
  background: var(--card-bg);
  border-radius: 1rem;
  overflow: hidden;
}

:deep(.p-datatable .p-datatable-header) {
  background: var(--card-bg);
  border: none;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: var(--card-bg);
  color: var(--text-primary);
  border: none;
  padding: 1rem;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  background: var(--card-bg);
  transition: background-color 0.3s;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background: rgba(255,255,255,0.05);
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  border: none;
  color: var(--text-secondary);
}
</style>
