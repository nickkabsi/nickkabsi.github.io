function drawTrend() {

    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    //Read the data
    d3.csv("../data/trend.csv").then(function (data) {

        // group the data: I want to draw one line per group
        const sumstat = d3.group(data, d => d.party); // nest function allows to group the calculation per level of a factor

        // Add X axis --> it is a date format
        const x = d3.scaleLinear()
            .domain([2006,2021])
            .range([0, width]);
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x).ticks(5));

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, 100])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // color palette
        const color = d3.scaleOrdinal()
            .range(['yellow', 'blue', 'green', 'red'])

        // Draw the line
        svg.selectAll(".line")
            .data(sumstat)
            .join("path")
            .attr("fill", "none")
            .attr("stroke", function (d) {
                return color(d[0])
            })
            .attr("stroke-width", 1.5)
            .attr("d", function (d) {
                return d3.line()

                    .x(function (d) { return x(d.year); })
                    .y(function (d) { return y(parseFloat(d.percentage)); })
                    (d[1])
            })

    })
}
