const fs = require("fs")


function isReady(filename) {
    // we return a promise
    return new Promise((resolve, reject) => {
        // That checks if the given file exists
        fs.stat(__dirname + filename, (err) => {
            if (err) {
                if (err.code === "ENOENT") {
                    // if it don't exist,  resole to false
                    resolve(false)
                } else {
                    // it another error is thrown, propagate it and reject the promise
                    reject(err)
                }
            } else {
                // if it exists resolve to true
                resolve(true)
            }
        })
    })
}

function isNodeModulesReady() {
    return isReady("/node_modules")
}

module.exports = isNodeModulesReady