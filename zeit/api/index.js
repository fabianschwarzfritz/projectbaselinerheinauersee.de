
const async = require('async');
const request = require('request');

module.exports = (req, res) => {
    async.parallel({
        description: (callback) => {
            request('http://db.projectbaseline.org/data.php?countries=1&projects=1', (error, response, body) => {
                if (error || response.statusCode != 200) {
                    callback(true, {});
                    return;
                }
                const json = JSON.parse(body)
                const description = json["project"]["45"]
                callback(null, description);
            })
        },
        data: (callback) => {
            request('http://db.projectbaseline.org/meta.php?station=10J', (error, response, body) => {
                if (error || response.statusCode != 200) {
                    callback(true, {});
                    return;
                }
                const json = JSON.parse(body)
                const temperature = json["temperature"]["11"];
                const visibility = json["visibility"]["11"];
                callback(null, {
                    temperature: temperature,
                    visibility: visibility,
                });
            })
        }
    }, (err, results) => {
        if (err) {
            res.send("Error fetching data from database");
            return;
        }
        res.writeHead(200, {"Content-Type": "application/json"});
        console.log(results);
        res.end(JSON.stringify(results));
    });
}
