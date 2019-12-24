import { LightningElement, track } from 'lwc';

export default class SoqlQuery extends LightningElement {
    @track queryMsg = '';
    @track records;
    soqlQuery = '';
    handleQuery(event) {
        this.soqlQuery = event.target.value;
    }
    doExecuteQuery() {
        this.records = null;
        if (!this.soqlQuery) {
            this.queryMsg = 'Please enter a valid SOQL query';
        } else {
            const URL = '/salesforce/api/soqlQuery';
            const body = {
                q: this.soqlQuery
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
                        //SUCCESS
                        this.queryMsg =
                            'Number of records : ' + data.recordsCount;
                        this.records = data.records;
                    } else {
                        this.queryMsg = data.errorMsg;
                    }
                });
        }
    }
    /*
    connectedCallback() { 
        
    }*/
    
}
