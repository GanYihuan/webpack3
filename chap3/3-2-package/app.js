// es module
import sum from './sum'

// commonjs
var minus = require('./minus')

// amd: 异步
require(['./muti'], function(muti) {
	console.log('muti(2, 3) =', muti(2, 3))
})

console.log('sum(23, 24) =', sum(23, 24))
console.log('minus(25, 5) =', minus(25, 5))
console.log('muti(2, 3) =', muti(2, 3))
