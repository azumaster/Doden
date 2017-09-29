import config from '../config/basic'
import api from '../config/api'
import apiMock from '../config/api.mock'
import layer from '../vendor/layer/layer'
import '../vendor/layer/need/layer.css'
import '../vendor/showloading/loading.css'
import loading from '../vendor/showloading/loading'

/**
 * @introduction: 剪切URL路径，组装需要规格的图片地址
 * @date: 2015-03-26 12：58
 * @param:url String 图片地址
 * @param:width Number 图片宽度
 * @param:height Number 图片高度
 * @returns {*}
 */
export function pictureLinkProcessing (url, width, height, type = 1) {
  switch (parseInt(type)) {

    case 1 :
      if (parseInt(width) && parseInt(height)) {
        // 按比例裁剪
        url = url + '?x-oss-process=image/crop,x_' + width + ',y_' + height
      }
      break
    case 2 :
      // 按照宽度缩放
      if (parseInt(width)) {
        url = url + '?x-oss-process=image/resize,w_' + width
      }
      break
    case 3 :
      // 按照高度缩放
      if (parseInt(height)) {
        url = url + '?x-oss-process=image/resize,h_' + height
      }
      break
    default:
      // url = url.replace(/\/+/g, '/')
      // url = url.replace(':/', ':// ')
      // url = url.replace('/merchant/merchant/', '/merchant/')
      // url = url.replace('/member/member/', '/member/')
      return url
  }
  // url = url.replace(/\/+/g, '/')
  // url = url.replace(':/', ':// ')
  // url = url.replace('/merchant/merchant/', '/merchant/')
  // url = url.replace('/member/member/', '/member/')
  return url
}

/**
 * @description  获取全局配置
 * @param path  key.key.key 方式获取
 * @returns {*}
 */
export function getConfig (path = '') {
  let _config = config
  if (path === '') {
    return config
  }
  if (path.indexOf('.') >= 1) {
    let _path = path.split('.')
    for (let i = 0; i <= _path.length - 1; i++) {
      _path = _path[_path[i]]
    }
    if (!_path) {
      toast('config [' + path + '] is not find!')
      console.error('config [' + path + '] is not find!')
      return false
    }
    return _path
  } else {
    return _config[path]
  }
}

/***
 * 加载中
 * @param msg
 */
export function showLoading (msg = '加载中...') {
  loading.show(msg)
  // return layer.open({
  //   type: 2,
  //   // shade: false,
  //   content: msg
  // });
}

/**
 * 关闭加载提示
 * @param id
 */
export function closeLoading () {
  loading.hide()
}

/**
 * @description 接收url的get参数
 * @param key
 * @param url
 * @returns {*}
 */
export function getValueFromUrl (key, url = window.location.href) {
  let _data
  let data = {}
  if (url.indexOf('?') === -1) {
    return ''
  }

  _data = url.split('?')
  _data = _data[1]

  _data = _data.split('&')

  let _data_
  for (let i in _data) {
    _data_ = _data[i].split('=')
    data[decodeURI(_data_[0])] = decodeURI(_data_[1])
  }
  if (!data[key]) {
    return false
  }
  if (key && data[key]) {
    return data[key]
  }
  return data
}

/**
 * @description 读取api
 * @param apiName  // 示例  : home.sign.login
 */
export function getApi (apiName) {
  try {
    if (typeof apiName === 'undefined') {
      toast('get_api\'s apiName is error')
      console.error('get_api\'s apiName is error')
      return false
    }
    apiName = apiName.split('.')
    let _api = api
    if (process.env.NODE_ENV === 'development') {
      _api = apiMock
    }
    if (apiName.length > 1) {
      for (let i = 0; i <= apiName.length - 1; i++) {
        _api = _api[apiName[i]]
      }
      if (!_api) {
        toast(`api ${apiName} is not find!`)
        console.error(`api ${apiName} is not find!`)
        return false
      }
      return _api
    } else if (apiName.length === 1) {
      if (!_api[apiName]) {
        toast(`api ${apiName} is not find!`)
        console.error(`api ${apiName} is not find!`)
        return false
      }
      return _api[apiName]
    } else {
      toast(`api ${apiName} is not find!`)
      console.error(`api ${apiName} is not find!`)
      return false
    }
  } catch (e) {
    toast(e.toString())
    console.error(e)
  }
}

/**
 * alert 弹出层
 * @param options
 * @param callback
 */
export function alert (options, callback) {
  let _options = {
    content: '提示',
    btn: '确定'
  }
  if (typeof options === 'string') {
    _options.content = options
    _options.btn = '确定'
  } else if (typeof options === 'object') {
    if (options.content) {
      _options.contnet = options.content
    }
    if (options.btn) {
      _options.btn = options.btn
    }
  }
  layer.open({
    content: _options.content,
    btn: _options.btn,
    yes: function (r) {
      layer.closeAll()
      if (typeof callback === 'function') {
        callback(r)
      }
    }})
}

/**
 * alert confirm弹出层
 * @param options
 * @param callback
 */
export function confirm (options, callback) {
  let _options = {
    content: '',
    okBtn: '确定',
    cancelBtn: '关闭',
    title: '提示'
  }
  if (typeof options === 'string') {
    _options.content = options
  } else if (typeof options === 'object') {
    if (options.content) {
      _options.content = options.content
    }
    if (options.okBtn) {
      _options.okBtn = options.okBtn
    }
    if (options.cancelBtn) {
      _options.cancelBtn = options.cancelBtn
    }
    if (options.cancelBtn) {
      _options.cancelBtn = options.cancelBtn
    }
    if (options.title) {
      _options.title = options.title
    }
  }
  layer.open({
    title: [
      _options.title,
      'background-color:#1498fc; color:#fff;'
    ],
    anim: 'up',
    content: _options.content,
    btn: [_options.okBtn, _options.cancelBtn],
    yes: function (index) {
      layer.closeAll()
      if (typeof callback === 'function') {
        callback()
      }
    }})
}

/**
 * toast
 * @param message
 * @param time
 */
export function toast (message, time = 3, callback) {
  let _message = ''
  if (typeof message === 'object') {
    message = JSON.parse(message)
  }
  if (message) {
    _message = String(message)
  }
  console.log('layer:', layer)
  layer.open({
    content: _message,
    time: time,
    skin: 'msg',
    yes: function () {
      if (typeof callback === 'undefined') {
        callback()
      }
    }})
}

/**
 * 判断是否是空对象
 * @param obj
 * @returns {boolean}
 */
export function isEmptyObject (obj) {
  let name
  for (name in obj) {
    return false
  }
  return true
}
