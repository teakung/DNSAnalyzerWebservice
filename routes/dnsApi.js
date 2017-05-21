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
  index: 'dnsanalyzerstore3',
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
    var summaryQtype = req.query.qtype;
    var result = []
    for(var i = 0 ;i <= days-1 ; i++){
    	for(var j=0; j <= 23 ;j++){
    		if(hits[(i*24)+j] != undefined){
    			result[(i*24)+j] = [parseInt(j),parseInt(i),hits[(i*24)+j]._source[summaryQtype],(hits[(i*24)+j]._source.countNxdomain/hits[(i*24)+j]._source.countNoerror),hits[(i*24)+j]._source.timestamp_s]
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

  client.search({
  index: 'dnsanalyzerstore3',
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

function mergeJsonArray(a1,a2){
  var res = a1
  var nameExist = false

  for (var i = 0; i < a2.length; i++){
    nameExist = false
    for(var j = 0;j < res.length; j++){
      if (res[j].hostname == a2[i].hostname){
        nameExist = true
        res[j].count += a2[i].count;
        break;
      }
    }
    if(!nameExist){
      res.push(a2[i])
    }
  }
  return res
}

router.get('/topList/:startTime/:endTime', function (req, res, next) {
  console.log('startTime:', req.params.startTime);
  console.log('endTime:', req.params.endTime);
  console.log('qtype:', req.query.qtype)
  var topListQType = req.query.qtype;

  client.search({
  index: 'dnsanalyzerstore3',
  type: 'analyzedhour',
  body: {
    "size": 1000,
    "from": 0,
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
    console.log('hits length : ',hits.length)
    //var hits = resp;

    var result = []

    //var obj = hits[0]._source[qtype]  
    if(topListQType == 'countQtype'){
      var obj = {"A":0,"NS":0,"CNAME":0,"SOA":0,"WKS":0,"PTR":0,"MX":0,"SRV":0,"AAAA":0,"ANY":0}
      for(var i=0 ;i<hits.length;i++){
        obj.A += hits[i]._source[topListQType].A
        obj.NS += hits[i]._source[topListQType].NS
        obj.CNAME += hits[i]._source[topListQType].CNAME
        obj.SOA += hits[i]._source[topListQType].SOA
        obj.WKS += hits[i]._source[topListQType].WKS
        obj.PTR += hits[i]._source[topListQType].PTR
        obj.MX += hits[i]._source[topListQType].MX
        obj.SRV += hits[i]._source[topListQType].SRV
        obj.AAAA += hits[i]._source[topListQType].AAAA
        obj.ANY += hits[i]._source[topListQType].ANY
      }
    }
    else if(topListQType == 'countOpcode'){
      var obj = {"AA":0,"TC":0,"RD":0,"RA":0,"CD":0,"AD":0,"QR":0}
      for(var i=0 ;i<hits.length;i++){
        obj.AA += hits[i]._source[topListQType].AA
        obj.TC += hits[i]._source[topListQType].TC
        obj.RD += hits[i]._source[topListQType].RD
        obj.RA += hits[i]._source[topListQType].RA
        obj.CD += hits[i]._source[topListQType].CD
        obj.AD += hits[i]._source[topListQType].AD
        obj.QR += hits[i]._source[topListQType].QR
      }
    }

//brute force add section
    else if(topListQType == 'countQuery'){
      var obj = []
      
      for(var i=0 ;i<hits.length;i++){
        console.log(i)
        var obj2 = hits[i]._source.countQuery
        for (var j = 0; j < obj2.length; j++){
          nameExist = false
          for(var k = 0;k < obj.length; k++){
            if (obj[k].hostname == obj2[j].hostname){
              nameExist = true
              obj[k].count += obj2[j].count;
              break;
            }
          }
          if(!nameExist){
            obj.push(obj2[j])
          }
        }
      }
    }
    else if(topListQType == 'countIpsource'){
      var obj = []
      var nameExist = false
      for(var i=0 ;i<hits.length;i++){ 
        console.log(i)
        var obj2 = hits[i]._source.countIpsource
        for (var j = 0; j < obj2.length; j++){
          nameExist = false
          for(var k = 0;k < obj.length; k++){
            if (obj[k].hostname == obj2[j].hostname){
              nameExist = true
              obj[k].count += obj2[j].count;
              break;
            }
          }
          if(!nameExist){
            obj.push(obj2[j])
          }
        }
      }
    }

/*    for(a in obj){
      result.push([a,obj[a]])
    }*/

//sort
/*    result.sort(function(a,b){return a[1] - b[1]});
    result.reverse();  

    var returnRes = {}
    returnRes.data = result*/

    //res.json(hits);
    //res.json(returnRes);
    res.json(obj)
  }, function (err) {
      console.trace(err.message);
      console.log(err.message)
  });
  //next()
})

router.get('/topList2/:startTime/:endTime', function (req, res, next) {
  console.log('startTime:', req.params.startTime);
  console.log('endTime:', req.params.endTime);

  console.log('qtype:', req.query.qtype)
  var topListQType2 = req.query.qtype;

  client.search({
  index: 'dnsanalyzerstore3',
  type: 'analyzedhour',
  body: {
    "size": 1000,
    "from": 0,
/*    "sort" : [
        { "countQtype.A" : { "order" : "asc"}}
    ],*/
    //"_source": ["countIpsource"],
    "query": {
        "range" : {
            "timestamp_s" : {
                "gte" : req.params.startTime,
                "lte" : req.params.endTime
            }
        }
    },
    "aggs" : {
          "Nest" : {
            "nested" : {
                "path" : topListQType2
            },
            "aggs" : {
                "Grouping": {
                  "terms": {
                    "field": topListQType2+".hostname",
                    "size":100,
                    "order": {"sumcount":"desc"}
                  },
                  "aggs": {
                    "sumcount": {
                      "sum": {"field": topListQType2+".count"},
                    }
                  }
                }
            }
        }
    }
  }
  }).then(function (resp) {
    //var hits = resp.hits.hits;
    var hits = resp.aggregations;
    //var hits = resp;

    res.json(hits);
    //res.json(returnRes);
    //res.send('test');
  }, function (err) {
      console.trace(err.message);
      console.log(err.message)
  });
  //next()
})

module.exports = router;