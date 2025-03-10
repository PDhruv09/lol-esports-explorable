/*document.addEventListener("DOMContentLoaded", function () {
    d3.csv("../assets/data/2022_LoL_esports_match_data_from_OraclesElixir.csv").then(function (data) {
        data = data.filter(d => d.datacompleteness === "complete");

        let width = 800, height = 500;
        let svg = d3.select("#goldAdvantageChart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        let x = d3.scaleLinear().domain([-10000, 10000]).range([50, width - 50]);
        let y = d3.scaleLinear().domain([0, 1]).range([height - 50, 50]);

        function updateChart(goldFilter) {
            svg.selectAll("*").remove();

            let filteredData = data.filter(d => Math.abs(+d.golddiffat25) >= goldFilter)
                .map(d => ({
                    golddiffat25: +d.golddiffat25,
                    result: +d.result
                }));

            svg.append("g").attr("transform", `translate(0,${height - 50})`).call(d3.axisBottom(x));
            svg.append("g").attr("transform", `translate(50,0)`).call(d3.axisLeft(y));

            svg.selectAll("circle")
                .data(filteredData)
                .enter()
                .append("circle")
                .attr("cx", d => x(d.golddiffat25))
                .attr("cy", d => y(d.result))
                .attr("r", 5)
                .attr("fill", d => d.golddiffat25 > 0 ? "#3CB371" : "#DC143C")
                .on("mouseover", function () {
                    d3.select(this).attr("r", 8);
                })
                .on("mouseout", function () {
                    d3.select(this).attr("r", 5);
                });
        }

        d3.select("#goldRange").on("input", function () {
            updateChart(+this.value);
        });

        updateChart(0);
    }).catch(error => console.error("Error loading CSV:", error));
});
*/

document.addEventListener("DOMContentLoaded", function () {
    d3.csv("../assets/data/2022_LoL_esports_match_data_from_OraclesElixir.csv").then(function (data) {
        data = data.filter(d => d.datacompleteness === "complete");

        let width = 900, height = 600, margin = { top: 50, right: 50, bottom: 60, left: 80 };
        let svg = d3.select("#goldAdvantageChart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        let x = d3.scaleLinear().domain([-10000, 10000]).range([0, width - margin.left - margin.right]);
        let y = d3.scaleLinear().domain([0, 1]).range([height - margin.top - margin.bottom, 0]);

        // Add axis
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(10));

        svg.append("g")
            .call(d3.axisLeft(y));

        // Axis labels
        svg.append("text")
            .attr("x", (width - margin.left - margin.right) / 2)
            .attr("y", height - margin.bottom + 30)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("fill", "#333")
            .text("Gold Differential at 25 min");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 20)
            .attr("x", -(height - margin.top - margin.bottom) / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("fill", "#333")
            .text("Win Probability");

        // Tooltip
        let tooltip = d3.select("body").append("div")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background", "rgba(0, 0, 0, 0.7)")
            .style("color", "#fff")
            .style("padding", "8px")
            .style("border-radius", "5px")
            .style("font-size", "14px");

        function updateChart(goldFilter) {
            svg.selectAll(".dot").remove();

            let filteredData = data.filter(d => Math.abs(+d.golddiffat25) >= goldFilter)
                .map(d => ({
                    golddiffat25: +d.golddiffat25,
                    result: +d.result
                }));

            svg.selectAll(".dot")
                .data(filteredData)
                .enter()
                .append("circle")
                .attr("class", "dot")
                .attr("cx", d => x(d.golddiffat25))
                .attr("cy", d => y(d.result))
                .attr("r", 5)
                .attr("fill", d => d.golddiffat25 > 0 ? "#3CB371" : "#DC143C")
                .attr("stroke", "#000")
                .attr("stroke-width", 0.5)
                .attr("opacity", 0.8)
                .on("mouseover", function (event, d) {
                    d3.select(this).attr("r", 8).attr("stroke-width", 1.5);
                    tooltip.style("visibility", "visible")
                        .html(`Gold Diff: ${d.golddiffat25}<br>Win Prob: ${d.result}`)
                        .style("top", (event.pageY - 30) + "px")
                        .style("left", (event.pageX + 10) + "px");
                })
                .on("mousemove", function (event) {
                    tooltip.style("top", (event.pageY - 30) + "px")
                        .style("left", (event.pageX + 10) + "px");
                })
                .on("mouseout", function () {
                    d3.select(this).attr("r", 5).attr("stroke-width", 0.5);
                    tooltip.style("visibility", "hidden");
                });

            // Animation
            svg.selectAll(".dot")
                .transition()
                .duration(800)
                .ease(d3.easeBounce)
                .attr("r", 5);
        }

        // Legend
        let legend = svg.append("g")
            .attr("transform", `translate(${width - margin.right - 150},${margin.top - 30})`);

        legend.append("circle").attr("cx", 10).attr("cy", 10).attr("r", 6).style("fill", "#3CB371");
        legend.append("text").attr("x", 25).attr("y", 15).text("Win").style("font-size", "14px").style("fill", "#333");

        legend.append("circle").attr("cx", 10).attr("cy", 30).attr("r", 6).style("fill", "#DC143C");
        legend.append("text").attr("x", 25).attr("y", 35).text("Loss").style("font-size", "14px").style("fill", "#333");

        d3.select("#goldRange").on("input", function () {
            updateChart(+this.value);
        });

        updateChart(0);
    }).catch(error => console.error("Error loading CSV:", error));
});
