$(document).ready(function(){
 
 $(".expand_tiles")
    .bind("ajax:success", function(evt, data, status, xhr){
//      var $expansion = $("#")i
    var items = data["tile_items"];
    var keys = data["tile_keys"];
    var data_loc_elem = $("#" + data["data_loc"]);

    var insertString = ""; 
    data_loc_elem.empty();
    insertString += "<table><tr>";
    for (var key in keys){
      insertString += "<td>"+keys[key]+"</td>";
    }
    insertString += "</tr>";
    for(var t in items){
    insertString += "<tr>";
      for(var v in keys){
        //insertString += "<td>"+items[t][v]+"</td>";
        insertString += "<td>"+items[t]["terrain_item"][keys[v]]+"</td>";
      }
    insertString += "</tr>";
    }
    insertString += "</table>";
    data_loc_elem.append(insertString);
  });
	
});
