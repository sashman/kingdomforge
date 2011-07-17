$(document).ready(function(){
 

 $(".expand_tiles")
    .bind("ajax:success", function(evt, data, status, xhr){
//      var $expansion = $("#")i
    var items = data["tile_items"];
    var sender = data["submitter"];
    $("#" + sender).hide();
    for(var t in items){
      
    }
    });

});
