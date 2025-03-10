document.addEventListener("DOMContentLoaded", function () {
    d3.csv("../assets/data/2022_LoL_esports_match_data_from_OraclesElixir.csv").then(function (data) {
        data = data.filter(d => d.datacompleteness === "complete");

        let width = 800, height = 500;
        let margin = { top: 20, right: 30, bottom: 50, left: 60 };

        let svg = d3.select("#objectiveChart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        let x = d3.scaleLinear().domain([0, 1]).range([0, width]);
        let y = d3.scaleLinear().domain([0, 1]).range([height, 0]);

        let xAxis = d3.axisBottom(x);
        let yAxis = d3.axisLeft(y);

        svg.append("g").attr("class", "x-axis").attr("transform", `translate(0,${height})`).call(xAxis);
        svg.append("g").attr("class", "y-axis").call(yAxis);

        // Add axis labels
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + 40)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Objective Control Rate");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -40)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Win Rate");

        let tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background", "#fff")
            .style("border", "1px solid #ccc")
            .style("padding", "5px")
            .style("border-radius", "5px")
            .style("display", "none");

        function updateChart(objective) {
            svg.selectAll(".dot").remove();
            svg.selectAll(".trendline").remove();

            let chartData = data.map(d => ({
                objective: +d[objective],
                result: +d.result
            }));

            // Create dots
            let dots = svg.selectAll(".dot")
                .data(chartData)
                .enter()
                .append("circle")
                .attr("class", "dot")
                .attr("cx", d => x(d.objective))
                .attr("cy", d => y(d.result))
                .attr("r", 5)
                .attr("fill", "#3498db")
                .attr("opacity", 0.8)
                .on("mouseover", function (event, d) {
                    d3.select(this).attr("fill", "red").attr("r", 7);
                    tooltip.style("display", "block")
                        .html(`<strong>Objective:</strong> ${d.objective}<br><strong>Win:</strong> ${d.result}`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 20) + "px");
                })
                .on("mouseout", function () {
                    d3.select(this).attr("fill", "#3498db").attr("r", 5);
                    tooltip.style("display", "none");
                });

            // Add trendline (linear regression)
            let regression = ss.linearRegression(chartData.map(d => [d.objective, d.result]));
            let regressionLine = ss.linearRegressionLine(regression);
            let lineData = [
                { x: 0, y: regressionLine(0) },
                { x: 1, y: regressionLine(1) }
            ];

            svg.append("line")
                .attr("class", "trendline")
                .attr("x1", x(lineData[0].x))
                .attr("y1", y(lineData[0].y))
                .attr("x2", x(lineData[1].x))
                .attr("y2", y(lineData[1].y))
                .attr("stroke", "black")
                .attr("stroke-width", 2);

            // Add legend
            let legend = svg.append("g")
                .attr("transform", `translate(${width - 150}, 20)`);

            legend.append("circle")
                .attr("cx", 10)
                .attr("cy", 10)
                .attr("r", 5)
                .attr("fill", "#3498db");

            legend.append("text")
                .attr("x", 20)
                .attr("y", 14)
                .text("Game Data Point")
                .style("font-size", "12px");
            
            // Legend for Trendline
            legend.append("line")
                .attr("x1", 5)
                .attr("y1", 30)
                .attr("x2", 25)
                .attr("y2", 30)
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("stroke-dasharray", "5,5"); // Dashed style to match trendline

            legend.append("text")
                .attr("x", 30)
                .attr("y", 34)
                .text("Trendline (Linear Regression)")
                .style("font-size", "12px");

            
            // Allow zooming and panning
            let zoom = d3.zoom()
                .scaleExtent([1, 5])
                .translateExtent([[0, 0], [width, height]])
                .on("zoom", function (event) {
                    svg.selectAll(".dot").attr("transform", event.transform);
                    svg.selectAll(".trendline").attr("transform", event.transform);
                    svg.select(".x-axis").call(xAxis.scale(event.transform.rescaleX(x)));
                    svg.select(".y-axis").call(yAxis.scale(event.transform.rescaleY(y)));
                });

            svg.call(zoom);
        }

        d3.select("#objectiveSelect").on("change", function () {
            updateChart(this.value);
        });

        updateChart("firstdragon");
    }).catch(error => console.error("Error loading CSV:", error));
});
