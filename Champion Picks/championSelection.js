document.addEventListener("DOMContentLoaded", function () {
    d3.csv("../assets/data/2022_LoL_esports_match_data_from_OraclesElixir.csv").then(function (data) {
        // Ensure only complete data
        data = data.filter(d => d.datacompleteness === "complete");

        // Aggregate champion picks and win rates
        let championStats = d3.rollup(data,
            v => d3.mean(v, d => +d.result),
            d => d.champion
        );
        console.log("data loading correctly")
        let chartData = Array.from(championStats, ([champion, winRate]) => ({ champion, winRate }));

        let champions = chartData.map(d => d.champion);

        // Populate dropdown
        let select = d3.select("#championSelect");
        champions.forEach(champion => {
            select.append("option").text(champion).attr("value", champion);
        });
        console.log("slection/dropdown menu is working")

        let width = 900, height = 500;
        let svg = d3.select("#championChart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        let x = d3.scaleBand()
            .domain(champions)
            .range([50, width - 50])
            .padding(0.4);

        let y = d3.scaleLinear()
            .domain([0, 1])
            .range([height - 50, 50]);

        let color = d3.scaleOrdinal(d3.schemeCategory10);
        console.log("char is created sucessfuly")
        function updateChart(selectedChampions) {
            svg.selectAll("*").remove(); // Clear existing chart

            let filteredData = chartData.filter(d => selectedChampions.includes(d.champion));

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
                .data(filteredData)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", d => x(d.champion))
                .attr("y", d => y(d.winRate))
                .attr("width", x.bandwidth())
                .attr("height", d => height - 50 - y(d.winRate))
                .attr("fill", d => color(d.champion))
                .append("title") // Tooltip
                .text(d => `${d.champion}: ${d3.format(".2%")(d.winRate)}`);
        }
        console.log("default opptions given")
        updateChart(champions); // Initial full data load

        d3.select("#championSelect").on("change", function () {
            let selected = Array.from(this.selectedOptions).map(d => d.value);
            updateChart(selected.length ? selected : champions);
        });

        d3.select("#resetSelection").on("click", function () {
            d3.select("#championSelect").property("value", "");
            updateChart(champions);
        });

    }).catch(error => console.error("Error loading CSV:", error));
});
