import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
document.addEventListener("DOMContentLoaded", function () {
    d3.csv("../data/2022_LoL_esports_match_data_from_OraclesElixir.csv").then(function (data) {
        // Prepare the dataset
        data = data.filter(d => d.datacompleteness === "complete");

        let chartData = data.map(d => ({
            firstDragon: +d.firstdragon,
            firstBaron: +d.firstbaron,
            result: +d.result
        }));

        let width = 800, height = 400;
        let svg = d3.select("#objectiveChart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        let x = d3.scaleLinear().domain([0, 1]).range([50, width - 50]);
        let y = d3.scaleLinear().domain([0, 1]).range([height - 50, 50]);

        svg.selectAll("circle")
            .data(chartData)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.firstDragon))
            .attr("cy", d => y(d.result))
            .attr("r", 5)
            .attr("fill", d => d.firstBaron ? "#FF5733" : "#3498db");
    });
});
