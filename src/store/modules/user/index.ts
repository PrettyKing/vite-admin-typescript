import createStore from "./store"

import getters from './getters'
import mutations from './mutations'
import actions from './actions'

//引入vuex 数据持久化插件
import createPersistedState from 'vuex-persistedstate';

const state = createStore()
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
    // plugins: [
    //     createPersistedState({
    //         reducer(val) {
    //             console.log(val)
    //             return {
    //                 breadList: []
    //             }
    //         }
    //     })
    // ]
}