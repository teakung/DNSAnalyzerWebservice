var tableGraphApiUrl = 'http://158.108.183.21:3000/dnsApi/topList2'
//http://158.108.183.21:3000/dnsApi/topList2/1489597200/1489680000?qtype=countQuery
var tableGraphStartTime = ''
var tableGraphEndTime = ''
var tableGraphQueryType = 'countQuery'

$('#tableContainer').DataTable( {
    "ajax": 'http://158.108.183.21:3000/dnsApi/topList2/1489597200/1489680000?qtype=countQuery'
} );

$(document).ready(function() {
    $('input[name="tableDaterangePicker"]').daterangepicker(
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
        tableGraphStartTime = queryStartDateIn
        tableGraphEndTime = queryEndDateIn
        //alert(summaryGraphStartTime)
        //alert(summaryGraphEndTime)
      }
    )
} );