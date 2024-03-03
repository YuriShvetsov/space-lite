import { createStore, createLogger } from 'vuex'
import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

const debug = process.env.NODE_ENV !== 'production'

// window.localStorage.removeItem('todos')

const store = createStore({
  state,
  getters,
  mutations,
  actions,
  plugins: debug ? [createLogger()] : []
});

store.dispatch('init')

export default store
