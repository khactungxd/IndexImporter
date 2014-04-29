var fs = require('fs-extra');
var Contentclass = require('../schema/Content.Class');
var GENERATE2XML = require('../include/XmlGenerator');
var POSTORDERTOORDERSYSTEM = require('../include/PostOrderToOrderSystem');

exports.htmlReading = function (req, res) {
  var StringofHTml = '';
  if (req.files.htmlfile.name) {
//  fs.readdir(req.files.htmlfile.name.path, function (err, files) {
//    if (!err) {
//      for (var t = 0; t < 9; t++) {
//        var FileName = files[t];
//        fs.mkdirsSync('./public/xml/'+FileName);
//        fs.writeFileSync('./public/xml/'+FileName+'/addSuccess.txt', 'List Of OrderID add Success');
//        fs.writeFileSync('./public/xml/'+FileName+'/addFail.txt', 'List Of OrderID add Fail');
//        fs.mkdirsSync('./public/xml/'+FileName+'/success/');
//        fs.mkdirsSync('./public/xml/'+FileName+'/fail/');
    fs.readFile(req.files.htmlfile.path, function (err, data) {
//          emptyDirectory('./public/xml/');
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
        var indexOfStackID = arrayName.indexOf('pi_stack_id_str');
        var indexOfDocumentID = arrayName.indexOf('document_id_str');

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
        var arrContent2 = [];
        var i = 0;
        while (arrayListValues.length != 0) {
//        console.log(arrayListValues.length+'___'+i++);
          //order by OrderID
          var arrOrderProcess = [];
          var arrSumOrder = [];
          var arrSumOrder2 = [];
          arrSumOrder.push(new Contentclass.Create(arrayName, arrayListValues[0]));
          arrSumOrder2.push(arrayListValues[0]);
          for (var k = 1; k < arrayListValues.length; k++) {

            if (arrayListValues[0][indexOfOrderID] == arrayListValues[k][indexOfOrderID]) {
//            console.log(arrayListValues.length+'___'+k);
              arrSumOrder.push(new Contentclass.Create(arrayName, arrayListValues[k]));
              arrSumOrder2.push(arrayListValues[k]);
              arrayListValues.splice(arrayListValues.indexOf(arrayListValues[k]), 1);
              k--;
            }
            count++;
          }
          arrayListValues.splice(arrayListValues.indexOf(arrayListValues[0]), 1);

          //order by ProcessID on a OrderID
//              while(arrSumOrder.length!=0) {
//                var arrSumProcess = [];
//                arrSumProcess.push(arrSumOrder[k]);
//                //order by ProcessID
//                for (var h = 0; h < arrSumOrder.length; h++) {
//                  for (var k = 1)
//                  if (arrSumOrder[h][0].pi_process_id_str == arrSumOrder[k].pi_process_id_str) {
//                    console.log("in if");
//                    arrSumProcess.push(arrSumOrder[h]);
//                    arrSumOrder.splice(arrSumOrder.indexOf(arrSumOrder[h]), 1);
//                  }
//                }
//                arrOrderProcess.push(arrSumProcess)
//              }
          arrContent.push(arrSumOrder);
          arrContent2.push(arrSumOrder2);
        }

        //Create xml:
        var arrListFileXml = [];
        for (var i = 0; i < arrContent.length; i++) {
          var xml = new GENERATE2XML(arrContent[i], arrContent2[i], arrayName, indexOfOrderID, indexOfProcessID, indexOfStackID, indexOfDocumentID).generateXML();
          fs.writeFileSync('./public/xml/' + arrContent2[i][0][indexOfOrderID] + '.xml', xml);
          arrListFileXml.push(arrContent2[i][0][indexOfOrderID]);
//              POSTORDERTOORDERSYSTEM.execute(xml, arrContent2[i][0][indexOfOrderID], FileName, function () {
//                  });
        }
        res.render('xmlView', { arrListFileXml: arrListFileXml });
      }
      else {
        console.log('err: ', err);
        res.send("Can't read your file!");
        res.end();
      }
    });
//      }
//    }
//    else {
//      console.log("in else: ", err);
//    }
//  });
  }
}

function emptyDirectory(path) {
  try {
    fs.removeSync(path);
  } catch (err) {
    cb(err);
  } finally {
    try {
      fs.mkdirsSync(path);
    } catch (err) {
      console.log("[ERROR] Cannot empty directory !")
      return err;
    } finally {
      return;
    }
  }
}


function harseHtml(content) {

}

function creatXML(orderOB) {

}

