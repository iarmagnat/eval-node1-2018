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

<p>JSON data: <a href="/json">Click here</a></p>

<form action="/" method="post">
    <label for="current">Current</label>
    <input type="checkbox" name="current" id="current">
    <label for="allTime">All Time</label>
    <input type="checkbox" name="allTime" id="allTime">
    <input type="submit" value="reset">
</form>

</body>
</html>
`
}

module.exports = {
    home: home,
}