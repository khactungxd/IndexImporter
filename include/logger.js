var fs = require("fs-extra");

var Logger = function(url){
  var self = this;
  try{
    if(fs.existsSync(url)){
      self.logPath = url;
    } else {
      fs.writeFileSync(url,"");
    }
  }catch (e){
    console.log(e);
  }
}

Logger.prototype.log = function(orderID, status, info){
  var newDataLog = (!info) ? "" : info;
  var date = getDateTime();
  var dataLog = [date, orderID, status, newDataLog].join("\t\t");
  try{
    fs.appendFileSync(this.logPath, dataLog + "\n");
  } catch (e){
    console.log(e);
  }
}

function getDateTime() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;
  var day  = date.getDate();
  day = (day < 10 ? "0" : "") + day;

  return day + "/" + month + "/" + year;
}

module.exports = Logger;