import 'babel-polyfill'

const NUM = 45
let func = () => {}
let arr = [1, 2, 3]
let arrB = arr.map(item => item * 2)

arr.includes(8)

console.log('Set(arrB)', new Set(arrB))

function* func() {

}
