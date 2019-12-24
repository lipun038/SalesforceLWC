import { LightningElement, track } from 'lwc';
export default class SalesforceLogin extends LightningElement {
    @track loginVisible = true;
    @track actionVisible = false;
    @track loginMsg = 'Please provide your Salesforce org credential';
    @track sfAction = 'soqlQuery';
    @track isSoqlQuery = true;
    @track isSoslQuery = false;
    @track isRestExplorer = false;
    @track isStreaming = false;
    orgType = 'Dev';
    userName = '';
    password = '';
    securityToken = '';

    doLogin() {
        var validationLoginFlag = this.validateLogin();
        if (!validationLoginFlag) {
            this.loginMsg = 'Salesforce Username and Password required.';
        } else {
            this.loginMsg = 'Connecting to your Salesforce org.';

            const URL = '/salesforce/api/login';

            const body = {
                orgType: this.orgType,
                userName: this.userName,
                password: this.password,
                securityToken: this.securityToken
            };
            fetch(URL, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' }
            })
                .then(function(response) {
                    // The response is a Response instance.
                    // You parse the data into a useable format using `.json()`
                    return response.text();
                })
                .then(data => {
                    this.loginMsg = data;
                    if (data.includes('Success')) {
                        this.actionVisible = true;
                        this.loginVisible = false;
                    }
                });
        }
    }
    soqlQuery() {
        const URL = '/salesforce/api/soqlQuery';
        const body = {
            q: 'SELECT Id,Name FROM ACCOUNT LIMIT 1'
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
                    this.loginMsg = 'Number of records : ' + data.recordsCount;
                } else {
                    this.loginMsg = data.errorMsg;
                }
            });
    }

    validateLogin() {
        var noValidation = true;
        if (!this.userName || !this.password) {
            noValidation = false;
        }
        return noValidation;
    }
    handleUserNameChange(event) {
        this.userName = event.target.value;
    }
    handlePasswordChange(event) {
        this.password = event.target.value;
    }
    handleSecurityTokenChange(event) {
        this.securityToken = event.target.value;
    }
    handleOrgType(event) {
        this.orgType = event.target.value;
    }
    handleSfAction(event) {
        this.sfAction = event.target.value;
        this.actionVisibility(this.sfAction);
    }
    actionVisibility(sfAction) {
        if (sfAction === 'soqlQuery') {
            this.hideActions();
            this.isSoqlQuery = true;
        } else if (sfAction === 'soslQuery') {
            this.hideActions();
            this.isSoslQuery = true;
        } else if (sfAction === 'restExplorer') {
            this.hideActions();
            this.isRestExplorer = true;
        }else if (sfAction === 'streaming') {
            this.hideActions();
            this.isStreaming = true;
        }
    }
    hideActions() {
        //make every action to false
        this.isSoqlQuery = false;
        this.isSoslQuery = false;
        this.isRestExplorer = false;
        this.isStreaming = false;
    }
}
