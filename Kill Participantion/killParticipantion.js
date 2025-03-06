document.addEventListener("DOMContentLoaded", function () {
    d3.csv("lol-esports-explorable/assets/data/2022_LoL_esports_match_data_from_OraclesElixir.csv").then(function (data) {
        let chartData = data.map(d => ({
            killParticipation: (+d.killsat25 + +d.assistsat25) / Math.max(1, (+d.killsat25 + +d.assistsat25 + +d.deathsat25)),
            result: +d.result
        })).filter(d => !isNaN(d.killParticipation));

        let width = 800, height = 400;
        let svg = d3.select("#killParticipationChart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        let x = d3.scaleLinear().domain([0, 1]).range([50, width - 50]);
        let y = d3.scaleLinear().domain([0, 1]).range([height - 50, 50]);

        svg.append("g").attr("transform", `translate(0,${height - 50})`).call(d3.axisBottom(x).tickFormat(d3.format(".0%")));
        svg.append("g").attr("transform", `translate(50,0)`).call(d3.axisLeft(y).tickFormat(d3.format(".0%")));

        svg.selectAll("circle")
            .data(chartData)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.killParticipation))
            .attr("cy", d => y(d.result))
            .attr("r", 5)
            .attr("fill", d => d.result ? "#3CB371" : "#DC143C");

    }).catch(error => console.error("Error loading CSV:", error));
});
