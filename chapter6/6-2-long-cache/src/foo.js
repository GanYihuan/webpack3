import module from './module'

// import('./async').then(function(a) {
// 	console.log('async')
// })
import(/* webpackChunkName: 'async' */ './async').then(function(a) {
	console.log('async')
})

console.log('foo.js !! ' + module)
