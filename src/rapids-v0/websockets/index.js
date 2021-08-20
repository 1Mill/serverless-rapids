const Pusher = require('pusher')

const CHANNEL_DELIMITER = '::'
const CHANNEL_NAMESPACE = 'rapids-v0'
const CHANNLE_VERSION = '2021-08-19'

const pusher = new Pusher({
	appId: process.env.PUSHER_APPID,
	cluster: process.env.PUSHER_CLUSTER,
	key: process.env.PUSHER_KEY,
	secret: process.env.PUSHER_SECRET,
	useTLS: true,
})

const perform = async ({ cloudevent, ctx }) => {
	const { id, source, type } = cloudevent

	// ! Attribute order matters for clients to connect
	// ! to the correct channel
	// private::rapids-v0::2021-08-19::com.myreallylongwebsitename.mysubdomain::79959f93-d298-41b5-a299-e58a3e2fb82b
	const channel = [
		'private',
		CHANNEL_NAMESPACE,
		CHANNLE_VERSION,
		source,
		id,
	].join(CHANNEL_DELIMITER)
	const message = type
	const payload = { cloudevent }

	await pusher.trigger(channel, message, payload)
}

exports.handler = async (event, ctx) => await perform({ cloudevent: event || {}, ctx })
