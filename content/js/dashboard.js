/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 93.33333333333333, "KoPercent": 6.666666666666667};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.03333333333333333, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "4.Deeviya Suman of BCA"], "isController": false}, {"data": [0.0, 500, 1500, "4.Deeviya Suman of BCA-1"], "isController": false}, {"data": [0.0, 500, 1500, "4.Deeviya Suman of BCA-0"], "isController": false}, {"data": [0.0, 500, 1500, "3.Amit Kumar of IBM"], "isController": false}, {"data": [0.0, 500, 1500, "3.Amit Kumar of IBM-1"], "isController": false}, {"data": [0.0, 500, 1500, "3.Amit Kumar of IBM-0"], "isController": false}, {"data": [0.0, 500, 1500, "5.Abhinai Taman of EEE"], "isController": false}, {"data": [0.0, 500, 1500, "2.Semantoo Sahni of ECE-1"], "isController": false}, {"data": [0.0, 500, 1500, "2.Semantoo Sahni of ECE-0"], "isController": false}, {"data": [0.5, 500, 1500, "5.Abhinai Taman of EEE-0"], "isController": false}, {"data": [0.0, 500, 1500, "1.Sumit Kumar of CSE"], "isController": false}, {"data": [0.0, 500, 1500, "1.Sumit Kumar of CSE-0"], "isController": false}, {"data": [0.0, 500, 1500, "1.Sumit Kumar of CSE-1"], "isController": false}, {"data": [0.0, 500, 1500, "2.Semantoo Sahni of ECE"], "isController": false}, {"data": [0.0, 500, 1500, "5.Abhinai Taman of EEE-1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 15, 1, 6.666666666666667, 3408.9999999999995, 1333, 7096, 3019.0, 5912.200000000001, 7096.0, 7096.0, 0.7506380423359856, 18.352025002502128, 0.13097070009508083], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["4.Deeviya Suman of BCA", 1, 0, 0.0, 4760.0, 4760, 4760, 4760.0, 4760.0, 4760.0, 4760.0, 0.21008403361344538, 7.704380580357143, 0.05498293067226891], "isController": false}, {"data": ["4.Deeviya Suman of BCA-1", 1, 0, 0.0, 3019.0, 3019, 3019, 3019.0, 3019.0, 3019.0, 3019.0, 0.33123550844650546, 11.977527740973832, 0.04334527161311692], "isController": false}, {"data": ["4.Deeviya Suman of BCA-0", 1, 0, 0.0, 1740.0, 1740, 1740, 1740.0, 1740.0, 1740.0, 1740.0, 0.5747126436781609, 0.29465247844827586, 0.07520653735632184], "isController": false}, {"data": ["3.Amit Kumar of IBM", 1, 0, 0.0, 4677.0, 4677, 4677, 4677.0, 4677.0, 4677.0, 4677.0, 0.2138122728244601, 7.84110574353218, 0.055958680778276676], "isController": false}, {"data": ["3.Amit Kumar of IBM-1", 1, 0, 0.0, 2927.0, 2927, 2927, 2927.0, 2927.0, 2927.0, 2927.0, 0.341646737273659, 12.353999402118209, 0.04470767851042023], "isController": false}, {"data": ["3.Amit Kumar of IBM-0", 1, 0, 0.0, 1749.0, 1749, 1749, 1749.0, 1749.0, 1749.0, 1749.0, 0.5717552887364208, 0.293136256432247, 0.07481953973699257], "isController": false}, {"data": ["5.Abhinai Taman of EEE", 1, 0, 0.0, 4248.0, 4248, 4248, 4248.0, 4248.0, 4248.0, 4248.0, 0.23540489642184556, 8.63296882356403, 0.06160987523540489], "isController": false}, {"data": ["2.Semantoo Sahni of ECE-1", 1, 0, 0.0, 3289.0, 3289, 3289, 3289.0, 3289.0, 3289.0, 3289.0, 0.3040437823046519, 10.994270674977196, 0.0397869793250228], "isController": false}, {"data": ["2.Semantoo Sahni of ECE-0", 1, 0, 0.0, 1509.0, 1509, 1509, 1509.0, 1509.0, 1509.0, 1509.0, 0.6626905235255136, 0.3397583250497018, 0.08671926772697151], "isController": false}, {"data": ["5.Abhinai Taman of EEE-0", 1, 0, 0.0, 1333.0, 1333, 1333, 1333.0, 1333.0, 1333.0, 1333.0, 0.7501875468867217, 0.3846176387846962, 0.0981690735183796], "isController": false}, {"data": ["1.Sumit Kumar of CSE", 1, 1, 100.0, 7096.0, 7096, 7096, 7096.0, 7096.0, 7096.0, 7096.0, 0.14092446448703494, 5.168101967657836, 0.036882574689966176], "isController": false}, {"data": ["1.Sumit Kumar of CSE-0", 1, 0, 0.0, 1968.0, 1968, 1968, 1968.0, 1968.0, 1968.0, 1968.0, 0.508130081300813, 0.2605159108231707, 0.06649358485772358], "isController": false}, {"data": ["1.Sumit Kumar of CSE-1", 1, 0, 0.0, 5123.0, 5123, 5123, 5123.0, 5123.0, 5123.0, 5123.0, 0.19519812609798948, 7.0583947394105016, 0.02554350478235409], "isController": false}, {"data": ["2.Semantoo Sahni of ECE", 1, 0, 0.0, 4798.0, 4798, 4798, 4798.0, 4798.0, 4798.0, 4798.0, 0.20842017507294708, 7.64336214308045, 0.05454746769487286], "isController": false}, {"data": ["5.Abhinai Taman of EEE-1", 1, 0, 0.0, 2899.0, 2899, 2899, 2899.0, 2899.0, 2899.0, 2899.0, 0.34494653328734043, 12.473320541566057, 0.04513948775439807], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 7,096 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, 100.0, 6.666666666666667], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 15, 1, "The operation lasted too long: It took 7,096 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["1.Sumit Kumar of CSE", 1, 1, "The operation lasted too long: It took 7,096 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
