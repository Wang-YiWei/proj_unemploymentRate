var education_degree = ['該年度平均','國小','國中','高中','高職','專科','大學','研究所']

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d,i) {
    return education_degree[i] +"失業率: <span style='color:gold'><b>" + d.value + "</b></span>";
  })

var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    infowidth = 200;
    width = +svg.attr("width") - margin.left - margin.right - infowidth,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);
// 設定x軸的年份
var x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);

// 設定每個bar的padding
var x1 = d3.scaleBand()
    .padding(0.05); //  setting the inner and outer padding to the same padding value

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

// var colors = d3.scaleOrdinal()
//     .range(["#E1BEE7","#CE93D8","#BA68C8","#9C27B0","#3F51B5","#1E88E5","#039BE5","#00ACC1"]);


var colors = d3.scaleOrdinal()
    .range(["#FBFF85","#CAEDEB","#9FC2BF","#FFAB87","#FCD78E","#6DBC9C","#7DA2FF","#EEA1EB"]);

// var colors = d3.scaleLinear()
//     .domain([0,7])
//     .range(['#FAFB97','#BB5A5A']);

d3.csv("./data/unemploymentRate_new.csv", function(d, i, columns) {
  for (var i = 1, n = columns.length; i < n; ++i) {
    d[columns[i]] = +d[columns[i]];
  }
  return d;
}, function(error, data) {
  if (error) throw error;

    var keys = data.columns.slice(1);

    // 設定縮放
    x0.domain(data.map(function(d) { return d.year; }));
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);  //bandwidth() : Returns the width of each band
    y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();
    
    // 繪出長條圖
    var bar = g.append("g")
        .selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", function(d) { return "translate(" + x0(d.year) + ",0)"; });

    bar.selectAll("rect")
        .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x1(d.key); })
        .attr("y", function(d) { return y(0); })
        .attr("width", x1.bandwidth())
        .attr("height", function(d) { return height - y(0); })
        .attr("fill", function(d,i) { return colors(d.key); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    bar.selectAll("rect")
        .transition()
        .delay(function (d) {return Math.random()*1000;})
        .duration(1000)
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); });
    
    // 繪出X軸
    g.append("g")
        .style("font-size", "16px")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x0))
        .append("text") // x軸標示文字
        .attr("dy", "1.1em")
        .attr("x", width)
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .text("(年)");

    // 繪出Y軸
    g.append("g")
        .attr("class", "axis Y")
        .style('opacity','0')
        .style("font-size", "16px")
        .call(d3.axisLeft(y).ticks(null, "s"))
        .append("text") // y軸標示文字
        .attr("x", 10)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.4em")
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .text("失業率(%)");

    d3.select(".Y").transition().duration(500).delay(1000).style('opacity','1');

    // 標明圖標
    var legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-sie", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(keys.slice())
        .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
        .style("opacity","0");


    legend.append("rect")
        .attr("x", width+infowidth - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", colors);

    legend.append("text")
        .attr("x", width+infowidth - 24)
        .attr("y", 9.5)
        .attr("dy", "0.35em")
        .text(function(d,i) {
            return education_degree[i]+"失業率";
        });

    legend.transition().duration(500).delay(function(d,i){ return 1000 + 100 * i; }).style("opacity","1");
});