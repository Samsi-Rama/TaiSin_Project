import state from './moduleNoteState.js'
import mutations from './moduleNoteMutations.js'
import actions from './moduleNoteActions.js'
import getters from './moduleNoteGetters.js'

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}