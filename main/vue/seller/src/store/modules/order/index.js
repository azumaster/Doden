import api from '@api'
export default {
  state: {
    orderTypeCount: {
      all: 0,
      shipment_pending: 0,
      waiting_for_delivery: 0,
      refund_goods: 0
    }
  },
  mutations: {
    REFRESH_TYPE_COUNT: (state, data) => {
      state.orderTypeCount = data
    }
  },
  getters: {
    typeCount: state => {
      return state.orderTypeCount
    }
  },
  actions: {
    refreshTypeCount ({commit}) {
      api.order.getOrderCount().then(data => {
        commit('REFRESH_TYPE_COUNT', data)
      })
    }
  }
}
