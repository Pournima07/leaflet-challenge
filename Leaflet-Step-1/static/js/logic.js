// url with 2.5 mag earthquake data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson?$limit=1000";

function chooseColor(mag) {

    if ( mag < 3.5 ){
        color = "yellow";
    } else if (mag < 4.5) {
        color ="blue";
    } else if (mag <= 5.5){
        color = "purple";
    } else {
        color ="red";
    }

    console.log("Mag " + mag + " Color " + color);    
    return color;
}

function chooseSize(mag) {
    return mag * 2;
}

var grayscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 13,
    id: "mapbox.light",
    accessToken: API_KEY
  });

var outdoors   = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 13,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });

var satellite   = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 13,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

var baseMaps = {
    "Grayscale": grayscale,
    "Outdoors": outdoors,
    "Satellite": satellite
};

// Create empty layers.
var earthquakes = L.layerGroup([]);
// var faultlines = L.layerGroup([]);

var overlayMaps = {
    "Earthquakes": earthquakes //,
    // "Faultlines": faultlines   
};

var map = L.map('map', {
    center: [0, 0],
    zoom: 2,
    layers: [grayscale, earthquakes]
});

L.control.layers(baseMaps, overlayMaps).addTo(map);

// Adding tile Layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 13,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(map);

d3.json (url, function (data) {
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: chooseSize(feature.properties.mag),
                fillColor: chooseColor(feature.properties.mag),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
                }).bindPopup("<h4> Gap: " + feature.properties.gap + "</h4><hr><h3> Place:" + feature.properties.place + "</h3>" );
        },
        onEachFeature : function (feature, layer) {
            console.log("Inside onEachFeature()");
            earthquakes.addLayer(layer);
        }
    });

     function getColor(magc) {
        color = magc == 'Mag< 3.5' ? 'yellow' :
            magc == 'Mag< 4.5'  ? 'blue' :
            magc == 'Mag <= 5.5' ? 'purple' :
                'red';
        console.log('getColor <' + magc + '> - [' + color + ']');
        return color;
    }

    // Add Legend
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        labels = ['<strong>Categories</strong>'],
        categories = ['Mag< 3.5', 'Mag< 4.5', 'Mag <= 5.5', 'Mag > 5.5'];
        
        for (var i = 0; i < categories.length; i++) {    
            div.innerHTML += 
            labels.push(
                '<font style="background:' + getColor(categories[i]) + '">____ </font> ' +                
                ' <b> ' + categories[i] + ' </b> ' 
                );
        }
        div.innerHTML = labels.join('<br>');
        return div;
    };
    legend.addTo(map);    
 
});
 
