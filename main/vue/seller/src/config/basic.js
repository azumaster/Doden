let date = require('silly-datetime')
let dateTime = date.format(new Date(), 'YYYYMMDDHHmm')
let basic = {
  pageUri: '/',
  baseApi: `${window.location.protocol}//${window.location.host}`,
  AliOssPictureCdn: 'http://img.idongpin.com/',
  TencentPictureCdn: 'http://cdn2.img.idongpin.com/',
  pagesVersion: `v0.0.1.${dateTime}`,
  productionTip: false
}

export default basic
