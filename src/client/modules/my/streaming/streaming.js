import { LightningElement, track } from 'lwc';

export default class Streaming extends LightningElement {
    @track queryMsg = '';
    @track jsonResponse;
    @track isSubscribeButton = true;
    @track requestUrl = '';
    startBracket = '{';
    endBracket = '}';
    
    handleRequestUrl(event) {
        this.requestUrl = event.target.value;
    }
    doSubscribe() {
        this.isSubscribeButton = false;
        this.records = null;
        if (!this.requestUrl) {
            this.queryMsg = 'Please enter a valid relative REST API url';
        } else {
            const URL = '/salesforce/api/streaming';
            const body = {
                url: this.requestUrl
            };
            fetch(URL, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => {
                    // You parse the data into a useable format using `.json()`
                    return response.json();
                },
                error => { 
                    console.log('error message---'+error.message);
                    if (error.message) {
                        this.doSubscribe();
                    }
                }    
            ).then(data => {
                if (data) {
                    if (data.jsonResponse) {
                        this.jsonResponse = JSON.stringify(
                            data.jsonResponse,
                            null,
                            4
                        );
                        this.doSubscribe();
                    }
                }
            });
            
        }
    }
    /*
    subscribeToStreamingAPI() { 

        const URL = '/salesforce/api/streaming';
        const body = {
            q: this.requestUrl
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
                if (data.jsonResponse) {
                    //SUCCESS
                    //console.log('---Message : ' + JSON.stringify(data.jsonResponse));
                    this.subscribeToStreamingAPI();    
                } else {
                    console.log('---error : ' + data.errorMsg);
                }
            });
    }*/
}
