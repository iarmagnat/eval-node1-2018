const fetch = require("node-fetch")

const ports = [8080, 8000]

const apps = []

ports.forEach(port => {
    let httpCounter = require("./http-count")

    httpCounter.startApp(port).then(app => {
        apps.push(app)
        checkLoaded()
    })
})

function checkLoaded() {
    if (apps.length === 2) {
        setInterval(fetchBoth, 1000)
    }
}

function fetchBoth() {
    ports.forEach(port => {
        fetch(`http://localhost:${port}/json`)
            .then(res => res.json())
            .then(json => console.log(json))
    })
}