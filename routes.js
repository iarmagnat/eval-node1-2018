const countManager = require("./count-manager")
const templates = require("./templates")

let current_app

function init(app) {
    current_app = app

    current_app.get("/", (req, res) => {
        homepage(req, res)
    })
    current_app.post("/", (req, res) => {
        homepagePost(req, res)
    })
}

function homepage(req, res) {
    const context = {
        current: false,
        allTime: false
    }

    const sendIfFull = () => {
        if (context.current !== false && context.allTime !== false) {
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
}

function homepagePost(req, res) {
    const toReset = []
    if (req.body.allTime) {
        toReset.push("allTime")
    }
    if (req.body.current) {
        toReset.push("current")
    }

    console.log(toReset)

    let promiseCount = toReset.length

    const renderIfDone = () => {
        if (promiseCount === 0) {
            homepage(req, res)
        }
    }

    toReset.forEach(counter => {
        countManager.reset(counter)
            .then(data => {
                promiseCount--
                renderIfDone()
            })
            .catch(err => {
                console.error(err)
            })
    })
    renderIfDone()
}

module.exports = {
    init: init
}