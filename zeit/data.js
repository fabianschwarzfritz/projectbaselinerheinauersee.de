$(document).ready(function() {
    // Graph with measurement values
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 50, bottom: 50, left: 50},
        width = 1140 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var yTemperature = d3.scaleLinear().range([height, 0]);
    var yVisibility = d3.scaleLinear().range([height, 0]);

    // The value line
    var valuelineTemperature = d3.line()
            .x(function(d) { return x(d.time); })
            .y(function(d) { return yTemperature(d.value); });
    // The value line
    var valuelineVisibility = d3.line()
            .x(function(d) { return x(d.time); })
            .y(function(d) { return yVisibility(d.value); });

    var svg = d3.select("#measurement")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.json("/api", function(err, json) {
        if (err) throw err;

        dataTemperature = json["data"]["temperature"];
        dataTemperature.forEach(element => {
            element.time = d3.isoParse(element.time);
            element.value = parseInt(element.value);
        });
        x.domain(d3.extent(dataTemperature, function(d) { return d.time; }));
        yTemperature.domain([0, 2 + d3.max(dataTemperature, function(d) { return d.value; })]);
        svg.append("path")
            .data([dataTemperature])
            .attr("class", "line temperature")
            .attr("d", valuelineTemperature);
        svg.append("g")
            .call(d3.axisLeft(yTemperature));
        svg.append("circle").attr("cx", 40).attr("cy", 20).attr("r", 6).attr("class", "temperatureFill")
        svg.append("text").attr("x", 50).attr("y", 20).text("Temperature (C)").style("font-size", "15px").attr("alignment-baseline", "middle")
        svg.append("text").attr("transform", "translate(0,  "  + (height/2) + ")").style("text-anchor", "middle").text("Temperature");

        dataVisibility = json["data"]["visibility"];
        dataVisibility.forEach(element => {
            element.time = d3.isoParse(element.time);
            element.value = parseInt(element.value);
        });
        x.domain(d3.extent(dataVisibility, function(d) { return d.time; }));
        yVisibility.domain([0, 1 + d3.max(dataVisibility, function(d) { return d.value})]);
        svg.append("path")
            .data([dataVisibility])
            .attr("class", "line visibility")
            .attr("d", valuelineVisibility);
        svg.append("g")
            .attr("transform", "translate( " + width + ", 0 )") // Move the line to the right side.
            .call(d3.axisRight(yVisibility));
        svg.append("circle").attr("cx", 40).attr("cy", 50).attr("r", 6).attr("class", "visibilityFill")
        svg.append("text").attr("x", 50).attr("y", 50).text("Visibility (C)").style("font-size", "15px").attr("alignment-baseline", "middle")
        svg.append("text").attr("transform", "translate(" + (width) + " ,  "  + (height/2) + ")").style("text-anchor", "middle").text("Visibility");

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y %m %d")));
        svg.append("text").attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")").style("text-anchor", "middle").text("Date");


    });
});
