/* set up XMLHttpRequest */
//var url = "2015-2016 Master Schedule.xlsx";
var url = "https://dl.dropboxusercontent.com/s/gmmx80eo2py9zp0/2015-2016%20Master%20Schedule.xlsx?raw=1";

var oReq = new XMLHttpRequest();
oReq.open("GET", url, true);
oReq.responseType = "arraybuffer";

oReq.onload = function(e) {
  var arraybuffer = oReq.response;

  /* convert data to binary string */
  var data = new Uint8Array(arraybuffer);
  var arr = new Array();
  for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
  var bstr = arr.join("");

  /* Call XLSX */
  var workbook = XLSX.read(bstr, {type:"binary"});


	var first_sheet_name = workbook.SheetNames[0];
	var dateCell = "B";

	/* Get worksheet */
	var worksheet = workbook.Sheets[first_sheet_name];

	var today = new Date()
	
	$("#today").html(today.format("fullDate"));

	var todayStr = ( today.getMonth() + 1 )  + "/" + today.getDate() + "/" + ( today.getFullYear() - 2000)
	debug(todayStr);
	var i = 1;
	var dt;
	do  {
		dt = getValue(worksheet,dateCell + i);
		var rink = getValue(worksheet,"E" + i);
		if (  dt == todayStr && rink == "West Side Arena") {
			debug("Row " + i)
			processRow(worksheet,i)
		}
		i++;
	}while(  dt != null )

	/* Find desired cell */
	//var desired_cell = worksheet[address_of_cell];

	/* Get the value */
	//var desired_value = desired_cell.w;

	//document.write(desired_value);
}

function onLoad(){
      oReq.send();

}

function debug(s){
	$("#log").html($('#log').html() + s);
	//console.log(s)
}

function getValue(ws,cell){
	try {	
		return ws[cell].w;	
	}catch(err) {
	// no one cares empty cell
	}
	return null;
}
function processRow(ws, i){
  var d 	= getValue(ws,"B" + i);
  var start 	= getValue(ws,"C" + i);
  var end 	= getValue(ws,"D" + i);
  var rink  	= getValue(ws,"E" + i);
  var team 	= getValue(ws,"F" + i);
  var vs 	= getValue(ws,"G" + i);
  var why 	= getValue(ws,"H" + i);
  var homeRoom 	= getValue(ws,"K" + i);
  var awayRoom 	= getValue(ws,"L" + i);
  var notes 	= getValue(ws,"J" + i);

  team = team.replace("MJ","Major");
  team = team.replace("MN","Minor");
  team = team.replace("CI","X-Ice");
  team = team.replace("SL","Select");

  team = team.replace("MT","Mite");
  team = team.replace("SQ","Squirt");
  team = team.replace("PW","Peewee");

   var sHour = end.substring(0,end.indexOf(":"));
   var sMin = end.substring(end.indexOf(":")+1,end.indexOf(" "));
   var sAmPm = end.substring(end.indexOf(" ")+1);


   var d = new Date()

   if ( sAmPm == "PM" && parseInt(sHour) != 12 ){
   	  sHour = parseInt(sHour)+12;
   }


   var endTime = new Date(d.getFullYear(),d.getMonth(),d.getDate(),sHour,sMin )

   if ( endTime < d) { 
   	return
   }
   //Date((excelDate - (25567 + 1))*86400*1000);
    var table = document.getElementById("rooms");
    var row = table.insertRow();
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    cell1.innerHTML = start  + "-" +  end;
    cell2.innerHTML = team;
    cell3.innerHTML = homeRoom;
    if ( vs ) {
        cell4.innerHTML = vs;
    } else if ( notes ) {
        cell4.innerHTML = "Note:"+ notes;
    }
    cell5.innerHTML = awayRoom;


}

