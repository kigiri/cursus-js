const fs = require('fs')

fs.readdirSync('test').map(file => `./test/${file}`).forEach(require)
