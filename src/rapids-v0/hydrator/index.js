const { invoke } = require('@1mill/lambda')

const config = {
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	endpoint: process.env.AWS_ENDPOINT,
	region: process.env.AWS_REGION,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
}

const perform = async ({ cloudevent, ctx }) => {
	const payload = JSON.stringify({ cloudevent })
	await Promise.allSettled([
		// invoke({
		// 	...config,
		// 	functionName: 'rapids-v0-journal',
		// 	payload,
		// }),
		invoke({
			...config,
			functionName: 'rapids-v0-websockets',
			payload,
		}),
	])
}

exports.handler = async (cloudevent, ctx) => await perform({ cloudevent, ctx })
