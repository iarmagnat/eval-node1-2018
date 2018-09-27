const fs = require("fs")

let current_app

let current = {}

function getPort(req) {
    const regex = /.+:(\d+)/
    const str = req.get("host")
    return regex.exec(str)[1]
}


function init(app, port) {

    current_app = app


        app.use((req, res, next) => {
            const port = getPort(req)
            if (current[port]) {
                current[port]++
            } else {
                current[port] = 1
            }
            addToAllTime(port, next)
        })

    createAllTimeIfNeeded(port)

}

function createAllTimeIfNeeded(port) {
    fs.stat(
        __dirname + "/count/" + port + ".json",
        (err) => {
            if (err) {
                if (err.code === "ENOENT") {
                    fs.writeFile(
                        __dirname + "/count/" + port + ".json",
                        JSON.stringify({
                            [port]: 0,
                        }),
                        (err) => {
                            if (err) {
                                throw err
                            }
                        }
                    )
                } else {
                    throw err
                }
            }
        })
}

function addToAllTime(port, callback, amount = 1) {
    changeAllTime("add", amount, port)
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
                __dirname + "/count/" + port + ".json",
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

function changeAllTime(operation, value, port) {
    return new Promise((resolve, reject) => {
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

                fs.writeFile(
                    __dirname + "/count/" + port + ".json",
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
            __dirname + "/count/" + port + ".json",
            {encoding: "utf8"},
            onFileOpen
        )
    })
}


function count(port) {
    // this is silly but that way, the API for count and allTimeCount is the same
    return new Promise(resolve => {
        resolve(current[port])
    })
}

function reset(counter, port) {
    if (counter === "current") {
        return new Promise(resolve => {
            current[port] = 0
            resolve(true)
        })
    } else if (counter === "allTime") {
        return new Promise((resolve, reject) => {
            changeAllTime("set", 0, port)
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
    getPort: getPort,
}