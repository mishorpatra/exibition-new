import sign from 'jwt-encode'
const secret = 'secret'

export const numToString = (n) => {
    if(n == 'ground') return 0
    else if(n == 'first') return 1
    else if(n == 'second') return 2
    else if(n == 'third') return 3
    else if(n == 'fourth') return 4
    else if(n == 'fifth') return 5
    else if(n == 'sixth') return 6
    else if(n == 'seventh') return 7
    else if(n == 'eighth') return 8
    else if(n == 'ninth') return 9
    else if(n == 'tenth') return 10
    else if(n == 'eleventh') return 11
    else if(n == 'twelvth') return 12
    else if(n == 'thirteenth') return 13
    else if(n == 'fourteenth') return 14
    else if(n == 'fifteenth') return 15
    else if(n == 'sixteenth') return 16
    else if(n == 'seventeenth') return 17
    else if(n == 'eighteenth') return 18
    else if(n == 'ninteenth') return 19
    else if(n == 'base1') return -1
}

export const stringToNum = (n) => {
    return n == 0 ? 'ground' : 
    n == 1 ? 'first' :
    n == 2 ? 'second': 
    n == 3 ? 'third' :
    n == 4 ? 'fourth' : 
    n == 5 ? 'fifth' : 
    n == 6 ? 'sixth' : 
    n == 7 ? 'seventh' : 
    n == 8 ? 'eighth' : 
    n == 9 ? 'nineth' :
    n == 10 ? 'tenth' :
    n == 11 ? 'eleventh' :
    n == 12 ? 'twelth' :
    n == 13 ? 'thirteenth' :
    n == 14 ? 'fourteenth' :
    n == 15 ? 'fifteenth' :
    n == 16 ? 'sixteenth' :
    n == 17 ? 'seventeenth' :
    n == 18 ? 'eighteenth' :
    n == 19 ? 'nineteenth' : null
}

export const camelToTitle = (text) => {
    const result = text.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
}

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }

export const findDistance = (lat1, lon1, lat2, lon2) => {
  var earthRadiusKm = 6371;

  var dLat = degreesToRadians(lat2-lat1);
  var dLon = degreesToRadians(lon2-lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return earthRadiusKm * c;
}

export const walkTime = (x) => {      //x is in kilometers
    var val = Math.round(12*x)
    if(val == 1) return `${val} min`
    if(val < 60) return `${val} min`                        //returned value is in miniutes
    if(val == 60) return `${val/60} hr`
    if(val > 1440) return `${Math.round(val/1440)} d ${Math.round((val%1440)/60)} h`
    if(val > 60 && val%60 == 0) return `${Math.round(val/60)} hr`        //returned value is in hours
    if(val > 60 && val%60 > 0) return `${Math.round(val/60)} hr ${val%60} min`   //returned value in hours and minute
}

export const getLink = (venue, building, landmark) => {
    const data = {
        venue: venue,
        building: building,
        landmark: landmark
    }
    //const jwt = sign(data, secret)
    return `https://inclunav.apps.iitd.ac.in/exibition-new/share?venue=${venue.venueName}&building=${building}&lmarkName=${landmark.name}&floor=${landmark.floor}&lat=${landmark.properties.latitude}&lng=${landmark.properties.longitude}`
}