import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    devices: [],
    statistics: null,
    loading: false,
    error: null
  },
  mutations: {
    SET_DEVICES(state, devices) {
      state.devices = devices
    },
    SET_STATISTICS(state, statistics) {
      state.statistics = statistics
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },
  actions: {
    async fetchDevices({ commit }) {
      try {
        commit('SET_LOADING', true)
        const response = await axios.get('http://127.0.0.1:8007/api/devices')
        commit('SET_DEVICES', response.data.devices)
      } catch (error) {
        commit('SET_ERROR', error.message)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async fetchStatistics({ commit }) {
      try {
        commit('SET_LOADING', true)
        const response = await axios.get('http://127.0.0.1:8007/api/statistics')
        commit('SET_STATISTICS', response.data.statistics)
      } catch (error) {
        commit('SET_ERROR', error.message)
      } finally {
        commit('SET_LOADING', false)
      }
    }
  },
  getters: {
    onlineDevices: state => state.devices.filter(device => device.online),
    offlineDevices: state => state.devices.filter(device => !device.online),
    deviceById: state => id => state.devices.find(device => device.id === id)
  }
})
