var fs = require("fs-extra");
var path = require('path');
var async = require('async');
var request = require('request');   // npm install request

processAStack();
function processAStack(cb) {
  fs.readFile('./public/xml/201104131704160921012FDA967E5C1384F774471735EDD5D05F600000000b7d475a5bd.xml' , function(err, orderXML){
    if(!err){
      var params = {
        "orderarchive-only" : true,
        "order" : orderXML,
        "response-format" : "json"
      }

      request(
        {
          method: 'POST',
          url: 'https://wackler-int.oxseed.com/oxseed/orderbase/wackler',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "charset" : "utf-8"
          },
          form  : params
        }
        , function (error, response, body) {
          console.log("response status: ",response.statusCode);
//          cb();
        }
      )
    }
    else{
     console.log("err read file xml",err);
    }
  });
}