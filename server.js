const app = require('./src/index')

var server = app.listen(3000, (err) => {
    if (!err) {
        var port = server.address().port;
        var host = server.address().address;
        console.log(`application listening.....@${host}${port}`);
    }
});