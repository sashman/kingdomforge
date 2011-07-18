$(document).ready(function(){
 
 $(".expand_tiles")
    .bind("ajax:success", function(evt, data, status, xhr){
//      var $expansion = $("#")i
    var items = data["tile_items"];
    var data_loc = data["data_loc"];
    $("#" + data_loc).empty(); 
    for(var t in items){
      for(var v in items[t]){
          $("#"+data_loc).append("hello");
        }
    }
  });
	
});
