var Content = {
//  depot_number_str:"",
//  document_id_str:"",
//  document_type_str:"",
//  dokumentennummer_str:"",
//  export_boolean:"",
//  full_path:"",
//  input_file_name_str:"",
//  internal_id:"",
//  page_count_int:"",
//  pi_eingangsdatum_date:"",
//  pi_full_path:"",
//  pi_import_path_str:"",
//  pi_inputchannel_str:"",
//  pi_level_0:"",
//  pi_level_1:"",
//  pi_level_2:"",
//  pi_level_3:"",
//  pi_mandant_str:"",
//  pi_order_id_str:"",
//  pi_process_id_str:"",
//  pi_process_type_str:"",
//  pi_sm_status_str:"",
//  pi_stack_id_str:"",
//  recovery_id_ftxt:"",
//  recovery_id_str:"",
//  toverify_boolean:"",
//  update_boolean:""
};

Content.Create = function(arr){
  this.depot_number_str = arr[0];
  this.document_id_str = arr[1];
  this.document_type_str = arr[2];
  this.dokumentennummer_str = arr[3];
  this.export_boolean = arr[4];
  this.full_path = arr[5];
  this.input_file_name_str = arr[6];
  this.internal_id = arr[7];
  this.page_count_int = arr[8];
  this.pi_eingangsdatum_date = arr[9];
  this.pi_full_path = arr[10];
  this.pi_import_path_str = arr[11];
  this.pi_inputchannel_str = arr[12];
  this.pi_level_0 = arr[13];
  this.pi_level_1 = arr[14];
  this.pi_level_2 = arr[15];
  this.pi_level_3 = arr[16];
  this.pi_mandant_str = arr[17];
  this.pi_order_id_str = arr[18];
  this.pi_process_id_str = arr[19];
  this.pi_process_type_str = arr[20];
  this.pi_sm_status_str = arr[21];
  this.pi_stack_id_str = arr[22];
  this.recovery_id_ftxt = arr[23];
  this.recovery_id_str = arr[24];
  this.toverify_boolean = arr[25];
  this.update_boolean = arr[26];
}
module.exports = Content;