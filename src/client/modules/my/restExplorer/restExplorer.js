import { LightningElement, track } from 'lwc';

export default class RestExplorer extends LightningElement {
    @track queryMsg = '';
    @track jsonResponse;
    @track buildTable;
    records;
    requestType = 'GET';
    requestUrl = '/services/data/v46.0';
    startBracket = '{';
    endBracket = '}';
    handleRequestType(event) {
        this.requestType = event.target.value;
    }
    handleRequestUrl(event) {
        this.requestUrl = event.target.value;
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
        } else {
            const URL = '/salesforce/api/restExplorerGet';
            const body = {
                url: this.requestUrl
            };
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
