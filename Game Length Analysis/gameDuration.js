/*document.addEventListener("DOMContentLoaded", function () {
    d3.csv("../assets/data/2022_LoL_esports_match_data_from_OraclesElixir.csv").then(function (data) {
        let gameDurations = data.map(d => +d.gamelength).filter(d => !isNaN(d));

        let width = 800, height = 400;
        let svg = d3.select("#gameDurationChart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        let x = d3.scaleLinear().domain([0, d3.max(gameDurations)]).range([50, width - 50]);
        let histogram = d3.histogram().domain(x.domain()).thresholds(x.ticks(20))(gameDurations);

        let y = d3.scaleLinear().domain([0, d3.max(histogram, d => d.length)]).range([height - 50, 50]);

        svg.append("g").attr("transform", `translate(0,${height - 50})`).call(d3.axisBottom(x));
        svg.append("g").attr("transform", `translate(50,0)`).call(d3.axisLeft(y));

        svg.selectAll("rect")
            .data(histogram)
            .enter()
            .append("rect")
            .attr("x", d => x(d.x0))
            .attr("y", d => y(d.length))
            .attr("width", d => x(d.x1) - x(d.x0) - 2)
            .attr("height", d => height - 50 - y(d.length))
            .attr("fill", "#3CB371");
    }).catch(error => console.error("Error loading CSV:", error));
});
*/

document.addEventListener("DOMContentLoaded", function () {
    d3.csv("../assets/data/2022_LoL_esports_match_data_from_OraclesElixir.csv").then(function (data) {
        let gameDurations = data.map(d => +d.gamelength).filter(d => !isNaN(d));

        let width = 900, height = 500, margin = { top: 50, right: 30, bottom: 60, left: 70 };

        let svg = d3.select("#gameDurationChart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        let x = d3.scaleLinear()
            .domain([0, d3.max(gameDurations)])
            .range([0, width - margin.left - margin.right]);

        let histogram = d3.histogram()
            .domain(x.domain())
            .thresholds(x.ticks(20))(gameDurations);

        // Get the max bin count dynamically for y-axis range
        let maxBinCount = d3.max(histogram, d => d.length);

        let y = d3.scaleLinear()
            .domain([0, maxBinCount]) // Dynamically adjust range
            .nice() // Ensures clean tick values
            .range([height - margin.top - margin.bottom, 0]);

        // Add X-axis
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(10))
            .append("text")
            .attr("x", (width - margin.left - margin.right) / 2)
            .attr("y", 40)
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .text("Game Duration (Minutes)");

        // Add Y-axis
        svg.append("g")
            .call(d3.axisLeft(y).ticks(10))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -((height - margin.top - margin.bottom) / 2))
            .attr("y", -50)
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .text("Frequency of Matches");

        // Add Bars
        svg.selectAll("rect")
            .data(histogram)
            .enter()
            .append("rect")
            .attr("x", d => x(d.x0))
            .attr("y", d => y(d.length))
            .attr("width", d => Math.max(1, x(d.x1) - x(d.x0) - 2)) // Prevent bars from disappearing
            .attr("height", d => height - margin.top - margin.bottom - y(d.length))
            .attr("fill", "#3CB371")
            .attr("stroke", "black");

        // Add Legend
        let legend = svg.append("g")
            .attr("transform", `translate(${width - margin.right - 200}, ${-10})`);

        legend.append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", "#3CB371")
            .attr("stroke", "black");

        legend.append("text")
            .attr("x", 25)
            .attr("y", 12)
            .attr("font-size", "14px")
            .text("Game Duration Distribution");
        
    }).catch(error => console.error("Error loading CSV:", error));
});


