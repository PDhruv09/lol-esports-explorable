document.addEventListener("DOMContentLoaded", function () {
    d3.csv("../assets/data/2022_LoL_esports_match_data_from_OraclesElixir.csv").then(function (data) {
        data = data.filter(d => d.datacompleteness === "complete");

        let width = 800, height = 500;
        let svg = d3.select("#objectiveChart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        function updateChart(objective) {
            svg.selectAll("*").remove();

            let chartData = data.map(d => ({
                objective: +d[objective],
                result: +d.result
            }));

            let x = d3.scaleLinear().domain([0, 1]).range([50, width - 50]);
            let y = d3.scaleLinear().domain([0, 1]).range([height - 50, 50]);

            svg.append("g").attr("transform", `translate(0,${height - 50})`).call(d3.axisBottom(x));
            svg.append("g").attr("transform", `translate(50,0)`).call(d3.axisLeft(y));

            svg.selectAll("circle")
                .data(chartData)
                .enter()
                .append("circle")
                .attr("cx", d => x(d.objective))
                .attr("cy", d => y(d.result))
                .attr("r", 5)
                .attr("fill", "#3498db")
                .on("mouseover", function () {
                    d3.select(this).attr("fill", "red").attr("r", 7);
                })
                .on("mouseout", function () {
                    d3.select(this).attr("fill", "#3498db").attr("r", 5);
                });
        }

        d3.select("#objectiveSelect").on("change", function () {
            updateChart(this.value);
        });

        updateChart("firstdragon");
    }).catch(error => console.error("Error loading CSV:", error));
});
