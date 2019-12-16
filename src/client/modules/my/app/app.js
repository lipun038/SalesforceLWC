import { LightningElement } from 'lwc';

export default class App extends LightningElement {
    openTab(event) { 
        //this.template.querySelector(event.target.value).sty
        let tabcontent = this.template.querySelectorAll(".tabcontent");
        for (let i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        let tablinks = this.template.querySelectorAll(".tablinks");
        for (let i = 0; i < tablinks.length; i++) {
            //console.log('---' + tablinks[i].className);
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        let displayTab = this.template.querySelector(`[data-id="${event.target.value}"]`);
        displayTab.style.display = 'block';
        event.target.className += " active";
    }

}
