var OrderSchema = require('../schema/Order.Class_1.js');
var js2xmlparser = require("js2xmlparser");

//------------------------------------------------------ order ------------------------------
var MANDANT = "stag";
var PROCESS_TYPE = "administration";
var DOCUMENT_TYPE = "import_protocol";
var GENERATE2XML = function (orderarr) {
  this.arr = orderarr;
  this.orderId = orderarr[0].pi_order_id_str;
  this.stackId = orderarr[0].pi_stack_id_str;
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
    process.id = this.arr[i].pi_process_id_str;
    process.processType = this.processType;
    process.actionList = {};
    process.processPriority = {};

    //------------------------------------------------------ indexData for generate2orderxml------------------------------
    var indexDataProcess = new OrderSchema.IndexData();
    var indexFieldListProcess = new OrderSchema.IndexFieldList();

    var arrIndexFieldProcess = createArray4IndexField(14, new OrderSchema.IndexField());
    arrIndexFieldProcess[0] = {"name": "pi_eingangsdatum_date", "value": this.arr[i].pi_eingangsdatum_date};
    arrIndexFieldProcess[1] = {"name": "pi_full_path", "value": this.arr[i].pi_full_path};
    arrIndexFieldProcess[2] = {"name": "pi_import_path_str", "value": this.arr[i].pi_import_path_str};
    arrIndexFieldProcess[3] = {"name": "pi_inputchannel_str", "value": this.arr[i].pi_inputchannel_str};
    arrIndexFieldProcess[4] = {"name": "pi_level_0", "value": this.arr[i].pi_level_0};
    arrIndexFieldProcess[5] = {"name": "pi_level_1", "value": this.arr[i].pi_level_1};
    arrIndexFieldProcess[6] = {"name": "pi_level_2", "value": this.arr[i].pi_level_2};
    arrIndexFieldProcess[7] = {"name": "pi_level_3", "value": this.arr[i].pi_level_3};
    arrIndexFieldProcess[8] = {"name": "pi_mandant_str", "value": this.arr[i].pi_mandant_str};
    arrIndexFieldProcess[9] = {"name": "pi_order_id_str", "value": this.arr[i].pi_order_id_str};
    arrIndexFieldProcess[10] = {"name": "pi_process_id_str", "value": this.arr[i].pi_process_id_str};
    arrIndexFieldProcess[11] = {"name": "pi_process_type_str", "value": this.arr[i].pi_process_type_str};
    arrIndexFieldProcess[12] = {"name": "pi_sm_status_str", "value": this.arr[i].pi_sm_status_str};
    arrIndexFieldProcess[13] = {"name": "pi_stack_id_str", "value": this.arr[i].pi_stack_id_str};

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

    var arrIndexFieldDocument = createArray4IndexField(13, new OrderSchema.IndexField());
    arrIndexFieldDocument[0] = {"name": "depot_number_str", "value": this.arr[i].depot_number_str};
    arrIndexFieldDocument[1] = {"name": "document_id_str", "value": this.arr[i].document_id_str};
    arrIndexFieldDocument[2] = {"name": "document_type_str", "value": this.arr[i].document_type_str};
    arrIndexFieldDocument[3] = {"name": "dokumentennummer_str", "value": this.arr[i].dokumentennummer_str};
    arrIndexFieldDocument[4] = {"name": "export_boolean", "value": this.arr[i].export_boolean};
    arrIndexFieldDocument[5] = {"name": "full_path", "value": this.arr[i].full_path};
    arrIndexFieldDocument[6] = {"name": "input_file_name_str", "value": this.arr[i].input_file_name_str};
    arrIndexFieldDocument[7] = {"name": "internal_id", "value": this.arr[i].internal_id};
    arrIndexFieldDocument[8] = {"name": "page_count_int", "value": this.arr[i].page_count_int};
    arrIndexFieldDocument[9] = {"name": "recovery_id_ftxt", "value": this.arr[i].recovery_id_ftxt};
    arrIndexFieldDocument[10] = {"name": "recovery_id_str", "value": this.arr[i].recovery_id_str};
    arrIndexFieldDocument[11] = {"name": "toverify_boolean", "value": this.arr[i].toverify_boolean};
    arrIndexFieldDocument[12] = {"name": "update_boolean", "value": this.arr[i].update_boolean};
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


function createArray4IndexField(length, defaultVal) {
  var arrayIndexField = [];
  for (var i = 0; i < length; i++) {
    arrayIndexField.push(defaultVal);
  }
  return arrayIndexField;
}

module.exports = GENERATE2XML;