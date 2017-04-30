var summaryGraphHours = ['00', '01', '02', '03', '04', '05', '06','07', '08', '09','10','11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
var summaryGraphDays = ['1', '2', '3','4', '5', '6', '7','8', '9', '10','11', '12', '13', '14'];

var summaryGraphApiUrl = 'http://158.108.183.21:3000/dnsApi/summary'
var summaryGraphStartTime = ''
var summaryGraphEndTime = ''
var summaryGraphQueryType = ''
var summaryGraphDom = document.getElementById("summaryGraphContainer");
var summaryGraphChart = echarts.init(summaryGraphDom);
var app = {};
var summaryGraphOption = null;

function getJsonData(Url) {
  // strUrl is whatever URL you need to call
  var strUrl = Url, strReturn = "";
  //console.log(strUrl)
  jQuery.ajax({
    url: strUrl,
    success: function(response) {
      strReturn = response;
    },
    async:false
  });

  return strReturn;
}

function plotSummaryGraph(summaryGraphStartTimeIn,summaryGraphEndTimeIn,summaryGraphQueryTypeIn){
  summaryGraphStartTime = summaryGraphStartTimeIn
  summaryGraphEndTime = summaryGraphEndTimeIn
  summaryGraphQueryType = summaryGraphQueryTypeIn
  var summaryGraphCallUrl = summaryGraphApiUrl + '/' + summaryGraphStartTime + '/' + summaryGraphEndTime + '?qtype=' + summaryGraphQueryType
  var summaryGraphData = getJsonData(summaryGraphCallUrl);
  console.log(summaryGraphCallUrl)
  //console.log(summaryGraphData)

//note: This is makeup date section. We can use real data if we hav it. LOL
/*    for(i in summaryGraphData){
        if(summaryGraphData[i][2] == 0){
            summaryGraphData[i][2] = Math.random()*500000
        }
    }*/
    
  for(var i=0;i<summaryGraphData.length;i+=24){
    if(summaryGraphData[i][4] != undefined){
      var dateval = new Date(summaryGraphData[i][4]*1000)
      //console.log(dateval)
      summaryGraphDays[(i/24)] = dateval.toDateString()
    }
  }
    
  summaryGraphOption = {
      title: {
          text: 'DNS Traffic Summary',
          link: 'https://google.com'
      },
      //backgroundColor: '#404a59',
/*       legend: {
           data: ['test'],
          left: 'right'
      },*/
      tooltip: {
        position: 'top',
        formatter: function (params) {
          return summaryGraphQueryType+' : '+params.value[2];
        }
      },
      grid: {
          left: 2,
          bottom: 10,
          right: 10,
          containLabel: true
      },
      xAxis: {
        type: 'category',
        data: summaryGraphHours,
        name: 'Hours',
        nameLocation: 'middle',
        boundaryGap: false,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#999',
            type: 'dashed'
          }
        },
        axisLine: {
          show: false
        }
      },
      yAxis: {
        type: 'category',
        name: 'Days',
        data: summaryGraphDays,
        axisLine: {
            show: false
        }
      },
      series: [{
        name: 'test',
        type: 'scatter',
          symbolSize: function (val) {
            //var value = 1*(Math.log(1+255*val[2]))/(Math.log(1+255))
            //console.log(value)
            var value = val[2]/10000
            return value;
          },
          data: summaryGraphData,
          animationDelay: function (idx) {
            return idx * 2;
          }
      }]
  };;
  summaryGraphChart.setOption(summaryGraphOption,false);
}

plotSummaryGraph('1489597200','1489680000','countDns');

$(document).ready(function() {
    $('input[name="summaryDaterangePicker"]').daterangepicker(
      {
        locale: {
          format: 'YYYY-MM-DD'
        }
      }, 
      function(start, end, label) {
        //alert("A new date range was chosen: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
        var queryStartDateIn = Date.parse(start.format('YYYY-MM-DD')+'T00:00:00+07:00');
        var queryEndDateIn = Date.parse(end.format('YYYY-MM-DD')+'T00:00:00+07:00');
        queryStartDateIn = queryStartDateIn/1000;
        queryEndDateIn = queryEndDateIn/1000;
        summaryGraphStartTime = queryStartDateIn
        summaryGraphEndTime = queryEndDateIn
        //alert(summaryGraphStartTime)
        //alert(summaryGraphEndTime)
        plotSummaryGraph(summaryGraphStartTime,summaryGraphEndTime,summaryGraphQueryType);
      }
    );
} );
$(document).ready(function() {
    $("#summaryqtype").change(function () {
        var summaryGraphTypeIn = $(this).find(":selected").text();
        summaryGraphQueryType = summaryGraphTypeIn
        plotSummaryGraph(summaryGraphStartTime,summaryGraphEndTime,summaryGraphQueryType);
    });
} );