const COLORS = {
    colors:{
        "Y_Museveni":"#ffdf00",
        "K_Ssentamu":"#990000",
        "N_Mao":"green",
        "M_Muntu":"purple",
        "A_Oboi":"#0096FF"
    },
    get(label){
        const color=this.colors[label];
        return color==undefined?'#808080':color;
    }
};
function drawBar(data) {
    // set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 120, left: 60 },
        width = 560 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#polling-data")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .select("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);


    const labels = Object.keys(data).slice(2);
    const values = Object.values(data).slice(2).map(el=>parseInt(el));

    // X axis
    const x = d3.scaleBand()
        .range([0, width])
        .domain(labels)
        .padding(0.2);
    svg.select(".xaxis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))


        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(values,v=>+v)])
        .range([height, 0]);
    svg.select(".yaxis")
        .call(d3.axisLeft(y));



    // Bars
    svg.selectAll(".mybar")
        .data(values)
        .join("rect")
        .transition()
        .duration(1000)
        .attr("x", (_d,i) => x(labels[i]))
        .attr("y", d => y(d))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d))
        .attr("fill", (_d,i)=>COLORS.get(labels[i]))
        .attr("class","mybar")
}
