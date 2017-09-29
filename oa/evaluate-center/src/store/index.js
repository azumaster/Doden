import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
  //  todos: [
  //     { id: 1, text: 'yym', done: true },
  //     { id: 2, text: 'yw', done: false },
  //     { id: 3, text: 'yuy', done: true }
  //   ],
    orderIds: null,
    soOrderIds: null,
    dianpuName: null,
    goods_name: null,
    beginTime: null,
    endTime: null,
    nowPage: 1,
  },
  getters: {  //
	  	// doneTodos: state => {
	    //   return state.todos.filter(todo => todo.done)
	    // }

  },
  mutations: {
  	//  increment: (state) => {state.count ++;}
  },
  actions: {
  	// increment (context) {
  	// 	context.commit('increment')
  	// },
    // async actionA ({commit}) {
    //   commit ('gotdata', await getdata())
    // },
    // async actionB ({dispatch, commit}) {
    //   await dispatch ('actionA') //等待actionA完成
    //   commit('gotOtherData', await getOtherData())
    // }
  }
});
export default store;