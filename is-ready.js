const fs = require("fs")


function isreadyV1(filename) {
    fs.stat(__dirname + filename, (err) => {
        if (err) {
            if (err.code === "ENOENT") {
                errlog("Not ready")
                process.exit(255)
            } else {
                errlog(err)
                process.exit(1)
            }
        } else {
            warnlog("maybe")
            process.exit(0)
        }
    })
}

function errlog(message) {
    console.log("\033[0;31m" + message + "\033[1;37m")
}
function warnlog(message) {
    console.log("\033[0;33m" + message + "\033[1;37m")
}

// isreadyV1("/node_modules")

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

module.exports = {
    isReady: isReady,
    isNodeModulesReady: isNodeModulesReady
}