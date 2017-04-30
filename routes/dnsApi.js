var express = require('express');
var router = express.Router();
var elasticsearch = require('elasticsearch');

var client  = new elasticsearch.Client({
	host: 'localhost:9200'
});


router.get('/', function(req, res, next) {
  res.send('api home');
});

router.get('/summary/:startTime/:endTime', function (req, res, next) {
  console.log('startTime:', req.params.startTime);
  console.log('endTime:', req.params.endTime);
  console.log('qType:', req.query.qtype);
  var days = 14
  var querySize = days*24
  client.search({
  index: 'dnsanalyzerstore',
  type: 'analyzedhour',
  body: {
  	"size": querySize,
  	"from": 0,
  	"sort" : [
        { "timestamp_s" : {"order" : "asc"}}
    ],
    "query": {
        "range" : {
            "timestamp_s" : {
                "gte" : req.params.startTime,
                "lte" : req.params.endTime
            }
        }
  }
	}
	}).then(function (resp) {
    var hits = resp.hits.hits;
    var queryType = req.query.qtype;
    var result = []
    for(var i = 0 ;i <= days-1 ; i++){
    	for(var j=0; j <= 23 ;j++){
    		if(hits[(i*24)+j] != undefined){
    			result[(i*24)+j] = [parseInt(j),parseInt(i),hits[(i*24)+j]._source[queryType],(hits[(i*24)+j]._source.countNxdomain/hits[(i*24)+j]._source.countNoerror),hits[(i*24)+j]._source.timestamp_s]
    		}
    		else{
    			result[(i*24)+j] = [parseInt(j),parseInt(i),0]
    		}
    		//console.log((i*24)+j);
    	}
    }
    res.json(result);
    //res.send('test')
	}, function (err) {
    	console.trace(err.message);
    	console.log(err.message)
	});
  //next()
})

router.get('/timeseries/:startTime/:endTime', function (req, res, next) {
  console.log('startTime:', req.params.startTime);
  console.log('endTime:', req.params.endTime);
  console.log('resType:', req.query.restype)

  client.search({
  index: 'dnsanalyzerstore',
  type: 'analyzedminute',
  body: {
    "size": 10000,
    "from": 0,
    "sort" : [
        { "timestamp_s" : {"order" : "asc"}}
    ],
    "query": {
        "range" : {
            "timestamp_s" : {
                "gte" : req.params.startTime,
                "lte" : req.params.endTime
            }
        }
    }
  }
  }).then(function (resp) {
    var hits = resp.hits.hits;
    console.log(hits.length)
    var result = []
    var resType = req.query.restype;
    for(var i = 0;i<hits.length;i++){
      result[i] = [parseInt(i),
      hits[i]._source.timestamp_s,
      hits[i]._source.countDns,
      hits[i]._source.countTimeoutDns,
      hits[i]._source.countIpv4,
      hits[i]._source.countIpv6,
      hits[i]._source.countTcp,
      hits[i]._source.countUdp,
      hits[i]._source.countEdns,
      hits[i]._source.countOpcode.AA,
      hits[i]._source.countOpcode.TC,
      hits[i]._source.countOpcode.RD,
      hits[i]._source.countOpcode.RA,
      hits[i]._source.countOpcode.CD,
      hits[i]._source.countOpcode.AD,
      hits[i]._source.countOpcode.QR,
      hits[i]._source.countNoerror,
      hits[i]._source.countNxdomain,
      hits[i]._source.countQtype.A,
      hits[i]._source.countQtype.NS,
      hits[i]._source.countQtype.CNAME,
      hits[i]._source.countQtype.SOA,
      hits[i]._source.countQtype.WKS,
      hits[i]._source.countQtype.PTR,
      hits[i]._source.countQtype.MX,
      hits[i]._source.countQtype.SRV,
      hits[i]._source.countQtype.AAAA,
      hits[i]._source.countQtype.ANY,
      hits[i]._source.countQclass.IN]

      
/*      result[i] = [parseInt(i),
      hits[i]._source.timestamp_s,
      hits[i]._source[resType]]*/
    }
    //res.json(hits)
    res.json(result);
    //res.send('test')
  }, function (err) {
      console.trace(err.message);
      console.log(err.message)
  });
  //next()
})

router.get('/topList/:startTime/:endTime', function (req, res, next) {
  console.log('startTime:', req.params.startTime);
  console.log('endTime:', req.params.endTime);

  console.log('qtype:', req.query.qtype)

  //var days = 1
  //var querySize = 1000
  client.search({
  index: 'dnsanalyzerstore',
  type: 'analyzedhour',
  body: {
    "size": 1000,
    "from": 0,
/*    "sort" : [
        { "countQtype.A" : { "order" : "asc"}}
    ],*/
    "query": {
        "range" : {
            "timestamp_s" : {
                "gte" : req.params.startTime,
                "lte" : req.params.endTime
            }
        }
    },
/*    aggs: {
        "sum_result" : { "sum" : { "field" : "countOpcode.AA" } }
    }*/

//you must enable field_data before use this section below
/*    "aggs" : {
        "sum_result" : {
            "nested" : {
                "path" : "countIpsource"
            },
            "aggs" : {
                "countIpsource1234" : { "sum" : { "field" : "countIpsource.hostname" } }
            }
        }
    }*/

  }
  }).then(function (resp) {
    var qtype = req.query.qtype;
    var hits = resp.hits.hits;
    //var hits = resp.aggregations;
    //var hits = resp;

    var result = []

    var obj = hits[0]._source[qtype]
    //var obj = hits[0]._source.countOpcode

    //under construction
    //var obj = hits[0]._source.countQuery
    //var obj = hits[0]._source.countIpsource

//type selector(not complete)
/*    var resType = countQtype
    if(req.query.type == 'qtype'){

    }*/

//result aggragate(not complete)
/*    for(var i=0;i<hits.length;i++){
      result[i] = hits[i]._source.countQtype
    }*/

//type2
/*    for(a in obj){
      result.push([obj[a].hostname,obj[a].count])
    }*/
//type1

    for(a in obj){
      result.push([a,obj[a]])
    }


//sort
    result.sort(function(a,b){return a[1] - b[1]});
    result.reverse();  

    var returnRes = {}
    returnRes.data = result

    //res.json(hits);
    res.json(returnRes);
    //res.send('test');
  }, function (err) {
      console.trace(err.message);
      console.log(err.message)
  });
  //next()
})

module.exports = router;