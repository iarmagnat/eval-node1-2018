const fs = require("fs")

let current_app

let current = 0

function init(app) {

    current_app = app

    app.use((req, res, next) => {
        current++
        addToAllTime(next)
    })

}

function addToAllTime(callback, amount = 1) {
    changeAllTime("add", amount)
        .then(data => {
            callback()
        })
        .catch(err => {
            console.error(err)
        })
}

function allTimeCount(port = false) {
    if (!port) {
        port = current_app.port
    }
    return new Promise((resolve, reject) => {
            fs.readFile(
                __dirname + "/count/all.json",
                {encoding: "utf8"},
                (err, file) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(JSON.parse(file)[String(port)])
                    }
                }
            )
        }
    )
}

function changeAllTime(operation, value, port = false) {
    return new Promise((resolve, reject) => {
        if (!port) {
            port = current_app.port
        }
        const onFileOpen = (err, file) => {
            if (err) {
                reject(err)
            } else {
                const newFile = JSON.parse(file)

                if (operation === "set") {
                    newFile[String(port)] = value
                } else if (operation === "add") {
                    if (newFile[String(port)] !== undefined) {
                        newFile[String(port)] += value
                    } else {
                        newFile[String(port)] = value
                    }
                }

                fs.writeFile(__dirname + '/count/all.json',
                    JSON.stringify(newFile),
                    (err) => {
                        if (err) {
                            reject(err)
                        }
                        resolve(newFile[String(port)])
                    }
                )
            }
        }

        fs.readFile(
            __dirname + "/count/all.json",
            {encoding: "utf8"},
            onFileOpen
        )
    })
}


function count() {
    // this is silly but that way, the API for count and allTimeCount is the same
    return new Promise(resolve => {
        resolve(current)
    })
}

function reset(counter) {
    if (counter === "current") {
        return new Promise(resolve => {
            current = 0
            resolve(true)
        })
    } else if (counter === "allTime") {
        return new Promise((resolve, reject) => {
            changeAllTime("set", 0)
                .then(data => {
                    resolve(true)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
    throw "Error: wrong counter"
}

module.exports = {
    init: init,
    count: count,
    allTimeCount: allTimeCount,
    reset: reset,
}