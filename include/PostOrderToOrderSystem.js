var CONFIG = require("../config");
var fs = require("fs-extra");
var request = require('request');
var Logger = require('../include/logger');

exports.execute = function (OrderString, OrderID, cb) {
  var logger = new Logger("./log/log.txt");
  var params = {
    "orderarchive-only": true,
    "order": OrderString.toString(),
    "response-format": "json"
  }

  // Post orderID to OrderSystem
  request(
    {
      method: 'POST',
      url: CONFIG.WEBSERVICE_URL,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "charset": "utf-8"
      },
      form: params
    }
    , function (error, response, body) {
      if(response.statusCode == 200){
        //Log to success:
        logger.log(OrderID,"Success","");
//        console.log("success");
      }
      else{
        // Log to Fail
        logger.log(OrderID,"Fail","");
//        console.log("fail");
      }
      cb();
    }
  )
}

