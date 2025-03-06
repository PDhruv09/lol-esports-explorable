document.addEventListener("DOMContentLoaded", function () {
    d3.csv("/data/2022_LoL_esports_match_data_from_OraclesElixir.csv").then(function (data) {
        // Ensure only complete data
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

        svg.append("g").attr("transform", `translate(0,${height - 50})`).call(d3.axisBottom(x));
        svg.append("g").attr("transform", `translate(50,0)`).call(d3.axisLeft(y));

        svg.selectAll("circle")
            .data(chartData)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.firstDragon))
            .attr("cy", d => y(d.result))
            .attr("r", 5)
            .attr("fill", d => d.firstBaron ? "#FF5733" : "#3498db");

    }).catch(error => console.error("Error loading CSV:", error));
});
