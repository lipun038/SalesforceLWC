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
        if (this.requestType === 'POST' || this.requestType === 'PATCH' || this.requestType === 'PUT') {
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
            (this.requestType === 'POST' || this.requestType === 'PATCH' || this.requestType === 'PUT') &&
            !this.requestBody
        ) {
            this.queryMsg = 'Please enter body in JSON object format';
        } else {
            let extraParam = {};
            extraParam.method = this.requestType;
            if(this.requestHeaders){
                let headersObj = {};
                let requestHeadersStr = this.requestHeaders.replaceAll('\n',';');
                for(let hdr of requestHeadersStr.split(';')){
                    let tmp = hdr.split(':');
                    headersObj[tmp[0].trim()] = headersObj[tmp[1].trim()];
                }
                extraParam.headers = headersObj;    
            }
            if (this.requestType === 'POST' || this.requestType === 'PATCH' || this.requestType === 'PUT') {
                extraParam.body = this.requestBody;
            }
            fetch(this.requestUrl,extraParam)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(response.statusText)
                    }
                    return response.json();
            })
            .then(data => {
                this.jsonResponse = JSON.stringify(
                    data,
                    null,
                    4
                );
                this.records = data;
            })
            .catch(err=>{
                this.queryMsg = err;
            })
            
            
        }
    }
}
