document.addEventListener("DOMContentLoaded", function () {
    d3.csv("../data/2022_LoL_esports_match_data_from_OraclesElixir.csv").then(function (data) {
        // Filter complete matches
        data = data.filter(d => d.datacompleteness === "complete");

        // Aggregate win rates by region
        let winRates = d3.rollup(data, 
            v => d3.mean(v, d => +d.result), 
            d => d.league
        );

        let chartData = Array.from(winRates, ([league, winRate]) => ({ league, winRate }));

        let width = 800, height = 400;
        let svg = d3.select("#winRateChart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        let x = d3.scaleBand()
            .domain(chartData.map(d => d.league))
            .range([50, width - 50])
            .padding(0.4);

        let y = d3.scaleLinear()
            .domain([0, 1])
            .range([height - 50, 50]);

        svg.append("g")
            .attr("transform", `translate(0,${height - 50})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .attr("transform", `translate(50,0)`)
            .call(d3.axisLeft(y).tickFormat(d3.format(".0%")));

        svg.selectAll(".bar")
            .data(chartData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.league))
            .attr("y", d => y(d.winRate))
            .attr("width", x.bandwidth())
            .attr("height", d => height - 50 - y(d.winRate))
            .attr("fill", "#3CB371");
    });
});
