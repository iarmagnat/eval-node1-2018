const express = require("express")
const fs = require("fs")

const args = process.argv

let port = false

if (args[2] === "-p") {
    port = parseInt(args[3])
}

const app = express()

let current = 0

app.get("/", (req, res) => {
    res.send("<h1>Coucou</h1>")
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
