const perform = async () => {
	console.log('Hello world!')
}

exports.handler = async (event, ctx) => await perform({ cloudevent: event, ctx })
