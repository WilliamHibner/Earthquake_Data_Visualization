/*Create a map using Leaflet that plots all of the earthquakes from your data set based on their longitude and latitude.

   * Your data markers should reflect the magnitude of the earthquake in their size and color. 
     Earthquakes with higher magnitudes should appear larger and darker in color.

   * Include popups that provide additional information about the earthquake when a marker is clicked.

   * Create a legend that will provide context for your map data.

   * Your visualization should look something like the map above.


   * to run this application run python -m http.server 
        -> make sure you open the terminal at the location the index.html file is located
   
   */

// We need to ccreate the map object and tell it it what level to zoom for the default view 


var map = L.map("map", {
    center: [ 40.7, -94.5],
    zoom: 3
  });
  

// Then send the api request 
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(map);



d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {

        console.log(data.features);
        createFeatures(data.features);

              
});


/** We can start by putting data on the map 
 * 
 *   Step 1: put the data on the map. 
 *        1.1 Since we are using geoJson data we need to use the L.geoJson function to plot the data on the map
 *        1.2 Resources -- https://leafletjs.com/reference-1.3.4.html#geojson
 * 
 *  *   Step 2: We can use the options in the GeoJson file to color our map 
 *        2.1: We need to color the map based on the Earthquake Manitude
 */
//function plotData(data){

  // step 1.1 + 1.2 goes here
  //createFeatures(data.features);
//};

function createFeatures(earthquakeData) {
    // var earthquakeData=usgs_data.features;
    //var platesData=plates.features;

    //Initialize Earthquakes
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
      
      //console.log(feature);
    }

    function getColor(magnitude) {
      if (magnitude<=1){v_fillcolor="lightgreen";}
      if (magnitude>1 && magnitude<=2){v_fillcolor="green";}
      if (magnitude>2 && magnitude<=3){v_fillcolor="lightblue";}
      if (magnitude>3 && magnitude<=4){v_fillcolor="blue";}
      if (magnitude>4 && magnitude<=5){v_fillcolor="purple";}
      if (magnitude>5){v_fillcolor="red";}
      return v_fillcolor;
    }

    function markeropt(feature){
        // if (feature.properties.mag<=1){v_fillcolor="lightgreen";}
        // if (feature.properties.mag>1 && feature.properties.mag<=2){v_fillcolor="green";}
        // if (feature.properties.mag>2 && feature.properties.mag<=3){v_fillcolor="lightblue";}
        // if (feature.properties.mag>3 && feature.properties.mag<=4){v_fillcolor="blue";}
        // if (feature.properties.mag>4 && feature.properties.mag<=5){v_fillcolor="purple";}
        // if (feature.properties.mag.mag>5){v_fillcolor="red";}
        var v_fillcolor = getColor(feature.properties.mag); 

        var geojsonMarkerOptions = {
            radius: feature.properties.mag*3,
            fillColor: v_fillcolor,
            color: "#000",
            weight: .5,
            opacity: 1,
            fillOpacity: 0.8
        };
        return geojsonMarkerOptions;
    }

    var earthquakes = L.geoJSON(earthquakeData, 
    {        
        onEachFeature: onEachFeature,
        style: markeropt,
        pointToLayer: function (feature, latlng) {return L.circleMarker(latlng, markeropt(feature));}
    }).addTo(map);
    var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 1, 2, 3, 4, 5],
    labels = [];

for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
        '<i style="background:' + 
        getColor(grades[i] + 1)
         + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
 }

 return div;
 };

 legend.addTo(map);
  
}