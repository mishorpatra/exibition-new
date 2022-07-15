import $ from 'jquery'



export const getGlobalPoints = (venue_name, building_name, setGlobalCoords, setLandmarks) => {

let poly_data
let data
let cord_data;
let red_data;
let floors;
var myJSON;
var myJSON_poly;

//four corners
var coords = [] 

// loads new.js script
/*function get_data(){
  console.log("entered");
  return global_poly
}
*/


// get reference points from the api
function getcoord(callbackFn){
  coords[0] = { "lat": parseFloat(cord_data['coordinates'][2]['globalRef']['lat']), "lon": parseFloat(cord_data['coordinates'][2]['globalRef']['lng']), localx: parseFloat(cord_data['coordinates'][2]['localRef']['lng']) ,localy: parseFloat(cord_data['coordinates'][2]['localRef']['lat']) } 
  coords[1] = { "lat": parseFloat(cord_data['coordinates'][1]['globalRef']['lat']), "lon": parseFloat(cord_data['coordinates'][1]['globalRef']['lng']), localx: parseFloat(cord_data['coordinates'][1]['localRef']['lng']) ,localy: parseFloat(cord_data['coordinates'][1]['localRef']['lat']) } 
  coords[2] = { "lat": parseFloat(cord_data['coordinates'][0]['globalRef']['lat']), "lon": parseFloat(cord_data['coordinates'][0]['globalRef']['lng']), localx: parseFloat(cord_data['coordinates'][0]['localRef']['lng']) ,localy: parseFloat(cord_data['coordinates'][0]['localRef']['lat']) } 
  coords[3] = { "lat": parseFloat(cord_data['coordinates'][3]['globalRef']['lat']), "lon": parseFloat(cord_data['coordinates'][3]['globalRef']['lng']), localx: parseFloat(cord_data['coordinates'][3]['localRef']['lng']) ,localy: parseFloat(cord_data['coordinates'][3]['localRef']['lat']) } 
  console.log("done");
  callbackFn();
}

//Helper function for Distance(in m) between global points
function runmainfunction(){

 const getHaversineDistance = (firstLocation, secondLocation) => {
      const earthRadius = 6371; // km //6378137; //m
      const diffLat = (secondLocation.lat-firstLocation.lat) * Math.PI / 180;  
      const difflon = (secondLocation.lon-firstLocation.lon) * Math.PI / 180;  
      const arc = Math.cos(
                      firstLocation.lat * Math.PI / 180) * Math.cos(secondLocation.lat * Math.PI / 180) 
                      * Math.sin(difflon/2) * Math.sin(difflon/2)
                      + Math.sin(diffLat/2) * Math.sin(diffLat/2);
      const line = 2 * Math.atan2(Math.sqrt(arc), Math.sqrt(1-arc));
      const distance = earthRadius * line*1000; 
      return distance;
  }
  
  //calculates Gcoordinates with given vertical and horizontal distance (should be in meters) from a refrence point
 const obtaincoordinates = (reference,vertical,horizontal) => {
       const R=6378137;  //Earth’s radius, sphere
       //Coordinate offsets in radians
       var dLat = vertical/R ;                     
       var dLon = horizontal/(R*Math.cos(Math.PI*(reference.lat)/180)) ;   
       //OffsetPosition, decimal degrees
       let latA = reference.lat + dLat * 180/Math.PI ;
       let lonA = reference.lon + dLon * 180/Math.PI;
       return {lat: latA , lon: lonA};
  }
  
  //helper function for distance between two points in local coordinates
  const distance = (first,second) => {
       var dist = ((second.localy -first.localy)**2) + (second.localx -first.localx)**2;
       return Math.sqrt(dist) ;
  }
  
  
  
  //finding the point with lowest latitude and highest longitude
  var least_lat = 0;
  for (let i = 0; i < coords.length; i++) {
    if (coords[i].lat == coords[least_lat].lat) { //handling two points with equal lat
      if (coords[i].lon > coords[least_lat].lon) { least_lat = i; }
    }
    else if (coords[i].lat < coords[least_lat].lat) { least_lat = i; }
  }
  //evaluating high_lon
  var c1 = (least_lat == 3) ? 0 : (least_lat + 1)
  var c2 = (least_lat == 0) ? 3 : (least_lat - 1)
  var high_lon = (coords[c1].lon > coords[c2].lon) ? c1 : c2
  
  // console.log(least_lat,high_lon," heyy ");
  
  ///lengths between given 4 global co-ordinates
  var lengths = []
  for (let i = 0; i < coords.length; i++) {
    var temp1;
    if (i == coords.length - 1) { temp1 = getHaversineDistance(coords[i], coords[0]); }
    else { temp1 = getHaversineDistance(coords[i], coords[i + 1]); }
    // console.log(temp1*3.28084); //uncomment to print
    lengths.push(temp1);
  } 
  
  // building angle with equator or true horizontal
  var b = getHaversineDistance(coords[least_lat], coords[high_lon])
  const horizontal = obtaincoordinates(coords[least_lat], 0, b)
  var c = getHaversineDistance(coords[least_lat], horizontal);
  var a = getHaversineDistance(coords[high_lon], horizontal);
  var out = Math.acos((b * b + c * c - a * a) / (2 * b * c)) * 180 / Math.PI;
  // console.log(a,b,c,horizontal);
  console.log("Angle of building is " + out);
  
  // Vertical alignment or lift correction
  var diff = []; //array to store offset of each floor
  var ground_lift = red_data.filter((x) => { return ((x.element.subType == 'lift') && (x.floor == 'ground')); });
  if (ground_lift.length != 0) {
    var nth_lift = 0 //loop to find which lift is across more floors
    for (let i = 0; i < ground_lift.length; i++) {
      var temp = red_data.filter((x) => { return ((x.element.subType == 'lift') && (x.properties.name == ground_lift[i].properties.name)); });
      if (temp.length >= red_data.filter((x) => { return ((x.element.subType == 'lift') && (x.properties.name == ground_lift[nth_lift].properties.name)); }).length) {
        nth_lift = i
      }
    }
    // console.log(nth_lift, ground_lift[nth_lift].properties.name)
    var lifts = red_data.filter((x) => { return ((x.element.subType == 'lift') && (x.properties.name == ground_lift[nth_lift].properties.name)); });
    for (let i = 0; i < lifts.length; i++) {
      var temp = {};
      temp.x = lifts[i].coordinateX - ground_lift[nth_lift].coordinateX
      temp.y = lifts[i].coordinateY - ground_lift[nth_lift].coordinateY
      temp.floor = lifts[i].floor
      diff.push(temp)
    }
    //  console.log(diff)
  }
  
  // loop to calculate all the coordinates of local points
  var local_coords = {"localx": 0 ,"localy":0 } 
  for( let i=0; i<red_data.length;i++ ){     
    if (diff.length > 1) { //vertical correction across floors
      var test = diff.filter((x) => { return ((x.floor == red_data[i].floor)); });
      local_coords.localx = red_data[i].coordinateX - test[0].x
      local_coords.localy = red_data[i].coordinateY - test[0].y
    }
    else {
      local_coords.localx = (red_data[i].coordinateX);
      local_coords.localy = (red_data[i].coordinateY);
    }
    var l = distance(coords[least_lat], coords[high_lon]);
    var m = distance(local_coords, coords[high_lon]);
    var n = distance(coords[least_lat], local_coords);
    var theta = Math.acos((l * l + n * n - m * m) / (2 * l * n)) * 180 / Math.PI;
    if ((((l * l + n * n - m * m) / (2 * l * n)) > 1) || m == 0 || n == 0) { theta = 0; } //staright line case
    let ang = theta + out;

    var dist = distance(coords[least_lat], local_coords) * 0.3048; //to convert to meter
    var ver = dist * Math.sin(ang * Math.PI / 180.0);
    var hor = dist * Math.cos(ang * Math.PI / 180.0);

    var final = obtaincoordinates(coords[least_lat], ver, hor);

    red_data[i].properties.latitude = final.lat;
    red_data[i].properties.longitude = final.lon;
  }
  
  //converting to geoJSON format
  let geoJSON = {
    "type": "FeatureCollection",
    "features": []
  };
  for (let i = 0; i < red_data.length; i++) {
    var p = red_data[i];
    if (p.name == "") { //to deal with empty name field
      p.name = p.properties.name;
    }
    geoJSON.features.push({
      "type": "Feature",
      "properties": {
        "name": p.name,
        "floor": p.floor,
        "type": p.element.subType,
        "floorElement": p.element.type,
        "localx": p.coordinateX,
        "localy": p.coordinateY,
        ...p.properties
      },
      "geometry": {
        "type": "Point",
        "coordinates": [p.properties.longitude, p.properties.latitude]
      }
    })
  }
  
  ///// nonWalkableGrids Calculations
  var local_coords = {"localx": 0 ,"localy":0 } 
  for(let k =0 ; k<poly_data.length  ; k++){
    var temp2 = []
    var floor_length = poly_data[k].properties.floorLength;
    for(let j=0; j<poly_data[k].properties.clickedPoints.length; j++){
      var line = poly_data[k].properties.clickedPoints[j]
      var numbers = line.split(',').map(Number);
      var temp1 = []
      for( let i=0; i<numbers.length;i++ ){    
          local_coords.localx = (numbers[i]%floor_length);
          local_coords.localy = (numbers[i]/floor_length);
  
          //for vertical allignment across floors
          if(diff.length >1){
            var test = diff.filter((x) => {return ((x.floor == poly_data[k].floor)); });
            local_coords.localx = local_coords.localx - test[0].x
            local_coords.localy = local_coords.localy - test[0].y
          }
  
          var l = distance(coords[least_lat],coords[high_lon]);
          var m = distance(local_coords,coords[high_lon]);
          var n = distance(coords[least_lat],local_coords);
          var theta = Math.acos((l*l+n*n-m*m)/(2*l*n))*180/Math.PI;
          if((((l*l+n*n-m*m)/(2*l*n)) > 1) || m==0 ||n==0){ theta =0;} //staright line case
  
         let ang = theta +out;
          var dist = distance(coords[least_lat],local_coords)*0.3048; //to convert to meter   
          var ver = dist* Math.sin(ang* Math.PI/180.0);
          var hor = dist* Math.cos(ang* Math.PI/180.0);
  
          var final = obtaincoordinates(coords[least_lat],ver,hor);
          var temp = []
          temp.push(final.lon,final.lat)
          temp1.push(temp)
      }
      temp2.push(temp1)
    }
    poly_data[k]["global"] = temp2;
  }
  
  //converting to geoJSON format
  let geoJSON_poly = {
    "type": "FeatureCollection",
    "features": []
  };
  for (let j = 0; j < poly_data.length; j++) {
    for (let i = 0; i < poly_data[j].global.length; i++) {
      geoJSON_poly.features.push({
        "type": "Feature",
        "properties": {
          "floor": poly_data[j].floor,
        },
        "geometry": {
          "type": "LineString",
          "coordinates": poly_data[j].global[i]
        }
      })
    }
  }

  myJSON=geoJSON;
  myJSON_poly=geoJSON_poly;
  setGlobalCoords(poly_data)
  setLandmarks(data)
  //console.log(poly_data)
  //get_data();  
  //console.log("DONE");  
}


function start(){
  getcoord(runmainfunction);
}

// reference points for the building are read from the api and calls start function
function get_reference_points(){
  let reference_url=`https://inclunav.apps.iitd.ac.in/node/wayfinding/v1/global-ref/${venue_name}/${building_name}/ground`;
  var settings1 = {
    "url": reference_url,
    "method": "GET",
    "timeout": 0,
  };
  $.ajax(settings1).done(function (response) {
    cord_data=response;
    start();
  });
}

// center for rooms are calculated and the room coordinates are changed to its center
function calculate_center(d,flength,i,l){
  if(i==l){
    get_reference_points();
    return;
  }
  for(let i=0;i<d.length;i++){
    if(d[i].polygonType=="Room"){
      var nodes_line=d[i].nodes;
      var numbers = [...new Set(nodes_line.split(',').map(Number))];
      var x=0;
      var y=0;
      for(let j=0;j<numbers.length;j++){
        x=x+(numbers[j]/flength)>>0;
        y=y+(numbers[j]%flength);
      }
      x=x/numbers.length;
      y=y/numbers.length;
      // console.log(numbers);
      // console.log(x,y);
      for(let j=0;j<red_data.length;j++){
        if(red_data[j].name==d[i].name){
          // console.log("same");
          red_data[j].coordinateX=y;
          red_data[j].coordinateY=x;
        }
      }
    }
  }
}

// polygon data is read from api and calls calculate_center function
function getpolygondata(){
  //do calculations
  floors = [...new Set(data.map(s => s.floor))]
  //extract the floors
  //polygon data or nonwalkables of all floors
  poly_data = data.slice(data.length - floors.length,data.length);
  //console.log(poly_data)
  
  //reduced data without non walkables
  red_data = data.slice(0, data.length - floors.length);
  // console.log(floors);
  const fdata=poly_data.map(s=>s.floor)
  const ldata=poly_data.map(s=>s.properties.floorLength)
  
  for(let i=0;i<=floors.length;i++){
    let polygon_url=`https://inclunav.apps.iitd.ac.in/node/wayfinding/v1/all-polygons/${venue_name}/${building_name}/${fdata[i]}`;
    // console.log(polygon_url);
    var settings1 = {
      "url": polygon_url,
      "method": "GET",
      "timeout": 0,
    };
    $.ajax(settings1).done(function (response) {
      // console.log(response);
      calculate_center(response,ldata[i],i,floors.length);    
    });
  }
}

// building data is read from api and calls for getpolygondata function
function getbuildingdata(){
  // console.log(buildingslist);
  // console.log(buildingslist.length);
  let building_url=`https://inclunav.apps.iitd.ac.in/node/wayfinding/v1/app/android-navigation/${venue_name}/${building_name}/null`
  //console.log('polygon here')
  console.log(building_url);
  var settings1 = {
    "url": building_url,
    "method": "GET",
    "timeout": 0,
  };
  $.ajax(settings1).done(function (response) {
    //console.log(response);
    data=response;
    getpolygondata();        
  });
}


getbuildingdata()

}

