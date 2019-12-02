import { LightningElement, api } from 'lwc';

export default class DataTable extends LightningElement {
    @api records;

    renderedCallback() {
        var htmlTableStr = '';
        htmlTableStr += this.buildTable(this.records);
        this.template.querySelector('div').innerHTML = htmlTableStr;
    }
    buildTable(records) {
        var htmlTableStr = '';
        if (this.records) {
            htmlTableStr += '<table class="dataTable">';
            htmlTableStr += '<tr>';
            let col = [];
            for (let key in records[0]) {
                if (!(key === 'attributes')) {
                    htmlTableStr += '<th>' + key + '</th>'; // Table header
                    col.push(key);
                }
            }
            htmlTableStr += '</tr>';

            // ADD JSON DATA TO THE TABLE AS ROWS.
            for (let i = 0; i < records.length; i++) {
                htmlTableStr += '<tr>';
                for (let j = 0; j < col.length; j++) {
                    let dt = records[i][col[j]];
                    if (!dt) {
                        dt = ''; //Null or Undefind to blank
                    } else { 
                        if (dt === Object(dt)) {
                            if (dt.records) { 
                                 dt = this.buildTable(dt.records);    
                            }else {
                                dt = this.buildObjectStr(dt);
                            }    
                        }
                    }
                    htmlTableStr += '<td>' + dt + '</td>'; // Table data
                }
                htmlTableStr += '</tr>';
            }
            htmlTableStr += '</table>';
        }
        return htmlTableStr;
    }
    buildObjectStr(obj) {
        var htmlTableStr = '<table class="dataTable">';
        for (let key in obj) {
            if (!(key === 'attributes')) {
                htmlTableStr += '<tr>';
                htmlTableStr += '<th>' + key + '</th>';
                let dataVal = obj[key] ? obj[key] : '';
                htmlTableStr += '<td>' + dataVal + '</td>';
                htmlTableStr += '</tr>'; 
            }
        }
        htmlTableStr += '</table>';
        return htmlTableStr;
    }    
}
