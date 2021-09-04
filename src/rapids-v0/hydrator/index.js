const { Lambda } = require('@1mill/lambda')
const { getFunctionIds } = require('./getFunctionIds')

const lambda = new Lambda({})

exports.handler = async (cloudevent = {}, ctx = {}) => {
	// * https://www.jeremydaly.com/reuse-database-connections-aws-lambda/
	ctx.callbackWaitsForEmptyEventLoop = false

	const functionIds = [
		'rapids-v0-websockets',
		...getFunctionIds({
			functionType: 'lambda',
			type: cloudevent.type,
		}),
	]

	const promises = functionIds.map(async id => await lambda.invoke({
		cloudevent,
		functionName: id,
	}))

	const responses = await Promise.allSettled(promises)
	responses
		.filter(res => res.status === 'rejected')
		.forEach(res => {
			console.error(res.reason)
			throw new Error(res.reason)
		})

	return true
}
