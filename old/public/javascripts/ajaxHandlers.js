$(document).ready(function(){
 function expand_tiles(sender){
	$.ajax({
		url: "tileset/expand_tiles",
		cache: false,
		success: function(html){
			var sender = $(html)("#sender").attr("data-sender");
			alert(sender);
			
		}
	});
 
  }
/*
 $(".expand_tiles")
    .bind("ajax:success", function(evt, data, status, xhr){
// Grab items
    var items = data["tile_items"];
// Grab keys
    var keys = data["tile_keys"];
// Grab data location element
    var data_loc_elem = $("#" + data["data_loc"]);

    var insertString = ""; 
    data_loc_elem.empty();
// For each of the keys -> "ID", "name", etc.
    insertString += "<table><tr>";
    for (var key in keys){
      insertString += "<td>"+keys[key]+"</td>";
    }
    insertString += "</tr>";
// For each of the corresponding values of the keys put their values
// for each item.
    for(var t in items){
    insertString += "<tr>";
      for(var v in keys){
        insertString += "<td>"+items[t]["terrain_item"][keys[v]]+"</td>";
      }
    insertString += "</tr>";
    }
    insertString += "</table>";
    data_loc_elem.append(insertString);
  });
*/	
});
