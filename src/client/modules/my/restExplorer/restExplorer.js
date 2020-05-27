import { LightningElement, track, api } from 'lwc';

export default class RestExplorer extends LightningElement {
    @api conn;
    @track queryMsg = '';
    @track jsonResponse;
    @track buildTable;
    @track showBody = false;
    records;
    requestType = 'GET';
    requestUrl = '/services/data/v46.0';
    requestBody = '';
    startBracket = '{';
    endBracket = '}';
    handleRequestType(event) {
        this.requestType = event.target.value;
        this.requestBody = '';
        this.queryMsg = '';
        this.jsonResponse = null;
        this.buildTable = false;
        if (this.requestType === 'POST' || this.requestType === 'PATCH') {
            this.showBody = true;
            this.requestUrl = '/services/data/v46.0/composite/sobjects';
            if (this.requestType === 'POST') {
                this.requestBody =
                    '{"allOrNone" : false,"records" : [{"attributes" : {"type" : "Account"},"Name" : "example.com","BillingCity" : "San Francisco"}, {"attributes" : {"type" : "Contact"},"LastName" : "Johnson","FirstName" : "Erica"}] }';
            } else if (this.requestType === 'PATCH') {
                this.requestBody =
                    '{"allOrNone" : false,"records" : [{"attributes" : {"type" : "Account"},"id" : "001xx000003DGb2AAG","NumberOfEmployees" : 27000},{"attributes" : {"type" : "Contact"},"id" : "003xx000004TmiQAAS","Title" : "Lead Engineer"}] }';
            }
        } else {
            this.showBody = false;
            if (this.requestType === 'DELETE') {
                this.requestUrl =
                    '/services/data/v46.0/composite/sobjects?ids=001xx000003DGb2AAG,003xx000004TmiQAAS&allOrNone=false';
            }
        }
    }
    handleRequestUrl(event) {
        this.requestUrl = event.target.value;
    }
    handleRequestBody(event) {
        this.requestBody = event.target.value;
    }
    handleBuildTable(event) {
        this.buildTable = event.target.checked;
    }
    doExecuteRequest() {
        this.records = null;
        this.buildTable = false;
        this.jsonResponse = null;
        this.queryMsg = null;
        if (!this.requestUrl) {
            this.queryMsg = 'Please enter a valid relative REST API url';
        } else if (
            (this.requestType === 'POST' || this.requestType === 'PATCH') &&
            !this.requestBody
        ) {
            this.queryMsg = 'Please enter body in JSON object format';
        } else {
            let body = {
                conn: this.conn,
                url: this.requestUrl
            };
            let URL;
            if (this.requestType === 'GET' || this.requestType === 'DELETE') {
                if (this.requestType === 'GET') {
                    URL = '/salesforce/api/restExplorerGet';
                } else if (this.requestType === 'DELETE') {
                    URL = '/salesforce/api/restExplorerDelete';
                }
            } else if (
                this.requestType === 'POST' ||
                this.requestType === 'PATCH'
            ) {
                if (this.requestType === 'POST') {
                    URL = '/salesforce/api/restExplorerPost';
                } else if (this.requestType === 'PATCH') {
                    URL = '/salesforce/api/restExplorerPatch';
                }

                let requestBody = {};

                try {
                    requestBody = JSON.parse(this.requestBody);
                } catch (e) {
                    this.queryMsg =
                        'Please enter valid JSON object string formart for request body';
                    return;
                }
                body.requestBody = requestBody;
            }
            fetch(URL, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' }
            })
                .then(function(response) {
                    // The response is a Response instance.
                    // You parse the data into a useable format using `.json()`
                    return response.json();
                })
                .then(data => {
                    if (!data.errorMsg) {
                        this.jsonResponse = JSON.stringify(
                            data.jsonResponse,
                            null,
                            4
                        );
                        this.records = data.jsonResponse;
                    } else {
                        this.queryMsg = data.errorMsg;
                        this.jsonResponse = '';
                    }
                });
        }
    }
}
