﻿var linechartMargin2 = {
    left: 100,
    right: 20,
    top: 20,
    bottom: 80
};

var containerWidth2 = document.getElementById('collegeSvg-container').clientWidth;
var linechartWidth2 = containerWidth2 - linechartMargin2.left - linechartMargin2.right;
var linechartHeight2 = 400 - linechartMargin2.top - linechartMargin2.bottom;

var axisTextSize = 20;

if (containerWidth2 > 350) {
    axisTextSize = 20;
} else if (containerWidth2 < 350 && containerWidth2 > 300) {
    axisTextSize = 18;
} else {
    axisTextSize = 16;
}

var maxPeople = 0;
var minDate = new Date();
var maxDate = new Date();
var textColor2 = '#6E6E6E';

d3.csv("./data/college.csv")
    .row(function (d) {
        return {
            year: new Date(d.year),
            people: +d.people
        };
    })
    .get(function (error, peopleData) {
        maxPeople = d3.max(peopleData, function (d) {
            return d.people;
        });
        minDate = d3.min(peopleData, function (d) {
            return d.year;
        });
        maxDate = d3.max(peopleData, function (d) {
            return d.year;
        });


        var yScale = d3.scale.linear()
            .domain([0, maxPeople])
            .range([linechartHeight2, 0]);

        var xScale = d3.time.scale()
            .domain([minDate, maxDate])
            .range([0, linechartWidth2]);

        var yAxis = d3.svg.axis()
            .orient("left")
            .scale(yScale)
            .ticks(10);

        var xAxis = d3.svg.axis()
            .orient("bottom")
            .scale(xScale)
            .ticks(5);

        var peopleLine = d3.svg.line()
            .x(function (d) {
                return xScale(d.year);
            })
            .y(function (d) {
                return yScale(d.people);
            });

        var linechartSvg2 = d3.select("#collegeSvg")
            .attr({
                'width': linechartWidth2 + linechartMargin2.left + linechartMargin2.right,
                'height': linechartHeight2 + linechartMargin2.top + linechartMargin2.bottom
            })

        var g2 = linechartSvg2
            .append("g")
            .attr("class", "g2")
            .attr("transform", "translate(" + linechartMargin2.left + "," + linechartMargin2.top + ")");

        g2.append("path")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", "3px")
            .attr("d", function (d) {
                return peopleLine(peopleData);
            })


        g2.append("g")
            .attr("transform", "translate(0," + linechartHeight2 + ")")
            .call(xAxis)
            .attr("fill", 'none')
            .attr("stroke", textColor2)
            .selectAll('text')
            .attr({
                'fill': textColor2, //x軸文字顏色
                'stroke': 'none',
            }).style({
                'font-size': axisTextSize
            })
            .attr('font-family', 'Noto Sans TC');

        g2.append("g")
            .call(yAxis)
            .attr("fill", 'none')
            .attr("stroke", textColor2)
            .selectAll('text')
            .attr({
                'fill': textColor2, //y軸文字顏色
                'stroke': 'none',
            }).style({
                'font-size': axisTextSize
            })
            .attr('font-family', 'Noto Sans TC');

        //繪出X軸單位
        linechartSvg2.append("text")
            .attr("x", 0 + linechartMargin2.left + linechartWidth2 + linechartMargin2.right)
            .attr("y", 0 + linechartMargin2.top + linechartHeight2)
            .attr("dy", "1em")
            .attr({
                'fill': textColor2, // x軸文字顏色
                'stroke': 'none',
            }).style({
                'font-size': axisTextSize
            })
            .attr('font-family', 'Noto Sans TC')
            .style("text-anchor", "start")
            .text("(年)");

        //繪出Y軸單位
        linechartSvg2.append("text")
            .attr("x", 0 + linechartMargin2.left - 10)
            .attr("y", 0)
            .attr("dy", "1em")
            .attr({
                'fill': textColor2, // y軸文字顏色
                'stroke': 'none',
            }).style({
                'font-size': axisTextSize
            })
            .attr('font-family', 'Noto Sans TC')
            .style("text-anchor", "end")
            .text("(人)");

        // 此svg的標題
        linechartSvg2.append("text")
            .attr("x", containerWidth2 / 2)
            .attr("y", linechartHeight2 + linechartMargin2.bottom)
            .attr("text-anchor", "middle")
            .text("歷年大學畢業生人數 (1994年-2016年)")
            .attr("fill", textColor2)
            .attr("font-size", axisTextSize)
            .attr('font-family', 'Noto Sans TC');
    });