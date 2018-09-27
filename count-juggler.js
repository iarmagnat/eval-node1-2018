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
    if (apps.length === ports.length) {
        setInterval(fetchBoth, 1000)
    }
}

function fetchBoth() {
    const data = {}
    function logIfReady() {
        if (Object.keys(data).length === ports.length) {
            console.log(`${String(new Date())} ${data[ports[0]].current} ${data[ports[1]].current} ${data[ports[0]].current + data[ports[1]].current}`)
        }
    }
    ports.forEach(port => {
        fetch(`http://localhost:${port}/json`)
            .then(res => res.json())
            .then(json => {
                data[port] = json
                logIfReady()
            })

    })
}