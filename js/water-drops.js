// This creates an array of positions for all the drops in the pyramid
// each point represents the center base of the drop
function pyramid_drops_array_builder(){
  var drops_per_side = document.getElementById("drops_per_side").value;
  var drops = [];
  var x = 0;
  var y = 0;
  var z = +document.getElementById("dish_height").value;
  var distance_btw_drops = +document.getElementById("distance_between_drops").value;
    // Columns
    for(var j=0; j<=drops_per_side; j++){
      y = j*distance_btw_drops;
      // Rows
      for(var i=0; i<=drops_per_side; i++){
        x = i*distance_btw_drops;
        drops.push([x,y,z]);
        console.log(x + "," + y + "," + z);
      }
    }
  return drops;
}

function buildGCode() {
  //var num_droplets = +document.getElementById("droplets_number").value;
  var travel_feedrate = document.getElementById("travel_feedrate").value;
  var drop_printing_initial_height = +document.getElementById("drop_printing_initial_height").value;
  var drop_printing_final_height = +document.getElementById("drop_printing_final_height").value;
  var drop_extrusion = +document.getElementById("drop_extrusion").value;
  var drop_feedrate = document.getElementById("drop_feedrate").value;
  var drop_retraction = +document.getElementById("drop_retraction").value;
  var z_lift = +document.getElementById("travel_z_lift").value;
  
  var e = 0;
  console.log("HOLA");
  
  var drops = pyramid_drops_array_builder();
	// Initial homing position
	var fullGCode ="G28 \n";
  // Reset extruder value
	fullGCode += "G92 E0 \n";

	for(var i = 0; i < drops.length; i++) {

    // Move on top of a drop
      // Z = point z + point height
    var z = drops[i][2] + drop_printing_final_height;
    fullGCode += "G1 X" + drops[i][0] + " Y" + drops[i][1] + " Z" + z + " F" + travel_feedrate + " \n";

    // Go to the startinng print drop height
    z = drops[i][2] + drop_printing_initial_height;
    fullGCode += "G1 Z" + z + " \n";

    // Recover retraction or build up pressure
    e += drop_retraction;
    fullGCode += "G1 E" + e + " F" + drop_feedrate + " \n";
    
    // print until final printing drop height
    z = drops[i][2] + drop_printing_final_height;
    e += drop_extrusion;
    fullGCode += "G1 Z" + z + " E" + e + " \n";

    // Retraction
    e -= drop_retraction;
    fullGCode += "G1 E" + e + " \n";    
    
    // z lift
    z += z_lift;
    fullGCode += "G1 Z" + z + " F" + travel_feedrate + " \n";

	}
  
  //  Home printer
	fullGCode += "G28 \n";
  // Reset extruder value
	fullGCode += "G92 E0 \n";
  // Disable motors
	fullGCode += "M84 \n";  
  
	return fullGCode;
}

function createFile(){
	var output = getParameters();
	output += buildGCode();
	var GCodeFile = new Blob([output], {type: 'text/plain'});
	saveAs(GCodeFile, "water_drops" + '.gcode');
}

function getParameters(){
var params = [];
	params += "; GCode generated with Stalactite from www.3digitalcooks.com \n";
	params += "; dish_height: " + document.getElementById("dish_height").value + "\n";
	params += "; travel_feedrate: " + document.getElementById("travel_feedrate").value + "\n";
	params += "; travel_z_lift: " + document.getElementById("travel_z_lift").value + "\n"; 
	params += "; drops_per_side: " + document.getElementById("drops_per_side").value + "\n"; 
	params += "; distance_between_drops: " + document.getElementById("distance_between_drops").value + "\n";
	params += "; drop_printing_initial_height: " + document.getElementById("drop_printing_initial_height").value + "\n";
	params += "; drop_printing_final_height: " + document.getElementById("drop_printing_final_height").value + "\n";  
	params += "; drop_feedrate: " + document.getElementById("drop_feedrate").value + "\n";

return params;
}
