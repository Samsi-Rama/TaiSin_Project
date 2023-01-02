import axios from '@/axios.js'
import router from '@/router/index.js'

export default {
  fetchNote: ({ commit }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`/common/notes`)
        .then(res => {
          commit('FETCH_NOTE', res.data)
          resolve()
        })
        .catch(err => reject(err))
    })
  },
  addNote: ({commit}, payload) => {
    return new Promise((resolve, reject) => {
      axios
      .post('/common/notes', payload)
      .then(res => {
        commit('ADD_NOTE', res.data.data)
        resolve()
      })
      .catch(err => reject(err))
    })
  },
  updateNote: ({ commit }, { id, data }) => {
    return new Promise((resolve, reject) => {
      axios
        .put('/common/notes/' + id, data)
        .then(res => {
          commit('UPDATE_NOTE', res.data.data)
          resolve()
        })
        .catch(err => reject(err))
    })
  },
  deleteNote: ({ commit }, { id }) => {
    return new Promise((resolve, reject) => {
      axios
        .delete('/common/notes/' + id)
        .then(() => {
          commit('DELETE_NOTE', id)
          resolve()
        })
        .catch(err => reject(err))
    })
  }
}