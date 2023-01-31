import { LightningElement, track, api } from 'lwc';

export default class RestExplorer extends LightningElement {
    @api conn;
    @track queryMsg = '';
    @track jsonResponse;
    @track buildTable;
    @track showBody = false;
    records;
    requestType = 'GET';
    requestUrl = '';
    requestHeaders = '';
    requestBody = '';
    startBracket = '{';
    endBracket = '}';
    handleRequestType(event) {
        this.requestType = event.target.value;
        this.requestBody = '';
        this.queryMsg = '';
        this.jsonResponse = null;
        this.buildTable = false;
        if (
            this.requestType === 'POST' ||
            this.requestType === 'PATCH' ||
            this.requestType === 'PUT'
        ) {
            this.showBody = true;
        } else {
            this.showBody = false;
        }
    }
    handleRequestUrl(event) {
        this.requestUrl = event.target.value;
    }
    handleRequestHeaders(event) {
        this.requestHeaders = event.target.value;
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
            this.queryMsg = 'Please enter a valid Endpoint url';
        } else if (
            (this.requestType === 'POST' ||
                this.requestType === 'PATCH' ||
                this.requestType === 'PUT') &&
            !this.requestBody
        ) {
            this.queryMsg = 'Please enter body in JSON object format';
        } else {
            let extraParam = {};
            extraParam.method = this.requestType;
            if (this.requestHeaders) {
                //let headersObj = {};
                let requestHeadersStr = this.requestHeaders.replaceAll(
                    '\n',
                    ','
                );
                try{
                    extraParam.headers = JSON.parse('{'+requestHeadersStr+'}');
                }catch(err){
                    console.log(err);
                }
                
            }
            if (
                this.requestType === 'POST' ||
                this.requestType === 'PATCH' ||
                this.requestType === 'PUT'
            ) {
                extraParam.body = this.requestBody;
            }
            let body = {};
            body.requestUrl = this.requestUrl;
            body.extraParam = extraParam;
            fetch('/restClient', {
                method: 'POST',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' }
            })
                .then(function(response) {
                    // The response is a Response instance.
                    // You parse the data into a useable format using `.json()`
                    return response.json();
                })
                .then(response => {
                    if (!response.err) {
                        this.jsonResponse = JSON.stringify(
                            response.data,
                            null,
                            4
                        );
                        this.records = response.data;
                    } else {
                        this.queryMsg = response.err;
                        this.jsonResponse = '';
                    }
                });
        }
    }
}
