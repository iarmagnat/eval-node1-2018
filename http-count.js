const express = require("express")
const countManager = require("./count-manager")
const templates = require("./templates")

const args = process.argv

let port = false

if (args[2] === "-p") {
    port = parseInt(args[3])
}

const app = express()

countManager.init(app)

const staticRoot = __dirname + "/static"
app.use('/static', express.static(staticRoot))

app.get("/", (req, res) => {
    const context = {
        current: false,
        allTime: false
    }

    const sendIfFull = () => {
        if (context.current && context.allTime) {
            res.send(templates.home(context))
        }
    }

    countManager.count().then(count => {
        context.current = count
        sendIfFull()
    })

    countManager.allTimeCount().then(count => {
        context.allTime = count
        sendIfFull()
    })
})


if (port) {
    app.port = port
    app.listen(port, () => {
        console.log(`Listening on port ${port}...`)
    })
} else {
    console.error("Port not incorrectly set")
    process.exit(1)
}
