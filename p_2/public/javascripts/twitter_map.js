var plot = function(data) {
  console.log(data);
  var coords_trans = new Array(data.length);
  
  for(var i=0; i<coords_trans.length; i++) {
    coords_trans[i] = {};
    var coords = xy([data[i].lon, data[i].lat]);
    coords_trans[i].x = coords[0];
    coords_trans[i].y = coords[1];
    coords_trans[i].text = data[i].text;
    coords_trans[i].time = data[i].time;
    coords_trans[i].lon = data[i].lon;
    coords_trans[i].lat = data[i].lat;
  }
  
  
    d3.select("svg").append("g").attr("id", "tweets").selectAll(".dot")
      .data(coords_trans)
      .enter()
    .append("svg:circle")
      .attr("class","dot")
      .attr("cx", function(d){return d.x;})
      .attr("cy", function(d){return d.y;})
      .attr("r", 5);
    
    //interaction
    $('svg circle').tipsy({
    gravity: 'w', 
    html: true, 
    title: function() {
      var d = this.__data__;
      return "<p>"+d.text+"</p><p>"+d.time+"</p><p>"+d.lon+" | "+d.lat+"</p>"; 
    }
  });

}


var refresh = function() {
  
  d3.selectAll("#states path")
      .attr("d", path);
  d3.select("#parallels span")
      .text(xy.parallels());
  d3.select("#lon span")
      .text(xy.origin()[0]);
  d3.select("#lat span")
      .text(xy.origin()[1]);
  d3.select("#scale span")
      .text(xy.scale());
  d3.select("#translate-x span")
      .text(xy.translate()[0]);
  d3.select("#translate-y span")
      .text(xy.translate()[1]);
}

console.log('Drawing map...');

//execution
//projection.
var xy = d3.geo.albers(),
    path = d3.geo.path().projection(xy),
    lon_nyc = -74.0064,
    lat_nyc =  40.7142,
    scale_nyc = 250000,
    translate_x = 100,
    translate_y = 550;
    
//scale
xy.scale(scale_nyc);
//translate
xy.translate()[0] = translate_x;
xy.translate()[1] = translate_y;
//origin
var my_origin = [lon_nyc, lat_nyc];
xy.origin(my_origin);

console.log('Loading svg...');
d3.select("body")
  .append("svg")
  .append("g")
    .attr("id", "states");

d3.json("/data/nyct2010.json", function(collection) {
  d3.select("#states")
    .selectAll("path")
      .data(collection.features)
    .enter().append("path")
      .attr("d", path);

  refresh();

  //d3.json("data/tweets2.json", function(data) {plot(data);});
});
