let current_app

function init(app) {
    current_app = app

    app.use((req, res, next) => {
        current++
        addToAllTime()
        next()
    })

}

function addToAllTime(amount = 1) {
    fs.readFile(
        __dirname + "/count/all.json",
        {encoding: "utf8"},
        (err, file) => {
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
    )
}
