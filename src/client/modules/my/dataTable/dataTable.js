import { LightningElement, api} from 'lwc';

export default class DataTable extends LightningElement {
    @api records;

    renderedCallback() { 
        var htmlTableStr='';
        if (this.records) {
            htmlTableStr += '<table class="dataTable">';
            htmlTableStr += '<tr>';
            let col = [];
            for (let key in this.records[0]) {
                if (!(key === 'attributes')) {
                    htmlTableStr += '<th>' + key + '</th>'; // Table header
                    col.push(key);
                }
            }
            htmlTableStr += '</tr>';
            
            // ADD JSON DATA TO THE TABLE AS ROWS.
            for (let i = 0; i < this.records.length; i++) {
                htmlTableStr += '<tr>';
                for (let j = 0; j < col.length; j++) {
                    let dt = this.records[i][col[j]];
                    if (!dt) { 
                        dt = ''; //Null or Undefind to blank
                    }
                   htmlTableStr += '<td>' + dt + '</td>'; // Table data
                }
                htmlTableStr += '</tr>';
            }
            htmlTableStr += '</table>';
        }
       
        this.template.querySelector('div').innerHTML = htmlTableStr;    
    }
}    