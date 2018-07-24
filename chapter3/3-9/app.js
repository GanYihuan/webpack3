import base from './css/base.css'
import common from './css/common.css'

/* webpack.config.js */
/* loader: 'style-loader/useable' */
/* 是否使用 style-loader */
base.use()
base.unuse()

var flag = false;

setInterval(function () {
  if (flag) {
    base.unuse()
    flag = false
  } else {
    base.use()
  }
})