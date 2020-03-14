var jsforce = require('jsforce');
var conn = new jsforce.Connection({
    // you can change loginUrl to connect to sandbox or prerelease env.
    // loginUrl : 'https://test.salesforce.com'
});
module.exports = app => {
    //Required to parse POST body
    var bodyParser = require('body-parser');
    app.use(bodyParser.json()); // support json encoded bodies
    app.use(bodyParser.urlencoded({ extended: true }));
    //End of Required to parse POST body
    // put your express app logic here
    app.post('/salesforce/api/login', (req, res) => {
        if (req.body.orgType === 'Sandbox') {
            conn = new jsforce.Connection({
                // you can change loginUrl to connect to sandbox or prerelease env.
                loginUrl: 'https://test.salesforce.com'
            });
        }
        conn.login(
            req.body.userName,
            req.body.password + req.body.securityToken,
            function(err) {
                if (err) {
                    res.send(err.message);
                } else {
                    res.send(
                        'Login Success : ' +
                            req.body.userName +
                            '( v' +
                            conn.version +
                            ' )'
                    );
                }
            }
        );
    });
    app.post('/salesforce/api/soqlQuery', (req, res) => {
        var records;
        var recordsCount = 0;
        var errorMsg = '';
        var bodyJson = {};
        conn.query(req.body.q, function(err, result) {
            if (err) {
                errorMsg = err.message;
            } else {
                recordsCount = result.totalSize;
                records = result.records;
            }
            bodyJson = {
                records: records,
                recordsCount: recordsCount,
                errorMsg: errorMsg
            };
            res.json(bodyJson);
        });
    });
    app.post('/salesforce/api/soslQuery', (req, res) => {
        var records;
        var recordsCount = 0;
        var errorMsg = '';
        var bodyJson = {};
        conn.search(req.body.q, function(err, result) {
            if (err) {
                errorMsg = err.message;
            } else {
                recordsCount = result.searchRecords.length;
                records = result.searchRecords;
            }
            bodyJson = {
                records: records,
                recordsCount: recordsCount,
                errorMsg: errorMsg
            };
            res.json(bodyJson);
        });
    });
    app.post('/salesforce/api/restExplorerGet', (req, res) => {
        var errorMsg = '';
        var bodyJson = {};
        var jsonResponse = '';
        conn.requestGet(req.body.url, function(err, result) {
            if (err) {
                errorMsg = err.message;
            } else {
                jsonResponse = result;
            }
            bodyJson = {
                jsonResponse: jsonResponse,
                errorMsg: errorMsg
            };
            res.json(bodyJson);
        });
    });
    app.post('/salesforce/api/restExplorerPost', (req, res) => {
        var errorMsg = '';
        var bodyJson = {};
        var jsonResponse = '';
        conn.requestPost(req.body.url, req.body.requestBody, function(err, result) {
            if (err) {
                errorMsg = err.message;
            } else {
                jsonResponse = result;
            }
            bodyJson = {
                jsonResponse: jsonResponse,
                errorMsg: errorMsg
            };
            res.json(bodyJson);
        });
    });
    app.post('/salesforce/api/streaming', (req, res) => {
        var bodyJson = {};
        let count = 0;
        conn.streaming.subscribe(req.body.url, function(message) {
            bodyJson = {
                jsonResponse: message
            };
            if (count === 0) {
                count++;
                res.json(bodyJson);
            }
        });
    });
};
