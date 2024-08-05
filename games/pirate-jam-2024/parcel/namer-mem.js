const { Namer } = require('@parcel/plugin')
const path = require('path')

module.exports = new Namer({
  async name({ bundle }) {
    if (bundle.type === 'mem') {
        // Return the original name of .mem files to avoid adding a hash to the filename
        // This is very important, otherwise .js files that require them won't work
        return path.basename(bundle.getMainEntry().filePath)
    }

    return null
  },
})