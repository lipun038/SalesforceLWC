import { LightningElement, track } from 'lwc';

export default class JsonFormater extends LightningElement {
    @track queryMsg = '';
    @track jsonResponse;
    jsonRequest = '';
    startBracket = '{';
    endBracket = '}';
    jsonPlaceHolder = '{"Name" : "Prasanta Kumar","Email" : "prasanta@gmail.com", "Height" : 180, "Weight" : 78}';
    handleJson(event) {
        this.jsonRequest = event.target.value;
    }
    doFormatJson() {
        this.records = null;
        if (!this.jsonRequest) {
            this.queryMsg = 'Please enter a valid JSON string';
        } else {
            let jsonObj;
            try {
                jsonObj = JSON.parse(this.jsonRequest);
                this.jsonResponse = JSON.stringify(jsonObj, null, 4);
                this.queryMsg = '';
            } catch (err) { 
                this.queryMsg = err.message;
                this.jsonResponse = '';
            }
        }
    }
}
