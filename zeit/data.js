$(document).ready(function() {
    // Graph with measurement values
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 10, bottom: 50, left: 50},
        width = 1140 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // define the line
    var valueline = d3.line()
        .x(function(d) { return x(d.time); })
        .y(function(d) { return y(d.value); });

    var svg = d3.select("#measurement")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.json("/api", function(err, json) {
        if (err) throw err;

        function prepareData(json, key) {
            data = json["data"][key];
            data.forEach(element => {
                element.time = d3.isoParse(element.time);
                element.value = parseInt(element.value);
            });
            return data;
        }

        function drawData(data, type) {
            x.domain(d3.extent(data, function(d) { return d.time; }));
            y.domain([0, d3.max(data, function(d) { return d.value; })]);
            svg.append("path")
                .data([data])
                .attr("class", "line " + type) // Add both classes here for styling
                .attr("d", valueline);
        }
        function drawAxis() {
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));
            svg.append("g")
                .call(d3.axisLeft(y));
        }
        function drawLegend(measurement, margin) {
            var topMargin = (margin === undefined) ? 0 : margin
            svg.append("circle").attr("cx", 30).attr("cy", topMargin).attr("r", 6).attr("class", measurement+"Fill")
            svg.append("text").attr("x", 50).attr("y", topMargin).text(measurement).style("font-size", "15px").attr("alignment-baseline","middle")
        }

        drawAxis();
        var temperature = prepareData(json, "temperature");
        drawData(temperature, "temperature");
        drawLegend("temperature");
        var visibility = prepareData(json, "visibility");
        drawData(visibility, "visibility");
        drawLegend("visibility", 20);
    });
});
