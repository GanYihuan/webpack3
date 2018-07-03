import * as _ from 'lodash'

console.log(_.chunk([1, 2, 3, 4, 5], 2))

const NUM = 45

interface Cat {
	name: String
	sex: String
}

function touchaCat(cat: Cat) {
	console.log('miao', cat.name)
}

touchaCat({
	name: 'tom',
	sex: 'male'
})
