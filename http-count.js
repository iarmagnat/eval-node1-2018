const express = require("express")
const bodyParser = require("body-parser")
const countManager = require("./count-manager")
const routes = require("./routes")

function startApp(port) {
    return new Promise((resolve, reject) => {

        const app = express()

        countManager.init(app)
        const staticRoot = __dirname + "/static"

        app.use('/static', express.static(staticRoot))
        app.use(bodyParser.urlencoded({extended: false}))

        app.use(bodyParser.json())

        routes.init(app)

        if (port) {
            app.listen(port, () => {
                app.port = port
                console.log(`Listening on port ${port}...`)
                resolve(app)
            })
        } else {
            console.error("Port not incorrectly set")
            reject(port)
        }
    })
}

module.exports = {
    startApp: startApp,
}