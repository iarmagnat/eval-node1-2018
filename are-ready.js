const isReady = require("./is-ready")

function areReady(fileNames = []) {

    return new Promise((resolve, reject) => {

        let counter = fileNames.length

        fileNames.forEach(fileName => {
            isReady.isReady(fileName).then(onReadyChecked)
        })

        function onReadyChecked(status) {
            if (!status) {
                resolve(false)
            }
            counter --
            if (counter === 0) {
                resolve(true)
            }
        }
    })
}

areReady(["/node_modules", "/README.md"]).then(console.log)