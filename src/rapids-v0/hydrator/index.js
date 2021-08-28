const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda')
const { getFunctionIds } = require('./getFunctionIds')
const { v6: { createCloudevent } } = require('@1mill/cloudevents')

let aws = null

const perform = async ({ cloudevent , ctx }) => {
	// * https://www.jeremydaly.com/reuse-database-connections-aws-lambda/
	ctx.callbackWaitsForEmptyEventLoop = false

	createCloudevent({ ...cloudevent }) // * Validate attributes of cloudevent

	if (!aws) {
		aws = new LambdaClient({
			credentials: {
				accessKeyId: process.env.INVOKE_AWS_ACCESS_KEY_ID,
				secretAccessKey: process.env.INVOKE_AWS_SECRET_ACCESS_KEY,
			},
			endpoint: process.env.INVOKE_AWS_ENDPOINT,
			maxAttempts: 3,
			region: process.env.INVOKE_AWS_REGION,
		})
	}

	const functionIds = [
		'rapids-v0-websockets',
		...getFunctionIds({
			functionType: 'lambda',
			type: cloudevent.type,
		}),
	]
	const commands = functionIds.map(id => new InvokeCommand({
		FunctionName: id,
		InvocationType: process.env.NODE_ENV === 'development' ? 'Event' : 'RequestResponse',
		Payload: JSON.stringify(cloudevent),
	}))
	const promises = commands.map(async c => await aws.send(c))

	const responses = await Promise.allSettled(promises)
	responses
		.filter(res => res.status === 'rejected')
		.forEach(res => console.error(res.reason))

	return true
}

exports.handler = async (cloudevent = {}, ctx = {}) => await perform({ cloudevent, ctx })
