export default {
    FETCH_NOTE: (state, payload) => {
      state.note = payload
    },
    ADD_NOTE: (state, payload) => {
      state.note.push(payload)
    },
    UPDATE_NOTE: (state, payload) => {
      let note = state.note.find(n => n.id === payload.id)
    },
    DELETE_NOTE: (state, payload) => {
      let i = state.note.findIndex(u => u.id === payload)
      state.note.splice(i, 1)
    }
  }