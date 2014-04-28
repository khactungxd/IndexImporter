var OrderSchema = require('../schema/Order.Class_1.js');
var js2xmlparser = require("js2xmlparser");

//------------------------------------------------------ order ------------------------------
var MANDANT = "wackler";
var PROCESS_TYPE = "administration";
var DOCUMENT_TYPE = "import_protocol";
var GENERATE2XML = function (orderarr, orderarr2, arrayName, orderIndex, processIndexin, stackIndex) {
  this.arr = orderarr;
  this.arr2 = orderarr2;
  this.arrayName = arrayName;
  this.orderId = orderarr2[0][orderIndex];
  this.stackId = orderarr2[0][stackIndex];
  this.processIndex = processIndexin;
//  this.processId = orderarr.pi_process_id_str;
//  this.documentId = orderarr.document_id_str;
  this.mandant = MANDANT;
  this.processType = PROCESS_TYPE;
  this.documentType = DOCUMENT_TYPE;
}

GENERATE2XML.prototype.generateXML = function () {
  var order = new OrderSchema.order();
  order.id = this.orderId;
  order.actionList = {};
  order.mandant = this.mandant;
  order.inputChannel = {};
  order.exportChannel = {};

//------------------------------------------------------ stack ------------------------------
  var stack = new OrderSchema.Stack();
  stack.id = this.stackId;

  var processlis = [];
//------------------------------------------------------ generate2orderxml ------------------------------
  for (var i = 0; i < this.arr.length; i++) {

    var process = new OrderSchema.Process();
    process.id = this.arr2[i][this.processIndex];
    process.processType = this.processType;
    process.actionList = {};
    process.processPriority = {};

    //------------------------------------------------------ indexData for generate2orderxml------------------------------
    var indexDataProcess = new OrderSchema.IndexData();
    var indexFieldListProcess = new OrderSchema.IndexFieldList();

    var arrIndexFieldProcess = [];
    for(var t = 0; t < this.arrayName.length; t++){
      if(this.arr2[i][t]&&this.arrayName[t].indexOf("pi_")==0){
        var tempOb = new OrderSchema.IndexField();
        tempOb.name = this.arrayName[t];
        tempOb.value = this.arr2[i][t];
        arrIndexFieldProcess.push(tempOb);
      }
    }


    //------------------------------------------------------ document ------------------------------
    var document = new OrderSchema.Document();
    document.id = this.arr[i].document_id_str
    document.documentType = this.documentType;
    document.idType = {};
    document.actionList = {};
    document.inputType = {};

    //------------------------------------------------------ indexData for document ------------------------------

    var indexDataDocument = new OrderSchema.IndexData();
    var indexFieldListDocument = new OrderSchema.IndexFieldList();

    var arrIndexFieldDocument = [];
    for(var j = 0; j < this.arrayName.length; j++){
      if(this.arr2[i][j]&&this.arrayName[j].indexOf("pi_")!=0&&this.arrayName[j] != "internal_id"&&this.arrayName[j] != "full_path"){
        var tempOb = new OrderSchema.IndexField();
        tempOb.name = this.arrayName[j];
        tempOb.value = this.arr2[i][j];
        arrIndexFieldDocument.push(tempOb);
      }
    }

    //------------------------------------------------------ push document --> generate2orderxml ------------------------------
    process.documentList = {document: document};
    //------------------------------------------------------ push arrIndexFieldDocument ---> indexFieldList ------------------------------
    indexFieldListDocument.indexField = arrIndexFieldDocument;
    indexDataDocument.indexFieldList = indexFieldListDocument;

    //------------------------------------------------------ push indexDataDocument ---> document ------------------------------
    document.indexData = indexDataDocument;

    //------------------------------------------------------ push arrIndexFieldProcess --> indexFieldList ------------------------------
    indexFieldListProcess.indexField = arrIndexFieldProcess;
    indexDataProcess.indexFieldList = indexFieldListProcess;


    //------------------------------------------------------ push indexDataProcess ---> generate2orderxml ------------------------------
    process.indexData = indexDataProcess;


    //------------------------------------------------------ push generate2orderxml --- > processList in stack ------------------------------
//    stack.processList.push({process: process});
    processlis.push(process);

    //------------------------------------------------------ push stack --->order ------------------------------
  }
  stack.processList = {process: processlis};
  order.stack = stack;
  return js2xmlparser("ns2:order", order, {
    prettyPrinting: {
      enabled: false
    }
  });
}

module.exports = GENERATE2XML;