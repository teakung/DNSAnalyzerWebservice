$(document).ready(function() {
    $('#tableContainer').DataTable( {
      "ajax": 'http://158.108.183.21:3000/dnsApi/topList/1489568400/1489572000?qtype=countQtype'
    } );
} );