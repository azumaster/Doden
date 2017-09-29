import {getApi, toast, showLoading, closeLoading} from './common'
// import Vue from 'vue'
// import VueResource from 'vue-resource'
import axios from 'axios'
import qs from 'qs'
let Promise = require('es6-promise').Promise
// axios.defaults.headers.common['Accept'] = 'application/json'
// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
// axios.defaults.headers.post['Content-Type'] = 'application/json'
// Vue.use(VueResource)
// Vue.http.options.emulateJSON = true

/**
 * post请求
 * @param apiPath
 * @param data
 * @param requestType 请求头类型
 * @returns {Promise}
 */
export function post (apiPath, data = {}, requestType = 'json') {
  let apiUri = getApi(apiPath)
  if (!apiUri) {
    toast(`Api [${apiPath}] is not find!`)
    throw new Error('Api is not find!')
  }
  let loadingId
  let autoLoading = setTimeout(() => {
    loadingId = showLoading()
  }, 1000)

  let headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
  if (requestType === 'form') {
    headers = {
      'Accept': '*/*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest'
    }
  }

  return new Promise((resolve, reject) => {
    axios.post(apiUri, data, {
      headers: headers,
      transformRequest: [function (data) {
        if (requestType === 'json') {
          return JSON.stringify(data)
        }
        return qs.stringify(data)
      }]
    })
    .then(r => {
      closeLoading(loadingId)
      clearTimeout(autoLoading)

      if (r.status === 200) {
        if (
          (typeof r.data.status !== 'undefined' &&
            parseInt(r.data.status) !== 0) ||
          (typeof r.data.code !== 'undefined' && parseInt(r.data.code) !== 0)) {
          toast(r.data.message)
        }
        resolve(r.data)
      } else {
        toast('请求错误: ' + JSON.stringify(r))
        reject(r)
      }
    }, e => {
      closeLoading(loadingId)
      clearTimeout(autoLoading)
      toast(JSON.stringify(e))
      console.log(e)
      reject(e)
    })
  })
}

/**
 * get请求
 * @param apiPath
 * @param requestType 请求头类型
 * @param data
 */
export function get (apiPath, data = {}, requestType = 'form') {
  let apiUri = getApi(apiPath)
  if (!apiUri) {
    toast(`Api [${apiPath}] is not find!`)
    throw new Error('Api is not find!')
  }
  let loadingId
  let autoLoading = setTimeout(() => {
    loadingId = showLoading()
  }, 1000)
  let headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
  if (requestType === 'form') {
    headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Requested-With': 'XMLHttpRequest'
    }
  }

  return new Promise((resolve, reject) => {
    return axios({
      url: apiUri,
      method: 'get',
      headers: headers,
      params: data
    }).then(r => {
      console.log(r)
      closeLoading(loadingId)
      clearTimeout(autoLoading)
      if (r.status === 200) {
        if (
          (typeof r.data.status !== 'undefined' &&
            parseInt(r.data.status) !== 0) ||
          (typeof r.data.code !== 'undefined' && parseInt(r.data.code) !== 0)) {
          toast(r.data.message)
        }
        resolve(r.data)
      } else {
        toast('请求错误: ' + JSON.stringify(r))
        reject(r)
      }
    }, e => {
      closeLoading(loadingId)
      clearTimeout(autoLoading)

      toast('请求失败,请检查您的网络!')
      console.log(e)
      reject(e)
    })
  })
}
