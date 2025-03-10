document.addEventListener("DOMContentLoaded", function () {
    d3.csv("../assets/data/2022_LoL_esports_match_data_from_OraclesElixir.csv").then(function (data) {
        // Ensure only complete data
        data = data.filter(d => d.datacompleteness === "complete");

        // Aggregate champion picks and win rates
        let championStats = d3.rollup(data,
            v => d3.mean(v, d => +d.result),
            d => d.champion
        );

        console.log("Data loading correctly");

        let chartData = Array.from(championStats, ([champion, winRate]) => ({ champion, winRate }));
        let champions = chartData.map(d => d.champion).sort();

        // Populate dropdown
        let select = d3.select("#championSelect");
        champions.forEach(champion => {
            select.append("option").text(champion).attr("value", champion);
        });

        console.log("Selection/dropdown menu is working");

        let margin = { top: 50, right: 30, bottom: 100, left: 60 };
        let baseWidth = 900, height = 500;

        let svg = d3.select("#championChart")
            .append("svg")
            .attr("width", baseWidth)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        let x = d3.scaleBand()
            .range([0, baseWidth - margin.left - margin.right])
            .padding(0.4);

        let y = d3.scaleLinear()
            .domain([0, 1])
            .range([height - margin.top - margin.bottom, 0]);

        let color = d3.scaleOrdinal(d3.schemeCategory10);

        console.log("Chart setup successfully");

        function updateChart(selectedChampions) {
            svg.selectAll("*").remove(); // Clear existing chart

            let filteredData = chartData.filter(d => selectedChampions.includes(d.champion));

            // Adjust width dynamically for better readability
            let newWidth = Math.max(baseWidth, filteredData.length * 30);
            d3.select("#championChart svg").attr("width", newWidth);

            x.domain(filteredData.map(d => d.champion))
             .range([0, newWidth - margin.left - margin.right]);

            // X-axis
            svg.append("g")
                .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "rotate(-45)")
                .style("text-anchor", "end")
                .style("font-size", "12px");

            // Y-axis
            svg.append("g")
                .call(d3.axisLeft(y).tickFormat(d3.format(".0%")));

            // Bars
            svg.selectAll(".bar")
                .data(filteredData)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", d => x(d.champion))
                .attr("y", d => y(d.winRate))
                .attr("width", x.bandwidth())
                .attr("height", d => height - margin.top - margin.bottom - y(d.winRate))
                .attr("fill", d => color(d.champion))
                .append("title") // Tooltip
                .text(d => `${d.champion}: ${d3.format(".2%")(d.winRate)}`);
        }

        console.log("Default options given");
        updateChart(champions); // Initial full data load

        d3.select("#championSelect").on("change", function () {
            let selected = Array.from(this.selectedOptions).map(d => d.value);
            updateChart(selected.length ? selected : champions);
        });

        d3.select("#resetSelection").on("click", function () {
            d3.select("#championSelect").selectAll("option").property("selected", false);
            updateChart(champions);
        });

    }).catch(error => console.error("Error loading CSV:", error));
});
