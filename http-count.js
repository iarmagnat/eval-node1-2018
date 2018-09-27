const express = require("express")
const bodyParser = require("body-parser")
const countManager = require("./count-manager")
const routes = require("./routes")

const args = process.argv

let port = false

if (args[2] === "-p") {
    port = parseInt(args[3])
}

const app = express()

countManager.init(app)
const staticRoot = __dirname + "/static"

app.use('/static', express.static(staticRoot))
app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())


routes.init(app)


if (port) {
    app.port = port
    app.listen(port, () => {
        console.log(`Listening on port ${port}...`)
    })
} else {
    console.error("Port not incorrectly set")
    process.exit(1)
}
