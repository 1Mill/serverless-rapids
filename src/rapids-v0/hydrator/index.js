const { invoke } = require('@1mill/lambda')

const perform = async () => {
	console.log('Hello world!')
	console.log('Hello world!')
	console.log(invoke)
	console.log('Hello world!')
	console.log('Hello world!')
}

exports.handler = async (event, ctx) => await perform({ cloudevent: event, ctx })
