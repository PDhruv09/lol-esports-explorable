document.addEventListener("DOMContentLoaded", function () {
    d3.csv("../data/2022_LoL_esports_match_data_from_OraclesElixir.csv").then(function (data) {
        let gameDurations = data.map(d => +d.gamelength).filter(d => !isNaN(d));

        let width = 800, height = 400;
        let svg = d3.select("#gameDurationChart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        let x = d3.scaleLinear().domain([0, d3.max(gameDurations)]).range([50, width - 50]);
        let histogram = d3.histogram().domain(x.domain()).thresholds(x.ticks(20))(gameDurations);

        let y = d3.scaleLinear().domain([0, d3.max(histogram, d => d.length)]).range([height - 50, 50]);

        svg.append("g").attr("transform", `translate(0,${height - 50})`).call(d3.axisBottom(x));
        svg.append("g").attr("transform", `translate(50,0)`).call(d3.axisLeft(y));

        svg.selectAll("rect")
            .data(histogram)
            .enter()
            .append("rect")
            .attr("x", d => x(d.x0))
            .attr("y", d => y(d.length))
            .attr("width", d => x(d.x1) - x(d.x0) - 2)
            .attr("height", d => height - 50 - y(d.length))
            .attr("fill", "#3CB371");
    }).catch(error => console.error("Error loading CSV:", error));
});
