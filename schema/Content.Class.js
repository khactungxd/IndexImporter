var Content = {
};

Content.Create = function(name, arr){
  for(var i = 0; i < name.length; i++){
    var name1 = name[i];
    this.name1 = arr[i];
  }
}
module.exports = Content;