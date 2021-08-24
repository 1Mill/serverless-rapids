const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda')
const { getFunctionIds } = require('./getFunctionIds')
const { v6: { createCloudevent } } = require('@1mill/cloudevents')

let client = null

const perform = async ({ cloudevent , ctx }) => {
	cloudevent = {
		data: JSON.stringify({ myData: 'yes' }),
		id: 'test',
		source: 'dev-test',
		type: 'hello.v2',
	}

	createCloudevent({ ...cloudevent }) // * Validate attributes of cloudevent

	// * https://www.jeremydaly.com/reuse-database-connections-aws-lambda/
	ctx.callbackWaitsForEmptyEventLoop = false
	if (!client) {
		client = new LambdaClient({
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY_ID,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
			},
			endpoint: process.env.AWS_ENDPOINT,
			maxAttempts: 3,
			region: process.env.AWS_REGION,
		})
	}

	const functionIds = [
		'rapids-v0-websockets',
		...getFunctionIds({ functionType: 'lambda', type: cloudevent.type }),
	]
	const commands = functionIds.map(id => new InvokeCommand({
		FunctionName: id,
		InvocationType: process.env.NODE_ENV === 'development' ? 'Event' : 'RequestResponse',
		Payload: JSON.stringify(cloudevent),
	}))
	const promises = commands.map(async c => await client.send(c))

	const responses = await Promise.allSettled(promises)
	responses.filter(res => res.status === 'rejected').forEach(res => console.error(res.reason))
	return responses
}

exports.handler = async (cloudevent = {}, ctx = {}) => await perform({ cloudevent, ctx })
