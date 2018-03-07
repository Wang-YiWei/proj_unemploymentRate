d3.csv("./data/prejob.csv", function (error, prejobData) {

    var whichYear = 0; //2017
    var prejobChartMargin = {
            top: 35,
            right: 20,
            bottom: 280,
            left: 100
        },
        prejobContainerWidth = document.getElementById("prejobSvg-container").clientWidth,
        prejobChartWidth = prejobContainerWidth - prejobChartMargin.left - prejobChartMargin.right,
        prejobChartHeight = 600 - prejobChartMargin.top - prejobChartMargin.bottom;


    // var sizeIsL = 0,
    //     sizeIsM = 0,
    //     sizeIsS = 0,
    //     sizeIsXS = 0;
    // var fontSize1 = 20,
    //     fontSize2 = 30;

    // if (prejobContainerWidth >= 1250) {
    //     sizeIsL = 1;
    // } else if ((prejobContainerWidth < 1250) && (prejobContainerWidth >= 700)) {
    //     sizeIsM = 1;
    // } else if ((prejobContainerWidth < 700) && (prejobContainerWidth >= 400)) {
    //     sizeIsS = 1;
    // } else if (prejobContainerWidth < 400) {
    //     sizeIsXS = 1;
    // }

    var textColor5 = '#6E6E6E';
    var prejobScaleX = d3.scale.ordinal()
        .rangeRoundBands([0, prejobChartWidth], .25);

    var prejobScaleY = d3.scale.linear()
        .range([prejobChartHeight, 0]);

    var prejobChartAxisX = d3.svg.axis()
        .scale(prejobScaleX)
        .orient("bottom")
        .ticks(10);

    var prejobChartAxisY = d3.svg.axis()
        .scale(prejobScaleY)
        .orient("left")
        .ticks(5);

    var prejobSvg = d3.select("#prejobSvg")
        .attr("width", prejobChartWidth + prejobChartMargin.left + prejobChartMargin.right)
        .attr("height", prejobChartHeight + prejobChartMargin.top + prejobChartMargin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + prejobChartMargin.left + "," + prejobChartMargin.top + ")");

    prejobData.forEach(function (d) {
        d.py = +d.py;
        d.p_rate = +d.p_rate;
    });


    var entirePrejobData = [];
    var yearlyPrejobData = [];
    var wholeYear = [2017, 2016, 2015, 2014, 2013, 2012, 2011];

    for (var i = 0; i < wholeYear.length; ++i) {
        yearlyPrejobData[i] = [];
    }

    for (var i = 0; i < prejobData.length; i++) {
        entirePrejobData.push(prejobData[i]);
        for (var j = 0; j < wholeYear.length; ++j) {
            if (entirePrejobData[i].py == wholeYear[j]) {
                yearlyPrejobData[j].push(entirePrejobData[i]);
            }

        }
    }

    var sortedData = yearlyPrejobData.slice(0);

    sortedData[whichYear].sort(function (x, y) {
        return d3.descending(x.p_rate, y.p_rate);
    });


    prejobScaleX.domain(yearlyPrejobData[whichYear].map(function (d) {
        return d['prejob'];
    }));
    prejobScaleY.domain([0, d3.max(yearlyPrejobData[whichYear], function (d) {
        return d.p_rate;
    })]);

    // 繪出x軸
    prejobSvg.append("g")
        .attr("transform", "translate(0," + prejobChartHeight + ")")
        .attr("class", "prejobXaxis")
        .call(prejobChartAxisX)
        .attr("fill", 'none')
        .attr("stroke", textColor5)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-0.1em")
        .attr("dy", "0.7em")
        .attr("transform", "rotate(-45)")
        .attr("stroke", textColor5)
        .attr({
            'fill': textColor5, //x軸文字顏色
            'stroke': 'none',
        }).style({
            'font-size': '20px'
        })
        .attr('font-family', 'Noto Sans TC');

    // 繪出y軸
    prejobSvg.append("g")
        .attr("class", "prejobYaxis")
        .call(prejobChartAxisY)
        .attr("fill", 'none')
        .attr("stroke", textColor5)
        .selectAll("text")
        .attr("stroke", textColor5)
        .attr({
            'fill': textColor5, //y軸文字顏色
            'stroke': 'none',
        }).style({
            'font-size': '20px'
        })
        .attr('font-family', 'Noto Sans TC');


    //繪出Y軸單位
    prejobSvg.append("text")
        .attr("x", -5)
        .attr("y", -33)
        .attr("dy", "1em")
        .attr({
            'fill': textColor5, // y軸文字顏色
            'stroke': 'none',
        }).style({
            'font-size': '20px'
        })
        .attr('font-family', 'Noto Sans TC')
        .style("text-anchor", "end")
        .text("人數(%)");

    var prejobTip = d3.tip()
        .attr('class', 'prejob-d3-tip')
        .offset([-10, 0])
        .html(function (d) {
            if (d.prejob == "批發及零售業" || d.prejob == "製造業") return d.prejob + " : <span style='color:#FF7777'>" + d.p_rate + "</span> %";
            else return d.prejob + " : <span style='color:#fff'>" + d.p_rate + "</span> %";
        })

    prejobSvg.call(prejobTip);

    // 繪出柱狀圖
    var prejobBarRect = prejobSvg.selectAll(".prejobBarRect")
        .data(yearlyPrejobData[whichYear]);

    prejobBarRect.enter().append("rect")
        .attr("class", "prejobBarRect")
        .style("fill", function (d) {
            if (d.prejob == "批發及零售業" || d.prejob == "製造業") return "#FF7777";
            else return "steelblue";
        })
        .attr("x", function (d) {
            return prejobScaleX(d.prejob);
        })
        .attr("width", prejobScaleX.rangeBand())
        .attr("y", function (d) {
            return prejobScaleY(d.p_rate);
        })
        .attr("height", function (d) {
            return prejobChartHeight - prejobScaleY(d.p_rate);
        })
        .on('mouseover', prejobTip.show)
        .on('mouseout', prejobTip.hide);

    // 此svg的標題
    prejobSvg.append("text")
        .attr("x", prejobContainerWidth / 2 - prejobChartMargin.left)
        .attr("y", prejobChartHeight + prejobChartMargin.bottom - 15)
        .attr("text-anchor", "middle")
        .text("學歷為大學以上之原有工作之失業者失業前行業(2011年-2017年)")
        .attr("fill", textColor5)
        .attr("font-size", "20px")
        .attr('font-family', 'Noto Sans TC');

    var prejobDropdown = d3.select("#prejob-select")
        .on("change", prejobDropdownChange);

    var dataChangingTime2 = 750;

    function prejobDropdownChange() {
        whichYear = parseInt(d3.select("#prejob-select").property('value'));
        //重新定義一些資料

        sortedData[whichYear].sort(function (x, y) {
            return d3.descending(x.p_rate, y.p_rate);
        })
        console.log(sortedData[whichYear]);

        prejobScaleX.domain(yearlyPrejobData[whichYear].map(function (d) {
            return d['prejob'];
        }));
        prejobScaleY.domain([0, d3.max(yearlyPrejobData[whichYear], function (d) {
            return d.p_rate;
        })]);

        prejobChartAxisX = d3.svg.axis()
            .scale(prejobScaleX)
            .orient("bottom")
            .ticks(10);

        prejobChartAxisY = d3.svg.axis()
            .scale(prejobScaleY)
            .orient("left")
            .ticks(5);

        // 給新的資料
        prejobBarRect = prejobSvg.selectAll(".prejobBarRect")
            .data(yearlyPrejobData[whichYear]);

        // 繪出新的bar
        prejobBarRect.transition()
            .duration(dataChangingTime2)
            .attr("y", function (d) {
                return prejobScaleY(d.p_rate);
            })
            .attr("height", function (d) {
                return prejobChartHeight - prejobScaleY(d.p_rate);
            });

        // 繪出x軸
        d3.select("body")
            .transition()
            .select(".prejobXaxis") // change the x axis
            .duration(dataChangingTime2)
            .call(prejobChartAxisX)
            .attr("fill", 'none')
            .attr("stroke", textColor5)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-0.1em")
            .attr("dy", "0.7em")
            .attr("transform", "rotate(-45)")
            .attr("stroke", textColor5)
            .attr({
                'fill': textColor5, //y軸文字顏色
                'stroke': 'none',
            }).style({
                'font-size': '20px'
            })
            .attr('font-family', 'Noto Sans TC');

        // 繪出y軸
        d3.select("body")
            .transition()
            .select(".prejobYaxis") // change the y axis
            .duration(dataChangingTime2)
            .call(prejobChartAxisY)
            .attr("fill", 'none')
            .attr("stroke", textColor5)
            .selectAll("text")
            .attr("stroke", textColor5)
            .attr({
                'fill': textColor5, //y軸文字顏色
                'stroke': 'none',
            }).style({
                'font-size': '20px'
            })
            .attr('font-family', 'Noto Sans TC');


    }

});