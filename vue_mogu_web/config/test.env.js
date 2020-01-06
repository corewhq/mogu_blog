'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',

  //配置测试环境
	WEB_API: '"http://10.8.0.245:8603"',
  PICTURE_HOST: '"http://10.8.0.245:8600"',

})
