document.addEventListener("DOMContentLoaded", function () {
    d3.csv("/data/2022_LoL_esports_match_data_from_OraclesElixir.csv").then(function (data) {
        let chartData = data.map(d => ({
            golddiffat25: +d.golddiffat25,
            result: +d.result
        }));

        let width = 800, height = 400;
        let svg = d3.select("#goldAdvantageChart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        let x = d3.scaleLinear().domain([-10000, 10000]).range([50, width - 50]);
        let y = d3.scaleLinear().domain([0, 1]).range([height - 50, 50]);

        svg.append("g").attr("transform", `translate(0,${height - 50})`).call(d3.axisBottom(x));
        svg.append("g").attr("transform", `translate(50,0)`).call(d3.axisLeft(y));

        svg.selectAll("circle")
            .data(chartData)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.golddiffat25))
            .attr("cy", d => y(d.result))
            .attr("r", 5)
            .attr("fill", d => d.golddiffat25 > 0 ? "#3CB371" : "#DC143C");

    }).catch(error => console.error("Error loading CSV:", error));
});
