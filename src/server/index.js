var jsforce = require('jsforce');
var geoip = require('geoip-lite');
var Sentiment = require('sentiment');
var numberToText = require('number2text');

module.exports = app => {
    //Required to parse POST body
    let bodyParser = require('body-parser');
    app.use(bodyParser.json()); // support json encoded bodies
    app.use(bodyParser.urlencoded({ extended: true }));
    //End of Required to parse POST body

    // put your express app logic here
    app.post('/salesforce/api/login', (req, res) => {
        let conn = new jsforce.Connection({});
        if (req.body.orgType === 'Sandbox') {
            conn = new jsforce.Connection({
                // you can change loginUrl to connect to sandbox or prerelease env.
                loginUrl: 'https://test.salesforce.com'
            });
        } else {
            conn = new jsforce.Connection({
                // you can change loginUrl to connect to Developer or Prod env.
                loginUrl: 'https://login.salesforce.com'
            });
        }
        let bodyJson = {};
        conn.login(
            req.body.userName,
            req.body.password + req.body.securityToken,
            err => {
                if (err) {
                    bodyJson = { errorMsg: err.message };
                    res.json(bodyJson);
                } else {
                    let tempCon = {
                        accessToken: conn.accessToken,
                        instanceUrl: conn.instanceUrl
                    };
                    bodyJson = {
                        userName: req.body.userName,
                        conn: tempCon
                    };
                    res.json(bodyJson);
                }
            }
        );
    });
    app.post('/salesforce/api/soqlQuery', (req, res) => {
        let conn = new jsforce.Connection({});
        conn.accessToken = req.body.conn.accessToken;
        conn.instanceUrl = req.body.conn.instanceUrl;
        let records;
        let recordsCount = 0;
        let errorMsg = '';
        let bodyJson = {};
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
        let conn = new jsforce.Connection({});
        conn.accessToken = req.body.conn.accessToken;
        conn.instanceUrl = req.body.conn.instanceUrl;
        let records;
        let recordsCount = 0;
        let errorMsg = '';
        let bodyJson = {};
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
        let conn = new jsforce.Connection({});
        conn.accessToken = req.body.conn.accessToken;
        conn.instanceUrl = req.body.conn.instanceUrl;
        let errorMsg = '';
        let bodyJson = {};
        let jsonResponse = '';
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
    app.post('/salesforce/api/restExplorerDelete', (req, res) => {
        let conn = new jsforce.Connection({});
        conn.accessToken = req.body.conn.accessToken;
        conn.instanceUrl = req.body.conn.instanceUrl;
        let errorMsg = '';
        let bodyJson = {};
        let jsonResponse = '';
        conn.requestDelete(req.body.url, function(err, result) {
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
        let conn = new jsforce.Connection({});
        conn.accessToken = req.body.conn.accessToken;
        conn.instanceUrl = req.body.conn.instanceUrl;
        let errorMsg = '';
        let bodyJson = {};
        let jsonResponse = '';
        conn.requestPost(req.body.url, req.body.requestBody, function(
            err,
            result
        ) {
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
    app.post('/salesforce/api/restExplorerPatch', (req, res) => {
        let conn = new jsforce.Connection({});
        conn.accessToken = req.body.conn.accessToken;
        conn.instanceUrl = req.body.conn.instanceUrl;
        let errorMsg = '';
        let bodyJson = {};
        let jsonResponse = '';
        conn.requestPatch(req.body.url, req.body.requestBody, function(
            err,
            result
        ) {
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
        let conn = new jsforce.Connection({});
        conn.accessToken = req.body.conn.accessToken;
        conn.instanceUrl = req.body.conn.instanceUrl;
        let bodyJson = {};
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
    app.post('/sentiment', (req, res) => {
        let message = req.body.message;
        if (!message) {
            res.json({ error: 'message is empty' });
        } else {
            let sentiment = new Sentiment();
            let resultObj = sentiment.analyze(message);
            let result = resultObj.score;
            let intensifier = 'Neutral';
            if (result > 0 && result < 5) {
                intensifier = 'Positive';
            } else if (result >= 5) {
                intensifier = 'Extremely Positive';
            } else if (result < 0 && result > -5) {
                intensifier = 'Negative';
            } else if (result <= -5) {
                intensifier = 'Extremely Negative';
            }
            let bodyJson = {
                intensifier: intensifier
            };
            res.json(bodyJson);
        }
    });
    app.post('/convertToWords', (req, res) => {
        let numberValue = req.body.numberValue;
        let bodyJson;
        if (!numberValue) {
            res.json({ error: 'numberValue is empty' });
        } else if (isNaN(numberValue)) {
            res.json({ error: 'numberValue should be a number' });
        } else {
            try {
                let textValue = '';
                if(numberValue >= 1000000){
                    textValue = numberToText(numberValue, 'English');
                }else{
                    textValue = numberToText(numberValue);    
                }
                bodyJson = {
                    textValue: textValue
                };
            } catch (e) {
                bodyJson = {};
            }
        }
        res.json(bodyJson);
    });
    app.get('/myip', (req, res) => {
        let myIp =
            req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        let geo;
        try {
            geo = geoip.lookup(myIp);
        } catch (e) {
            geo = {};
        }
        let bodyJson = {
            clientIp: myIp,
            location: geo
        };
        res.json(bodyJson);
    });
};
