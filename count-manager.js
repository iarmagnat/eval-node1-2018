const fs = require("fs")

let current_app

let current = 0

function init(app) {

    current_app = app

    app.use((req, res, next) => {
        current++
        addToAllTime()
        next()
    })

}

function addToAllTime(amount = 1) {
    const onFileOpen = (err, file) => {
        if (err) {
            console.error(err)
        } else {
            const newFile = JSON.parse(file)
            if (newFile[String(current_app.port)]) {
                newFile[String(current_app.port)] += amount
            } else {
                newFile[String(current_app.port)] = 1
            }

            fs.writeFile(__dirname + '/count/all.json',
                JSON.stringify(newFile),
                (err) => {
                    if (err) {
                        console.error(err)
                    }
                }
            )
        }
    }

    fs.readFile(
        __dirname + "/count/all.json",
        {encoding: "utf8"},
        onFileOpen
    )
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


function count() {
    // this is silly but that way, the API for count and allTimeCount is the same
    return new Promise(resolve => {
        resolve(current)
    })
}

module.exports = {
    init: init,
    count: count,
    allTimeCount: allTimeCount,
}