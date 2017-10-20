

$.ajax({
    url: "https://d3js.org/world-110m.v1.json",
    type: 'GET',
    dataType: 'json',
    success: function(data) {

        $.ajax({
            url: "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json",
            type: 'GET',
            dataType: 'json',
            success: function(locations) {

                ///set margins
                var margin = {top: 0, right: 0, bottom: 0, left:0};
                var height = 550 - margin.top - margin.bottom;
                var width = 1000 - margin.right - margin.left;

                //project globe to flat screen
                var projection = d3.geoMercator()
                    .translate([width /2, height/2])
                    .scale(165);

                //create a path (geoPath) using the projection
                var path = d3.geoPath()
                    .projection(projection);


                //canvas
                var svg = d3.select("#map")
                    .append('svg')
                    .attr("width", "100%")
                    .attr("height", "100%")
                    //.append('g')
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .call(d3.zoom().on("zoom", function () {
                        map.attr("transform", d3.event.transform);
                        points.attr("transform", d3.event.transform);
                    }));

                var countries = topojson.feature(data, data.objects.countries).features;

                var tooltip = d3.select("body")
                    .append("div")
                    .attr("class", "tooltip")
                    .style("position", "absolute")
                    .style("z-index", "10")
                    .style("visibility", "hidden")
                    .html('ok');

                /*add a path for each country */
                var map = svg.selectAll(".country")
                    .data(countries)
                    .enter().append("path")
                    .attr("class", "country")
                    .attr("d", path);

                //add the meteorite landings
                var points = svg.selectAll("circle")
                    .data(locations.features)
                    .enter().append("circle")
                    .attr("r", function(d) {
                        switch(true) {
                            case (d.properties.mass > 10000000): return 30;
                                break;
                            case (d.properties.mass > 1000000): return 20;
                                break;
                            case (d.properties.mass > 500000): return 10;
                                break;
                            case (d.properties.mass > 250000): return 7;
                                break;
                            case (d.properties.mass > 100000): return 4;
                                break;
                            case (d.properties.mass > 10000): return 4;
                                break;
                            case (d.properties.mass > 1000): return 2;
                                break;
                            default: return 1;
                        }
                    })
                    .attr("class", function(d) {
                        switch(true) {
                            case (d.properties.mass > 10000000): return "circles over10m";
                            break;
                            case (d.properties.mass > 1000000): return "circles over1m";
                                break;
                            case (d.properties.mass > 500000): return "circles over500k";
                                break;
                            case (d.properties.mass > 250000): return "circles 250k";
                                break;
                            case (d.properties.mass > 100000): return "circles over100k";
                                break;
                            case (d.properties.mass > 10000): return "circles over10k";
                                break;
                            case (d.properties.mass > 1000): return "circles over1k";
                                break;
                            default: return "circles under1k";
                        }
                    })
                    .attr("cx", function(d) {
                        var coords = projection([d.properties.reclong, d.properties.reclat]);
                        return coords[0];
                    })
                    .attr("cy", function(d) {
                        var coords = projection([d.properties.reclong, d.properties.reclat]);
                        return coords[1];
                    })
                    .on('mouseover', function(d) {
                        var year = d.properties.year.slice(0,4);
                        return tooltip
                        .html("<div class='toolText'> Name: " + d.properties.name + "<br> Mass: " +
                            d.properties.mass + "<br> Year: " + year + "</div>")
                        .style("visibility", "visible");})
                    .on("mousemove", function(){return tooltip.style("top",
                        (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
                    .on('mouseout', function() {return tooltip.style("visibility", "hidden");});



            },
            error: function() {
                alert('error');
            }
        });

    },
error: function() {
    alert('error');
}
});



