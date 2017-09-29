/**
 * 全局指令注册钩子
 */
import Vue from 'vue'
import waves from '@directive/waves/waves.js'
console.log(waves)
Vue.directive('waves', waves)
