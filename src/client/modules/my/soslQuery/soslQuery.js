import { LightningElement, track } from 'lwc';

export default class SoslQuery extends LightningElement {
    @track queryMsg = '';
    @track records;
    soslQuery = '';
    startBracket = '{';
    endBracket = '}';
    handleQuery(event) {
        this.soslQuery = event.target.value;
    }
    doExecuteQuery() {
        this.records = null;
        if (!this.soslQuery) {
            this.queryMsg = 'Please enter a valid SOSL query';
        } else {
            const URL = '/salesforce/api/soslQuery';
            const body = {
                q: this.soslQuery
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
                        let tempMap = new Map();
                        //Collect records for each sObject Types
                        this.records.forEach(record => {
                            //record["Object Type"] = record.attributes.type;
                            let tempArr = tempMap.get(record.attributes.type);
                            if (!tempArr) {
                                tempArr = [];
                            }
                            tempArr.push(record);
                            tempMap.set(record.attributes.type, tempArr);
                        });
                        let transformObj = [];
                        tempMap.forEach((value, key) => {
                            transformObj.push({
                                type: key,
                                list: value,
                                size: value.length
                            });
                        });
                        this.records = transformObj;
                    } else {
                        this.queryMsg = data.errorMsg;
                    }
                });
        }
    }
}
