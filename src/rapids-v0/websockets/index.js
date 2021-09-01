const Ably = require('ably/promises')
const { Journal } = require('@1mill/journal')

const CHANNEL_NAME = 'rapids-v0:2021-08-20'

const journal = new Journal({})

const perform = async ({ cloudevent, ctx }) => {
	ctx.callbackWaitsForEmptyEventLoop = false

	try {
		const { skip } = await journal.entry({ cloudevent })
		if (skip) return

		if (!cloudevent.type) throw new Error('[contract] cloudevent.type is required')

		// * REST library is stateless so we don't have to manage connection state
		// * https://knowledge.ably.com/should-i-use-the-rest-or-realtime-library
		const client = new Ably.Rest.Promise(process.env.ABLY_API_KEY)
		const channel = client.channels.get(CHANNEL_NAME)
		await channel.publish(cloudevent.type, { cloudevent })
	} catch (err) {
		console.error(err)
		await journal.erase({ cloudevent })
		throw new Error(err)
	}
}

exports.handler = async (cloudevent = {}, ctx = {}) => await perform({ cloudevent, ctx })
