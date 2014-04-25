var fs = require('fs-extra');
var Contentclass = require('../schema/Content.Class');
var GENERATE2XML = require('../include/XmlGenerator');

exports.htmlReading = function (req, res) {
  var StringofHTml = '';
  console.log('req: ',req);
  if (req.files.htmlfile.name) {
    fs.readFile(req.files.htmlfile.path, function (err, data) {
      emptyDirectory('./public/xml/');
      if (!err) {
        StringofHTml = data.toString();
        var startOfContent = StringofHTml.indexOf("TOTAL MATCHES");
        var Content = StringofHTml.substring(startOfContent);
        var arrayName = Content.split('</th>\n');
        arrayName.splice(0, 3);
        arrayName.splice(arrayName.length - 1, 1);

        //get list Name
        for (var i = 0; i < arrayName.length; i++) {
          arrayName[i] = arrayName[i].replace('<th>\n', '');
          arrayName[i] = arrayName[i].replace('\n', '');
        }
        var count = 0;
        var indexOfOrderID = arrayName.indexOf('pi_order_id_str');
        var indexOfProcessID = arrayName.indexOf('pi_process_id_str');
        //get list Rows
        var arrayListValues = Content.split('<tr valign="top">\n');
        arrayListValues.splice(0, 1)
        for (var i = 0; i < arrayListValues.length; i++) {
          arrayListValues[i] = arrayListValues[i].split('</td>\n');
          arrayListValues[i].splice(0, 6);
          arrayListValues[i].splice(arrayListValues[i].length - 1, 1);
          for (var j = 0; j < arrayListValues[i].length; j++) {
            arrayListValues[i][j] = arrayListValues[i][j].replace('<td>\n[\n', '');
            arrayListValues[i][j] = arrayListValues[i][j].replace('<td>\n', '');
            arrayListValues[i][j] = arrayListValues[i][j].replace('\n]\n', '');
          }
        }

        //creat group document same Order ID
        var arrContent = [];
        var i = 0;
        while (arrayListValues.length != 0) {
//        console.log(arrayListValues.length+'___'+i++);
          //order by OrderID
          var arrOrderProcess = [];
          var arrSumOrder = [];
          arrSumOrder.push(new Contentclass.Create(arrayListValues[0]));
          for (var k = 1; k < arrayListValues.length; k++) {

            if (arrayListValues[0][indexOfOrderID] == arrayListValues[k][indexOfOrderID]) {
//            console.log(arrayListValues.length+'___'+k);
              arrSumOrder.push(new Contentclass.Create(arrayListValues[k]));
              arrayListValues.splice(arrayListValues.indexOf(arrayListValues[k]), 1);
              k--;
            }
            count++;
          }
          arrayListValues.splice(arrayListValues.indexOf(arrayListValues[0]), 1);

          //order by ProcessID on a OrderID
//        for(var k = 0; k < arrSumOrder.length; k++){
//          var arrSumProcess = [];
//          arrSumProcess.push(arrSumOrder[k]);
//          //order by ProcessID
//          for(var h = k+1; h < arrSumOrder.length-1; h++){
//            if(arrSumOrder[h].pi_process_id_str == arrSumOrder[k].pi_process_id_str){
//              console.log("in if");
//              arrSumProcess.push(arrSumOrder[h]);
//              arrSumOrder.splice(arrSumOrder.indexOf(arrSumOrder[h]), 1);
//            }
//          }
//          arrOrderProcess.push(arrSumProcess)
//        }
          arrContent.push(arrSumOrder);
        }

        //Create xml:
        var arrListFileXml = [];
        for (var i = 0; i < arrContent.length; i++) {
          var xml = new GENERATE2XML(arrContent[i]).generateXML();
          fs.writeFileSync('./public/xml/' + arrContent[i][0].pi_order_id_str + '.xml', xml);
          arrListFileXml.push(arrContent[i][0].pi_order_id_str);
        }
        res.render('xmlView', { arrListFileXml: arrListFileXml });
      }
      else {
        console.log('err: ', err);
        res.send("Can't read your file!");
        res.end();
      }
    });
  }
}

function emptyDirectory(path){
  try{
    fs.removeSync(path);
  }catch(err){
    cb(err);
  }finally{
    try{
      fs.mkdirsSync(path);
    }catch(err){
      console.log("[ERROR] Cannot empty directory !")
      return err;
    }finally{
      return;
    }
  }
}


function harseHtml(content) {

}

function creatXML(orderOB) {

}