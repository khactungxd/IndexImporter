var CONFIG = require("../config");
var fs = require("fs-extra");
var path = require('path');
var async = require('async');
var request = require('request');   // npm install request

exports.execute = function (OrderString, OrderID, nameFolder, cb) {
  var params = {
    "orderarchive-only": true,
    "order": OrderString.toString(),
    "response-format": "json"
  }

  request(
    {
      method: 'POST',
//          url: 'http://192.168.16.235:8090/order',
      url: CONFIG.WEBSERVICE_URL,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "charset": "utf-8"
      },
      form: params
    }
    , function (error, response, body) {
      if(response.statusCode == 200){
        //write OrderString to xml post success
        fs.writeFileSync('./public/xml/'+nameFolder+'/success/' + OrderID + '.xml', OrderString);
        fs.appendFile('./public/xml/'+nameFolder+'/success/log.txt', '\n'+OrderID, function(err){

        });
      }
      else{
        // write OrderString to xml post fail
        fs.writeFileSync('./public/xml/'+nameFolder+'/fail/' + OrderID + '.xml', OrderString);
        fs.appendFile('./public/xml/'+nameFolder+'/fail/log.txt', '\n'+OrderID, function(err){

        });
      }
      cb();
    }
  )
}

