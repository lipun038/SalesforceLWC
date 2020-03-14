import { LightningElement, track } from 'lwc';

export default class RestExplorer extends LightningElement {
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
        if (this.requestType === 'POST') {
            this.showBody = true;
        } else { 
            this.showBody = false;
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
        if (!this.requestUrl) {
            this.queryMsg = 'Please enter a valid relative REST API url';
        } else if (this.requestType === 'POST' && (!this.requestBody)) { 
            this.queryMsg = 'Please enter body in JSON object format';    
        }
        else {
            let URL = '/salesforce/api/restExplorerGet';
            let body = {
                url: this.requestUrl
            };
            if (this.requestType === 'POST') { 
                URL = '/salesforce/api/restExplorerPost';
                let requestBody = {};
                
                try {
                    requestBody = JSON.parse(this.requestBody);
                } catch(e) {
                    this.queryMsg = 'Please enter valid JSON object string formart for request body';
                    return;
                }
                body = {
                    url: this.requestUrl,
                    requestBody : requestBody
                };    
                
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
