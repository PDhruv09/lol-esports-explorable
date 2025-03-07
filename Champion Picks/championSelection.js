document.addEventListener("DOMContentLoaded", function () {
    d3.csv("../assets/data/2022_LoL_esports_match_data_from_OraclesElixir.csv").then(function (data) {
        // Ensure only complete data
        data = data.filter(d => d.datacompleteness === "complete");

        // Aggregate champion picks and win rates
        let championStats = d3.rollup(data,
            v => d3.mean(v, d => +d.result),
            d => d.champion
        );

        let chartData = Array.from(championStats, ([champion, winRate]) => ({ champion, winRate }));

        let width = 900, height = 450;
        let svg = d3.select("#championChart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        let x = d3.scaleBand()
            .domain(chartData.map(d => d.champion))
            .range([50, width - 50])
            .padding(0.4);

        let y = d3.scaleLinear()
            .domain([0, 1])
            .range([height - 50, 50]);

        svg.append("g")
            .attr("transform", `translate(0,${height - 50})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        svg.append("g")
            .attr("transform", `translate(50,0)`)
            .call(d3.axisLeft(y).tickFormat(d3.format(".0%")));

        svg.selectAll(".bar")
            .data(chartData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.champion))
            .attr("y", d => y(d.winRate))
            .attr("width", x.bandwidth())
            .attr("height", d => height - 50 - y(d.winRate))
            .attr("fill", "#FF5733");

    }).catch(error => console.error("Error loading CSV:", error));
});
