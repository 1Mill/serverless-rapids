const fs = require('fs')

const fileMaps = []
const functionsDir = process.env.FUNCTIONS_DIR
if (functionsDir) {
	try {
		fs
		.readdirSync(functionsDir)
		.filter(file => file.endsWith('.json'))
		.map(file => `${functionsDir}/${file}`)
		.map(path => fs.readFileSync(path, 'utf8'))
		.map(json => JSON.parse(json || '[]'))
		.forEach(array => {
			array.forEach(item => fileMaps.push(item))
		})
	} catch(err) {
		throw new Error(err)
	}
}

const getFunctionIds = ({ functionType, type }) => Array.from(new Set(
	[...fileMaps, ...JSON.parse(process.env.FUNCTIONS || JSON.stringify([]))]
	.filter(m => m.functionType === functionType)
	.filter(m => m.type === type)
	.map(m => m.functionId)
))

module.exports = { getFunctionIds }
