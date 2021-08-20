const Ably = require('ably/promises')

const CHANNEL_DELIMITER = ':'
const CHANNEL_NAMESPACE = 'rapids-v0'
const CHANNLE_VERSION = '2021-08-20'

const perform = async ({ cloudevent, ctx }) => {
	const { id , source, type } = cloudevent

	// ! Attribute order matters for clients to
	// ! connect to the correct channel
	// rapids-v0:2021-08-19:com.myreallylongwebsitename.mysubdomain:79959f93-d298-41b5-a299-e58a3e2fb82b
	const channelName = [
		CHANNEL_NAMESPACE,
		CHANNLE_VERSION,
		source,
		id,
	].join(CHANNEL_DELIMITER)

	// * REST library is stateless so we don't have to manage connection state
	// * https://knowledge.ably.com/should-i-use-the-rest-or-realtime-library
	const client = new Ably.Rest.Promise(process.env.ABLY_API_KEY)
	const channel = client.channels.get(channelName)
	await channel.publish(type, { cloudevent })
}

exports.handler = async (cloudevent, ctx) => await perform({ cloudevent, ctx })
