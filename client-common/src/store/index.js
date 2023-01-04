import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import app from './app'
import appConfig from './app-config'
import verticalMenu from './vertical-menu'

// Common Modules
import moduleApplication from './application/moduleApplication'
import moduleAuth from './auth/moduleAuth'
import moduleItem from './item/moduleItem'
import moduleRole from './role/moduleRole'
import moduleUser from './user/moduleUser'
import moduleNote from './note/moduleNote'
import moduleDashboard from './dashboard/moduleDashboard'
import modulePlant from './plant/index'
import bom from './bom'

import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  getters,
  mutations,
  state,
  actions,
  modules: {
    app,
    appConfig,
    verticalMenu,
    bom,

    // Common
    application: moduleApplication,
    auth: moduleAuth,
    item: moduleItem,
    role: moduleRole,
    user: moduleUser,
    note: moduleNote,
    dashboard: moduleDashboard,
    plant : modulePlant
  },
  strict: process.env.DEV,
})
