'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',

	WEB_API: '"http://10.8.0.245:8603"',
	PICTURE_HOST: '"http://10.8.0.245:8600"',


})
