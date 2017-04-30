function getJsonData(apiUrl) {
  // strUrl is whatever URL you need to call
  var strUrl = apiUrl, strReturn = "";
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

function splitArray(datain,column){
    var result = []
    for (var i in datain){
      result[i] = datain[i][column]
    }
    return result
}

function tranformDayArray(datain){
  var result = []
  for(var i in datain){
    //console.log(datain[i])
    var dateIn = new Date(datain[i]*1000);
    var dateString = [dateIn.getFullYear(), dateIn.getMonth() + 1, dateIn.getDate()].join('/') + '|' + [dateIn.getHours(),dateIn.getMinutes()].join(':')
    result[i] = dateString
  } 
  return result
}

var timeseriesGraphApiUrl = 'http://158.108.183.21:3000/dnsApi/timeseries'
var timeseriesGraphStartTime = ''
var timeseriesGraphEndTime = ''

var timeseriesGraphDom1 = document.getElementById("timeserieGraphContainer1");
var timeseriesGraphDom2 = document.getElementById("timeserieGraphContainer2");
var timeseriesGraphDom3 = document.getElementById("timeserieGraphContainer3");
var timeseriesGraphDom4 = document.getElementById("timeserieGraphContainer4");

var timeseriesGraphChart1 = echarts.init(timeseriesGraphDom1);
var timeseriesGraphChart2 = echarts.init(timeseriesGraphDom2);
var timeseriesGraphChart3 = echarts.init(timeseriesGraphDom3);
var timeseriesGraphChart4 = echarts.init(timeseriesGraphDom4);

var app = {};
timeseriesGraphDomOption1 = null;
timeseriesGraphDomOption2 = null;
timeseriesGraphDomOption3 = null;
timeseriesGraphDomOption4 = null;

function plotTimeseriesGraph(timeseriesGraphStartTimeIn,timeseriesGraphEndTimeIn){

    timeseriesGraphStartTime = timeseriesGraphStartTimeIn
    timeseriesGraphEndTime = timeseriesGraphEndTimeIn

    var timeseriesGraphCallUrl = timeseriesGraphApiUrl + '/' + timeseriesGraphStartTime + '/' + timeseriesGraphEndTime
        /*/1489597200/1489683600?restype=countIpv6*/
    var timeseriesGraphDatain = getJsonData(timeseriesGraphCallUrl);

    var timeseriesGraphCountDns = []
    var timeseriesGraphCountTimeoutDns = []
    var timeseriesGraphCountIpv4 = []
    var timeseriesGraphCountIpv6 = []
    var timeseriesGraphCountTcp = []
    var timeseriesGraphCountUdp = []
    var timeseriesGraphCountEdns = []
    var timeseriesGraphCountOpcodeAA = []
    var timeseriesGraphCountOpcodeTC = []
    var timeseriesGraphCountOpcodeRD = []
    var timeseriesGraphCountOpcodeRA = []
    var timeseriesGraphCountOpcodeCD = []
    var timeseriesGraphCountOpcodeAD = []
    var timeseriesGraphCountOpcodeQR = []
    var timeseriesGraphCountNoerror = []
    var timeseriesGraphCountNxdomain = []
    var timeseriesGraphCountQtypeA = []
    var timeseriesGraphCountQtypeNS = []
    var timeseriesGraphCountQtypeCNAME = []
    var timeseriesGraphCountQtypeSOA = []
    var timeseriesGraphCountQtypeWKS = []
    var timeseriesGraphCountQtypePTR = []
    var timeseriesGraphCountQtypeMX = []
    var timeseriesGraphCountQtypeSRV = []
    var timeseriesGraphCountQtypeAAAA = []
    var timeseriesGraphCountQtypeANY = []
    var timeseriesGraphCountQclassIN = []

    for (var i in timeseriesGraphDatain){
      timeseriesGraphCountDns[i] = timeseriesGraphDatain[i][2]
      timeseriesGraphCountTimeoutDns[i] = timeseriesGraphDatain[i][3]
        timeseriesGraphCountIpv4[i] = timeseriesGraphDatain[i][4]
        timeseriesGraphCountIpv6[i] = timeseriesGraphDatain[i][5]
        timeseriesGraphCountTcp[i] = timeseriesGraphDatain[i][6]
        timeseriesGraphCountUdp[i] = timeseriesGraphDatain[i][7]
        timeseriesGraphCountEdns[i] = timeseriesGraphDatain[i][8]
        timeseriesGraphCountOpcodeAA[i] = timeseriesGraphDatain[i][9]
          timeseriesGraphCountOpcodeTC[i] = timeseriesGraphDatain[i][10]
        timeseriesGraphCountOpcodeRD[i] = timeseriesGraphDatain[i][11]
        timeseriesGraphCountOpcodeRA[i] = timeseriesGraphDatain[i][12]
        timeseriesGraphCountOpcodeCD[i] = timeseriesGraphDatain[i][13]
        timeseriesGraphCountOpcodeAD[i] = timeseriesGraphDatain[i][14]
        timeseriesGraphCountOpcodeQR[i] = timeseriesGraphDatain[i][15]
        timeseriesGraphCountNoerror[i] = timeseriesGraphDatain[i][16]
        timeseriesGraphCountNxdomain[i] = timeseriesGraphDatain[i][17]
        timeseriesGraphCountQtypeA[i] = timeseriesGraphDatain[i][18]
        timeseriesGraphCountQtypeNS[i] = timeseriesGraphDatain[i][19]
        timeseriesGraphCountQtypeCNAME[i] = timeseriesGraphDatain[i][20]
        timeseriesGraphCountQtypeSOA[i] = timeseriesGraphDatain[i][21]
        timeseriesGraphCountQtypeWKS[i] = timeseriesGraphDatain[i][22]
        timeseriesGraphCountQtypePTR[i] = timeseriesGraphDatain[i][23]
        timeseriesGraphCountQtypeMX[i] = timeseriesGraphDatain[i][24]
        timeseriesGraphCountQtypeSRV[i] = timeseriesGraphDatain[i][25]
        timeseriesGraphCountQtypeAAAA[i] = timeseriesGraphDatain[i][26]
        timeseriesGraphCountQtypeANY[i] = timeseriesGraphDatain[i][27]
        timeseriesGraphCountQclassIN[i] = timeseriesGraphDatain[i][28]
    }
    var timeseriesGraphDataXAxis = splitArray(timeseriesGraphDatain,1)
    var timeseriesGraphDataXDayAxis = tranformDayArray(timeseriesGraphDataXAxis)
    timeseriesGraphDomOption1 = {
        tooltip: {
          trigger: 'axis',
        },
        toolbox: {
          feature: {
            dataZoom: {
                yAxisIndex: 'none'
              },
              restore: {},
              saveAsImage: {}
          }
        },
        legend: {
          data:['CountDns','CountTimeoutDns','CountEdns','CountNoerror','CountNxdomain','CountQclassIN']
        },

        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        dataZoom: [{
          type: 'inside',
        }, {
            start: 0,
            end: 10,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
              color: '#fff',
              shadowBlur: 3,
              shadowColor: 'rgba(0, 0, 0, 0.6)',
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
        }],
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: timeseriesGraphDataXDayAxis
        },
        yAxis: {
          type: 'value'
        },
        //todo : change name to restype
        series: [
          {
            name : 'CountDns',
            type:'line',
            areaStyle: {normal: {}},
            data: timeseriesGraphCountDns
          },
          {
                  name:'CountTimeoutDns',
                  type:'line',
                  areaStyle: {normal: {}},
                  data: timeseriesGraphCountTimeoutDns
              },
              {
                  name:'CountEdns',
                  type:'line',
                  areaStyle: {normal: {}},
                  data: timeseriesGraphCountEdns
              },
              {
                  name:'CountNoerror',
                  type:'line',
                  areaStyle: {normal: {}},
                  data: timeseriesGraphCountNoerror
              },
              {
                  name:'CountNxdomain',
                  type:'line',
                  areaStyle: {normal: {}},
                  data: timeseriesGraphCountNxdomain
              },
              {
                  name:'CountQclassIN',
                  type:'line',
                  areaStyle: {normal: {}},
                  data: timeseriesGraphCountQclassIN
              }
        ]
};
timeseriesGraphDomOption2 = {
        tooltip: {
          trigger: 'axis',
        },
        toolbox: {
          feature: {
            dataZoom: {
                yAxisIndex: 'none'
              },
              restore: {},
              saveAsImage: {}
          }
        },
        legend: {
          data:['CountDns','CountIpv4','CountIpv6','CountTcp','CountUdp']
        },

        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        dataZoom: [{
          type: 'inside',
        }, {
            start: 0,
            end: 10,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
              color: '#fff',
              shadowBlur: 3,
              shadowColor: 'rgba(0, 0, 0, 0.6)',
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
        }],
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: timeseriesGraphDataXDayAxis
        },
        yAxis: {
          type: 'value'
        },
        //todo : change name to restype
        series: [
          {
            name : 'CountDns',
            type:'line',
            areaStyle: {normal: {}},
            data: timeseriesGraphCountDns
          },
              {
                  name:'CountIpv4',
                  type:'line',
                  areaStyle: {normal: {}},
                  data: timeseriesGraphCountIpv4
              },
              {
                  name:'CountIpv6',
                  type:'line',
                  areaStyle: {normal: {}},
                  data: timeseriesGraphCountIpv6
              },
              {
                  name:'CountTcp',
                  type:'line',
                  areaStyle: {normal: {}},
                  data: timeseriesGraphCountTcp
              },
              {
                  name:'CountUdp',
                  type:'line',
                  areaStyle: {normal: {}},
                  data: timeseriesGraphCountUdp
              }
        ]
    };
    timeseriesGraphDomOption3 = {
        tooltip: {
          trigger: 'axis',
        },
        toolbox: {
          feature: {
            dataZoom: {
                yAxisIndex: 'none'
              },
              restore: {},
              saveAsImage: {}
          }
        },
        legend: {
          data:['CountDns','CountOpcodeAA','CountOpcodeTC','CountOpcodeRD','CountOpcodeRA','CountOpcodeCD','CountOpcodeAD','CountOpcodeQR']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        dataZoom: [{
          type: 'inside',
        }, {
            start: 0,
            end: 10,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
              color: '#fff',
              shadowBlur: 3,
              shadowColor: 'rgba(0, 0, 0, 0.6)',
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
        }],
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: timeseriesGraphDataXDayAxis
        },
        yAxis: {
          type: 'value'
        },
        //todo : change name to restype
        series: [
          {
            name : 'CountDns',
            type:'line',
            areaStyle: {normal: {}},
            data: timeseriesGraphCountDns
          },
              {
                  name:'CountOpcodeAA',
                  type:'line',
                  areaStyle: {normal: {}},
                  data: timeseriesGraphCountOpcodeAA
              },
              {
                  name:'CountOpcodeTC',
                  type:'line',
                  areaStyle: {normal: {}},
                  data: timeseriesGraphCountOpcodeTC
              },
              {
                  name:'CountOpcodeRD',
                  type:'line',
                  areaStyle: {normal: {}},
                  data: timeseriesGraphCountOpcodeRD
              },
              {
                  name:'CountOpcodeRA',
                  type:'line',
                  areaStyle: {normal: {}},
                  data: timeseriesGraphCountOpcodeRA
              },
              {
                  name:'CountOpcodeCD',
                  type:'line',
                  areaStyle: {normal: {}},
                  data: timeseriesGraphCountOpcodeCD
              },
              {
                  name:'CountOpcodeAD',
                  type:'line',
                  areaStyle: {normal: {}},
                  data: timeseriesGraphCountOpcodeAD
              },
              {
                  name:'CountOpcodeQR',
                  type:'line',
                  areaStyle: {normal: {}},
                  data: timeseriesGraphCountOpcodeQR
              }
        ]
    };
    timeseriesGraphDomOption4 = {
        tooltip: {
          trigger: 'axis',
        },
        toolbox: {
          feature: {
            dataZoom: {
                yAxisIndex: 'none'
              },
              restore: {},
              saveAsImage: {}
          }
        },
        legend: {
          data:['CountDns','CountQtypeA','CountQtypeNS','CountQtypeCNAME','CountQtypeSOA','CountQtypeWKS','CountQtypePTR','CountQtypeMX','CountQtypeSRV','CountQtypeAAAA','CountQtypeANY']
        },

        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        dataZoom: [{
          type: 'inside',
        }, {
            start: 0,
            end: 10,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
              color: '#fff',
              shadowBlur: 3,
              shadowColor: 'rgba(0, 0, 0, 0.6)',
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
        }],
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: timeseriesGraphDataXDayAxis
        },
        yAxis: {
          type: 'value'
        },
        //todo : change name to restype
        series: [
          {
            name : 'CountDns',
            type:'line',
            areaStyle: {normal: {}},
            data: timeseriesGraphCountDns
          },
              {
                  name:'CountQtypeA',
                  type:'line',
                  areaStyle: {normal: {}},
                  data: timeseriesGraphCountQtypeA
              },
              {
                  name:'CountQtypeNS',
                  type:'line',
                  areaStyle: {normal: {}},
                  data: timeseriesGraphCountQtypeNS
              },
              {
                  name:'CountQtypeCNAME',
                  type:'line',
                  areaStyle: {normal: {}},
                  data: timeseriesGraphCountQtypeCNAME
              },
              {
                  name:'CountQtypeSOA',
                  type:'line',
                  areaStyle: {normal: {}},
                  data: timeseriesGraphCountQtypeSOA
              },
              {
                  name:'CountQtypeWKS',
                  type:'line',
                  areaStyle: {normal: {}},
                  data: timeseriesGraphCountQtypeWKS
              },
              {
                  name:'CountQtypePTR',
                  type:'line',
                  areaStyle: {normal: {}},
                  data: timeseriesGraphCountQtypePTR
              },
              {
                  name:'CountQtypeMX',
                  type:'line',
                  areaStyle: {normal: {}},
                  data: timeseriesGraphCountQtypeMX
              },
              {
                  name:'CountQtypeSRV',
                  type:'line',
                  areaStyle: {normal: {}},
                  data: timeseriesGraphCountQtypeSRV
              },
              {
                  name:'CountQtypeAAAA',
                  type:'line',
                  areaStyle: {normal: {}},
                  data: timeseriesGraphCountQtypeAAAA
              },
              {
                  name:'CountQtypeANY',
                  type:'line',
                  areaStyle: {normal: {}},
                  data: timeseriesGraphCountQtypeANY
              }
        ]
    };


    timeseriesGraphChart1.setOption(timeseriesGraphDomOption1, false);
    timeseriesGraphChart2.setOption(timeseriesGraphDomOption2, false);
    timeseriesGraphChart3.setOption(timeseriesGraphDomOption3, false);
    timeseriesGraphChart4.setOption(timeseriesGraphDomOption4, false);
}

//plotTimeseriesGraph('1489597200','1489683600')

$(document).ready(function() {

  $(function() {
      $('input[name="timeseriesDatePicker"]').daterangepicker({
          singleDatePicker: true,
          showDropdowns: true
      },
      function(start, end, label) {
          var queryStartDateIn = Date.parse(start.format('YYYY-MM-DD')+'T00:00:00+07:00');
          var queryEndDateIn
          queryStartDateIn = queryStartDateIn/1000;
          //(24*3600) = 86400
          queryEndDateIn = queryStartDateIn+86400;
          timeseriesGraphStartTime = queryStartDateIn
          timeseriesGraphEndTime = queryEndDateIn
          //alert(queryStartDateIn)
          //alert(queryEndDateIn)
          plotTimeseriesGraph(timeseriesGraphStartTime,timeseriesGraphEndTime)
      });
  });
} );