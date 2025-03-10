document.addEventListener("DOMContentLoaded", function () {
    d3.csv("../assets/data/2022_LoL_esports_match_data_from_OraclesElixir.csv").then(function (data) {
        data = data.filter(d => d.datacompleteness === "complete");

        console.log("Data loaded successfully");

        // Get unique years & leagues
        let years = Array.from(new Set(data.map(d => d.year))).sort();
        let leagues = Array.from(new Set(data.map(d => d.league))).sort();

        // Populate the dropdown
        let yearSelect = d3.select("#yearSelect");
        years.forEach(year => {
            yearSelect.append("option").text(year).attr("value", year);
        });

        console.log("Year filter applied successfully");

        // Set dimensions
        let margin = { top: 50, right: 100, bottom: 80, left: 150 };
        let width = 900 - margin.left - margin.right;
        let height = 600 - margin.top - margin.bottom;

        let svg = d3.select("#winRateChart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // Scales
        let x = d3.scaleBand().domain(years).range([0, width]).padding(0.1);
        let y = d3.scaleBand().domain(leagues).range([height, 0]).padding(0.1);
        let colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, 1]);

        // Axes
        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));

        // Axis Labels
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + 50)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Year");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -100)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("League");

        // Tooltip
        let tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background", "lightgray")
            .style("padding", "5px")
            .style("border-radius", "5px")
            .style("display", "none");

        function updateChart(selectedYear) {
            svg.selectAll(".heatmapCell").remove();

            let filteredData = data.filter(d => d.year == selectedYear);
            let winRates = d3.rollup(filteredData, v => d3.mean(v, d => +d.result), d => d.league);
            let chartData = Array.from(winRates, ([league, winRate]) => ({ league, year: selectedYear, winRate }));

            svg.selectAll(".heatmapCell")
                .data(chartData)
                .enter()
                .append("rect")
                .attr("class", "heatmapCell")
                .attr("x", d => x(d.year))
                .attr("y", d => y(d.league))
                .attr("width", x.bandwidth())
                .attr("height", y.bandwidth())
                .attr("fill", d => colorScale(d.winRate || 0))
                .on("mouseover", (event, d) => {
                    tooltip.style("display", "block")
                        .html(`League: ${d.league} <br> Year: ${d.year} <br> Win Rate: ${d3.format(".2%")(d.winRate)}`)
                        .style("left", `${event.pageX + 10}px`)
                        .style("top", `${event.pageY - 20}px`);
                })
                .on("mouseout", () => {
                    tooltip.style("display", "none");
                });

            console.log("Heatmap updated successfully");
        }

        // Legend
        let legend = svg.append("g")
            .attr("transform", `translate(${width + 20}, 20)`);

        let legendScale = d3.scaleLinear().domain([0, 1]).range([200, 0]);

        let legendAxis = d3.axisRight(legendScale).tickFormat(d3.format(".0%"));

        let legendGradient = legend.append("defs")
            .append("linearGradient")
            .attr("id", "legendGradient")
            .attr("x1", "0%").attr("y1", "100%")
            .attr("x2", "0%").attr("y2", "0%");

        legendGradient.append("stop").attr("offset", "0%").attr("stop-color", d3.interpolateBlues(0));
        legendGradient.append("stop").attr("offset", "100%").attr("stop-color", d3.interpolateBlues(1));

        legend.append("rect")
            .attr("width", 15)
            .attr("height", 200)
            .style("fill", "url(#legendGradient)");

        legend.append("g").attr("transform", "translate(15, 0)").call(legendAxis);

        // Initialize with the first year
        updateChart(years[0]);

        // Event listener for dropdown
        yearSelect.on("change", function () {
            updateChart(this.value);
        });

    }).catch(error => console.error("Error loading CSV:", error));
});