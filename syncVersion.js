const version = require('./package.json').version
const fs = require('fs')

fs.writeFile('./src/version.ts', `export default '${version}'\n`, 'utf8', () => console.log('Version synced -> ', version))
