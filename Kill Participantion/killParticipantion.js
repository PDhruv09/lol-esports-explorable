/*document.addEventListener("DOMContentLoaded", function () {
    d3.csv("../assets/data/2022_LoL_esports_match_data_from_OraclesElixir.csv").then(function (data) {
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
*/

document.addEventListener("DOMContentLoaded", function () {
    d3.csv("../assets/data/2022_LoL_esports_match_data_from_OraclesElixir.csv").then(function (data) {
        // Convert data into numerical values and filter missing values
        let chartData = data.map(d => ({
            killParticipation: (+d.killsat25 + +d.assistsat25) / Math.max(1, (+d.killsat25 + +d.assistsat25 + +d.deathsat25)),
            result: +d.result
        })).filter(d => !isNaN(d.killParticipation));

        let width = 900, height = 500, margin = { top: 50, right: 50, bottom: 50, left: 70 };

        let svg = d3.select("#killParticipationChart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        let x = d3.scaleLinear().domain([0, 1]).range([margin.left, width - margin.right]);
        let y = d3.scaleLinear().domain([0, 1]).range([height - margin.bottom, margin.top]);

        let xAxis = d3.axisBottom(x).tickFormat(d3.format(".0%"));
        let yAxis = d3.axisLeft(y).tickFormat(d3.format(".0%"));

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(xAxis)
            .append("text")
            .attr("x", width / 2)
            .attr("y", 40)
            .attr("fill", "black")
            .style("font-size", "14px")
            .text("Kill Participation (%)");

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -50)
            .attr("x", -height / 2)
            .attr("fill", "black")
            .style("font-size", "14px")
            .text("Win Rate (%)");

        // Add tooltip
        let tooltip = d3.select("body").append("div")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background", "white")
            .style("border", "1px solid black")
            .style("padding", "5px")
            .style("border-radius", "5px");

        // Scatter plot points
        svg.selectAll("circle")
            .data(chartData)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.killParticipation))
            .attr("cy", d => y(d.result))
            .attr("r", 5)
            .attr("fill", d => d.result ? "#3CB371" : "#DC143C")
            .attr("opacity", 0.7)
            .on("mouseover", function (event, d) {
                tooltip.style("visibility", "visible")
                    .html(`Kill Participation: ${(d.killParticipation * 100).toFixed(2)}%<br>Win: ${d.result ? "Yes" : "No"}`)
                    .style("top", (event.pageY - 10) + "px")
                    .style("left", (event.pageX + 10) + "px");
            })
            .on("mousemove", function (event) {
                tooltip.style("top", (event.pageY - 10) + "px")
                    .style("left", (event.pageX + 10) + "px");
            })
            .on("mouseout", function () {
                tooltip.style("visibility", "hidden");
            });

        // Add legend
        let legend = svg.append("g")
            .attr("transform", `translate(${width - 180},${margin.top})`);

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", "#3CB371");
        legend.append("text")
            .attr("x", 20)
            .attr("y", 10)
            .text("Win")
            .style("font-size", "12px");

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 20)
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", "#DC143C");
        legend.append("text")
            .attr("x", 20)
            .attr("y", 30)
            .text("Loss")
            .style("font-size", "12px");

        // **Regression Line Calculation (Linear Regression)**
        function linearRegression(data) {
            let n = data.length;
            let sumX = d3.sum(data, d => d.killParticipation);
            let sumY = d3.sum(data, d => d.result);
            let sumXY = d3.sum(data, d => d.killParticipation * d.result);
            let sumX2 = d3.sum(data, d => d.killParticipation ** 2);

            let slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
            let intercept = (sumY - slope * sumX) / n;

            return data.map(d => ({ x: d.killParticipation, y: slope * d.killParticipation + intercept }));
        }

        let regressionPoints = linearRegression(chartData);

        // Draw regression line
        let line = d3.line()
            .x(d => x(d.x))
            .y(d => y(d.y));

        svg.append("path")
            .datum(regressionPoints)
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 2)
            .attr("d", line);

        // Zoom and pan functionality
        let zoom = d3.zoom()
            .scaleExtent([1, 5])
            .translateExtent([[0, 0], [width, height]])
            .on("zoom", function (event) {
                svg.selectAll("circle").attr("transform", event.transform);
                svg.select("path").attr("transform", event.transform);
                svg.select("g").call(xAxis.scale(event.transform.rescaleX(x)));
                svg.select("g").call(yAxis.scale(event.transform.rescaleY(y)));
            });

        svg.call(zoom);

    }).catch(error => console.error("Error loading CSV:", error));
});
