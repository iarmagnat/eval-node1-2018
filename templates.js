function home(context) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Count</title>
    <link rel="stylesheet" href="static/main.css">
</head>
<body>

<h1>Access counter</h1>

<p>Current: ${context["current"]}</p>
<p>All time: ${context["allTime"]}</p>

</body>
</html>
`}

module.exports = {
    home: home,
}