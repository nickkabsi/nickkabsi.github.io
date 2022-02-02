/**
 * 
 * @param {string} label 
 * @param {*} data 
 */
function getStats(label,data){
 const vals = data.map(el=>parseInt(el[label]));
 const q1=d3.quantile(vals,0.25);
 const median = d3.quantile(vals,0.5);
 const q3 = d3.quantile(vals,0.75);
 const interQuantileRange = q3-q1;
 const min  = q1 - 1.2*interQuantileRange;
 const max = q3 + 1.5*interQuantileRange;
 const tmp = {q1,median,q3,min,max };
 return {
     key:label,
     value:tmp
 }
}
/**
 * @param {{target:string;url:string}} party
 */
function drawBox(party) {
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#"+party.target)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Read the data and compute summary statistics for each specie
    d3.csv("./data/"+party.url+".csv").then(function (data) {
        // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
        var sumstat = [getStats("parliamentary",data),getStats("presidential",data)];
        // Show the X scale
        var x = d3.scaleBand()
            .range([0, width])
            .domain(["parliamentary", "presidential"])
            .paddingInner(1)
            .paddingOuter(.5)
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))

        // Show the Y scale
        var y = d3.scaleLinear()
            .domain([0,d3.max(data,d=>+d["presidential"])])
            .range([height, 0])
        svg.append("g").call(d3.axisLeft(y))

        // Show the main vertical line
        svg
            .selectAll("vertLines")
            .data(sumstat)
            .enter()
            .append("line")
            .attr("x1", function (d) { return (x(d.key)) })
            .attr("x2", function (d) { return (x(d.key)) })
            .attr("y1", function (d) { return (y(d.value.min)) })
            .attr("y2", function (d) { return (y(d.value.max)) })
            .attr("stroke", "black")
            .style("width", 40)

        // rectangle for the main box
        var boxWidth = 100
        svg
            .selectAll("boxes")
            .data(sumstat)
            .enter()
            .append("rect")
            .attr("x", function (d) { return (x(d.key) - boxWidth / 2) })
            .attr("y", function (d) { return (y(d.value.q3)) })
            .attr("height", function (d) { 
                const hr = y(d.value.q1) - y(d.value.q3); 
                return hr<0?0:hr
            })
            .attr("width", boxWidth)
            .attr("stroke", "black")
            .style("fill", "#40b3dd")

        // Show the median
        svg
            .selectAll("medianLines")
            .data(sumstat)
            .enter()
            .append("line")
            .attr("x1", function (d) { return (x(d.key) - boxWidth / 2) })
            .attr("x2", function (d) { return (x(d.key) + boxWidth / 2) })
            .attr("y1", function (d) { return (y(d.value.median)) })
            .attr("y2", function (d) { return (y(d.value.median)) })
            .attr("stroke", "black")
            .style("width", 80)
    })

}