var fs = require('fs-extra');
var Contentclass = require('../schema/Content.Class');
var GENERATE2XML = require('../include/XmlGenerator');
var POSTORDERTOORDERSYSTEM = require('../include/PostOrderToOrderSystem');
var CONFIG = require('../config/index');

// Read HTML file use upload
exports.htmlReading = function (req, res) {
  var StringofHTml = '';
  if (req.files.htmlfile.name) {
    fs.readFile(req.files.htmlfile.path, function (err, data) {
      if (!err) {
        try{
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
          var indexOfOrderID = arrayName.indexOf('pi_order_id_str');
          var indexOfProcessID = arrayName.indexOf('pi_process_id_str');
          var indexOfStackID = arrayName.indexOf('pi_stack_id_str');
          var indexOfDocumentID = arrayName.indexOf('document_id_str')

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
          while (arrayListValues.length != 0) {
            //order by OrderID
            var arrOrderProcess = [];
            var arrOrderProcess2 = [];
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
            }
            arrayListValues.splice(arrayListValues.indexOf(arrayListValues[0]), 1);

            //order by ProcessID on a OrderID
            while (arrSumOrder2.length != 0) {
              var arrSumProcess = [];
              var arrSumProcess2 = [];
              arrSumProcess.push(arrSumOrder[0]);
              arrSumProcess2.push(arrSumOrder2[0]);
              //order by ProcessID
              for (var h = 1; h < arrSumOrder2.length; h++) {
                if (arrSumOrder2[h][indexOfProcessID] == arrSumOrder2[0][indexOfProcessID]) {
                  arrSumProcess.push(arrSumOrder[h]);
                  arrSumProcess2.push(arrSumOrder2[h]);
                  arrSumOrder2.splice(arrSumOrder2.indexOf(arrSumOrder2[h]), 1);
                  h--;
                }
              }
              arrSumOrder2.splice(arrSumOrder2.indexOf(arrSumOrder2[h]), 1);
              arrOrderProcess.push(arrSumProcess);
              arrOrderProcess2.push(arrSumProcess2);
            }

            arrContent.push(arrOrderProcess);
            arrContent2.push(arrOrderProcess2);
          }
          //Create xml:
          var arrListFileXml = [];
          for (var i = 0; i < arrContent.length; i++) {
            var xml = new GENERATE2XML(arrContent[i], arrContent2[i], arrayName, indexOfOrderID, indexOfProcessID, indexOfStackID, indexOfDocumentID).generateXML();
            fs.writeFileSync(CONFIG.PUBLIC_DIR+arrContent2[i][0][0][indexOfOrderID]+'.xml', xml);
            arrListFileXml.push(arrContent2[i][0][0][indexOfOrderID]);
            POSTORDERTOORDERSYSTEM.execute(xml, arrContent2[i][0][0][indexOfOrderID], function () {
            });
          }
          res.render('xmlView', { arrListFileXml: arrListFileXml});
        }
        catch(ex){

        }
      }
      else {
        console.log('err: ', err);
        res.send("Can't read your file!");
        res.end();
      }
    });
  }
}

