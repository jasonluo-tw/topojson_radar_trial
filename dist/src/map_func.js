let map = L.map('predict-map');
map.setView([23.69108, 120.7798], 6);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    //attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors,   Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    //id: 'mapbox/streets-v11',
    id: 'mapbox/light-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiamFzb25sdW8iLCJhIjoiY2wycnAycnFyMDV2NTNkbnJiZ2s2cDZ2eCJ9.GrhXfnCmF3Mgsna8-8tBOA'
}).addTo(map)

// Define TopoJSON
L.TopoJSON = L.GeoJSON.extend({
    addData: function (data) {
        var geojson, key;
        if (data.type === "Topology") {
            for (key in data.objects) {
                if (data.objects.hasOwnProperty(key)) {
                    geojson = topojson.feature(data, data.objects[key]);
                    L.GeoJSON.prototype.addData.call(this, geojson);
                }
            }
            return this;
        }
        L.GeoJSON.prototype.addData.call(this, data);
        return this;
    }
});

L.topoJson = function (data, options) {
    return new L.TopoJSON(data, options);
};

function setStyle4CF(feature) {
    return {
        fillColor: feature.properties.fill,
        weight: 1,
        //opacity: feature.properties["stroke-opacity"],
        opacity: 0.5,
        color: feature.properties.stroke,
        //dashArray: '3',
        fillOpacity: feature.properties["fill-opacity"]
    }
}

// Change here
/*
var nn = 0
var shading_layer
for(let i=0; i<12; i++){
    let ft = moment("202205201940", "YYYYMMDDHHmm").add(10*(i+1), 'minutes').format("YYYYMMDDHHmm")
    setTimeout(() => {
        fetch(`./vis_data/202205201940/${ft}.topojson`)
        .then(response => response.json()).then(json => {
            if(nn > 0){
                shading_layer.clearLayers()
                shading_layer.addData(json, {
                    style: setStyle4CF
                })
            }else{
                shading_layer = L.topoJson(json, {style: setStyle4CF}).addTo(map)
            }
            nn += 1
            console.log(nn, json)
        })
    }, 1000*i)
}
*/