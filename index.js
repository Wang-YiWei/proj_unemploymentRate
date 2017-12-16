var dataIsChanging = 0;

d3.csv("unemploymentRate.csv", function(data) {
    data.forEach(function(d) {
        d.x = +d.x;
        d.year = +d.year;
        d.total = +d.total;
        d.primary = +d.primary;
        d.junior = +d.junior;
        d.senior = +d.senior;
        d.vocational = +d.vocational;
        d.specialist = +d.specialist;
        d.college = +d.college;
        d.graduate = +d.graduate;
    });
    //console.log(data);

    var minYear = d3.extent(data, function(it) { return it.year })[0],
        maxYear = d3.extent(data, function(it) { return it.year })[1];
    var minTotal = d3.extent(data, function(it) { return it.total })[0];
    var maxTotal = d3.extent(data, function(it) { return it.total })[1];
    var minX = d3.min(data, function(d) { return d.x }),
        maxX = d3.max(data, function(d) { return d.x }),
        minY = 0,
        maxY = 7;

    //console.log(minYear);


    var linechartMargin = { top: 30, right: 50, bottom: 70, left: 50 };
    var linechartWidth = 800 - linechartMargin.left - linechartMargin.right;
    var linechartHeight = 600 - linechartMargin.top - linechartMargin.bottom;
    var infoDivWidth = 300;

    var scaleX = d3.scale.linear()
        .range([0, linechartWidth])
        .domain([minX, maxX]);

    var scaleX2 = d3.scale.linear()
        .range([0, linechartWidth])
        .domain([minYear, maxYear]);

    var scaleY = d3.scale.linear()
        .range([linechartHeight, 0]) //d3 Y座標是越下越大,所以反過來比較直覺
        .domain([minY, maxY]);

    // --- 創造畫布
    var linechartsvg = d3.select('.chart1')
        .append('svg')
        .attr('id', 's');

    linechartsvg.data(data)
        .attr({
            'width': linechartWidth + linechartMargin.left + linechartMargin.right + infoDivWidth,
            'height': linechartHeight + linechartMargin.top + linechartMargin.bottom,
        }).style({
            // 'border': '1px solid #000'
            // 'background':rgba(170,170,170,0.15)
        })
        .attr('transform', 'translate(' + linechartMargin.left + ',' + linechartMargin.top + ')')
        .on("mousemove", linechartMove)
        .on("touchmove", linechartMove);

    //將縮放後的資料放進lines這個變數裡
    var lines = [8]; //8種教育程度的8種折線
    for (var i = 0; i < 8; ++i) {
        lines[i] = d3.svg.line()
            .x(function(d) { return scaleX(d.x); })
            .y(function(d) {
                if (i == 0) return scaleY(d.total);
                else if (i == 1) return scaleY(d.primary);
                else if (i == 2) return scaleY(d.junior);
                else if (i == 3) return scaleY(d.senior);
                else if (i == 4) return scaleY(d.vocational);
                else if (i == 5) return scaleY(d.specialist);
                else if (i == 6) return scaleY(d.college);
                else if (i == 7) return scaleY(d.graduate);
            });
    }


    //設定座標系
    var gridInterval = 10;

    var axisX = d3.svg.axis()
        .scale(scaleX2)
        .orient("bottom") //用axis.orient 來定義座標文字的上下左右位置
        .ticks(gridInterval)
        .tickFormat(function(d) { return d + '年'; });

    var axisY = d3.svg.axis()
        .scale(scaleY)
        .orient("left") //用axis.orient 來定義座標文字的上下左右位置
        .ticks(gridInterval)
        .tickFormat(function(d) { return d + '%'; });

    var axisXGrid = d3.svg.axis()
        .scale(scaleX)
        .orient("bottom")
        .ticks(gridInterval)
        .tickFormat("")
        .tickSize(-linechartHeight, 0);

    var axisYGrid = d3.svg.axis()
        .scale(scaleY)
        .orient("left")
        .ticks(gridInterval)
        .tickFormat("")
        .tickSize(-linechartWidth, 0);

    //繪出8條折線
    var lineColor1 = '#1f77b4';
    var lineColor2 = '#ff7f0e';
    var lineColor3 = '#2ca02c';
    var lineColor4 = '#d62728';
    var lineColor5 = '#9467bd';
    var lineColor6 = '#8c564b';
    var lineColor7 = '#e377c2';
    var lineColor8 = '#17becf';

    // //標明線段
    // var beginX = linechartMargin.left,
    //     beginY = 0.3 * linechartMargin.top,
    //     lineLength = linechartWidth * 0.05,
    //     lineInterval = linechartWidth / 4;
    // var linetextSize = 16;
    // if (linechartWidth < 300) {
    //     linetextSize = 9;
    // } else if (linechartWidth < 500) {
    //     linetextSize = 12;
    // }
    // for (var i = 0; i < 4; ++i) {
    //     linechartsvg.append("line") // attach a line
    //         .style("stroke", function() {
    //             if (i == 0) return lineColor1;
    //             if (i == 1) return lineColor2;
    //             if (i == 2) return lineColor3;
    //             if (i == 3) return lineColor4;

    //         })
    //         .style("stroke-width", 2.5)
    //         .attr("x1", beginX + i * lineInterval)
    //         .attr("y1", beginY)
    //         .attr("x2", beginX + lineLength + i * lineInterval)
    //         .attr("y2", beginY);
    //     linechartsvg.append("circle")
    //         .attr("cx", function() {
    //             return beginX + 0.5 * lineLength + i * lineInterval;
    //         })
    //         .attr("cy", beginY)
    //         .attr("r", function() {
    //             if (linechartWidth < 400) return 3;
    //             else return 5;
    //         })
    //         .attr("fill", () => {
    //             if (i == 0) return lineColor1;
    //             if (i == 1) return lineColor2;
    //             if (i == 2) return lineColor3;
    //             if (i == 3) return lineColor4;
    //         })
    //     linechartsvg.append("text")
    //         .attr("x", function() {
    //             return (beginX + lineLength) + 5 + i * lineInterval;
    //         })
    //         .attr("y", 0.3 * linechartMargin.top + 0.5 * linetextSize)
    //         .text(function() {
    //             if (i == 0) return "現金買入";
    //             if (i == 1) return "現金賣出";
    //             if (i == 2) return "即期買入";
    //             if (i == 3) return "即期賣出";
    //         })
    //         .attr("text-anchor", "start")
    //         .attr("font-family", "Noto Sans TC")
    //         .attr("font-size", linetextSize + "px")
    //         .attr("fill", () => {
    //             if (i == 0) return lineColor1;
    //             if (i == 1) return lineColor2;
    //             if (i == 2) return lineColor3;
    //             if (i == 3) return lineColor4;
    //         });
    // }


    for (var i = 0; i < 8; ++i) {
        linechartsvg.append('path')
            .attr("class", "historylines" + i)
            .attr({
                'd': lines[i](data),
                'stroke': function(d) {
                    if (i == 0) return lineColor1;
                    if (i == 1) return lineColor2;
                    if (i == 2) return lineColor3;
                    if (i == 3) return lineColor4;
                    if (i == 4) return lineColor5;
                    if (i == 5) return lineColor6;
                    if (i == 6) return lineColor7;
                    if (i == 7) return lineColor8;
                },
                'transform': 'translate(' + (linechartMargin.left) + ', ' + (linechartMargin.top) + ')', //用translate挑整axisX,axisY的位置
                'fill': 'none'
            });
    }


    //繪出X軸標格
    linechartsvg.append('g')
        .call(axisXGrid)
        .attr({
            'fill': 'none',
            'stroke': 'rgba(170,170,170,0.5)',
            // 'stroke': 'rgba(0,0,0,.1)',
            'transform': 'translate(' + (linechartMargin.left) + ', ' + (linechartHeight + linechartMargin.top) + ')'
        });
    //繪出Y軸標格
    linechartsvg.append('g')
        .call(axisYGrid)
        .attr({
            'fill': 'none',
            'stroke': 'rgba(170,170,170,0.5)',
            // 'stroke': 'rgba(0,0,0,.1)',
            'transform': 'translate(' + (linechartMargin.left) + ',' + (linechartMargin.top) + ')'
        });
    //繪出X軸
    linechartsvg.append('g')
        .call(axisX) //call axisX
        .attr({
            'class': 'axisX',
            'fill': 'none',
            'stroke': 'rgba(170,170,170,1)',
            'transform': 'translate(' + (linechartMargin.left) + ', ' + (linechartHeight + linechartMargin.top) + ')' //用translate挑整axisX,axisY的位置
        })
        .selectAll('text')
        .attr({
            'fill': '#000',
            'stroke': 'none',
        }).style({
            'font-size': '11px'
        });
    //繪出Y軸
    linechartsvg.append('g')
        .call(axisY) //call axisY
        .attr({
            'class': 'axisY',
            'fill': 'none',
            'stroke': 'rgba(170,170,170,1)',
            'transform': 'translate(' + (linechartMargin.left) + ',' + (linechartMargin.top) + ')' //用translate挑整axisX,axisY的位置
        })
        .selectAll('text')
        .attr({
            'class': 'linechartYtext',
            'fill': '#000',
            'stroke': 'none',
        }).style({
            'font-size': '11px'
        });

    //繪出跟著滑鼠跑的線
    var flexibleLineColor = '#6465A5';
    linechartsvg.append('line')
        .attr('id', 'flexibleLine')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', 0)
        .style('stroke', flexibleLineColor)
        .style('stroke-width', 1)
        .style('opacity', 0);

    //創造資料的圓點並繪出
    var originR = 3.5,
        bigR = 6;
    var dots = [8]; //store 4 kind of value's array.
    var dotName = ['dots1', 'dots2', 'dots3', 'dots4', 'dots5', 'dots6', 'dots7', 'dots8']
    for (var j = 0; j < 8; ++j) {
        dots[j] = linechartsvg.selectAll(dotName[j])
            .data(data)
            .enter()
            .append('g')
            .append('circle')
            .attr('class', function(d, i) {
                //console.log("dots" + i + " onLine" + j)
                return "dots" + i + " onLine" + j;
            })
            .attr('cx', function(d) {
                return scaleX(d.x) + linechartMargin.left;
            })
            .attr('cy', function(d) {
                if (j == 0) return scaleY(d.total) + linechartMargin.top;
                else if (j == 1) return scaleY(d.primary) + linechartMargin.top;
                else if (j == 2) return scaleY(d.junior) + linechartMargin.top;
                else if (j == 3) return scaleY(d.senior) + linechartMargin.top;
                else if (j == 4) return scaleY(d.vocational) + linechartMargin.top;
                else if (j == 5) return scaleY(d.specialist) + linechartMargin.top;
                else if (j == 6) return scaleY(d.college) + linechartMargin.top;
                else if (j == 7) return scaleY(d.graduate) + linechartMargin.top;
            })
            .attr('fill', function(d) {
                if (j == 0) return lineColor1;
                if (j == 1) return lineColor2;
                if (j == 2) return lineColor3;
                if (j == 3) return lineColor4;
                if (j == 4) return lineColor5;
                if (j == 5) return lineColor6;
                if (j == 6) return lineColor7;
                if (j == 7) return lineColor8;
            })
            .attr('r', originR);
    }

    //繪出圓點資訊
    var shineDuration = 400;
    var dotTextOffsetX = 60,
        dotTextOffsetY = 40;
    var tips = linechartsvg.append('g')
        .attr('class', 'tips');
    var infoWidth = 200,
        infoHeight = 190;
    tips.append('rect')
        .attr('class', 'tips-border')
        .attr('width', infoWidth)
        .attr('height', infoHeight)
        .attr('rx', 10)
        .attr('ry', 10)
        .attr("stroke", flexibleLineColor)
        .attr("stroke-width", '2px')
        .attr('fill', '#CCCCFF')
        .attr('opacity', 0);



    var infoTextOffsetX = 10;
    var tipText = [];
    for (var i = 0; i < 9; ++i) {
        tipText[i] = "tips-text" + i;
    }
    for (var j = 0; j < 9; ++j) {
        tips.append('text')
            .attr('class', tipText[j])
            .attr('dx', infoTextOffsetX)
            .attr('dy', function() {
                return 20 * (j + 1)
            })
            .text("")
            .attr('font-family', 'Noto Sans TC');
    }

    //跟著滑鼠跑的那條線的Function
    var dotIsShining = 0; //判斷是否有某資料點正在閃爍
    var shineDistance = 3;

    function linechartMove(d, i) {
        if (dataIsChanging == 0) {
            mousePosOnLinechart = d3.mouse(this);

            //show data
            for (var i = 0; i < data.length; ++i) {
                if (Math.abs(mousePosOnLinechart[0] - (scaleX(data[i].x) + linechartMargin.left)) < shineDistance) {
                    dotIsShining++;
                    //讓點反覆閃爍
                    d3.selectAll(".dots" + i)
                        .attr({
                            'fill': flexibleLineColor
                        })
                        .transition()
                        .duration(shineDuration)
                        .attr("r", bigR)
                        .each("start", function repeat() {
                            d3.select(this)
                                .attr('r', originR)
                                .transition()
                                .duration(shineDuration)
                                .attr("r", bigR)
                                .transition()
                                .duration(shineDuration)
                                .attr("r", originR)
                                .transition()
                                .each("start", repeat);
                        });

                    //顯示資料塊
                    d3.select('.tips-border')
                        .transition()
                        .delay(10)
                        .attr('opacity', 0.4)
                        .attr("x", function() {
                            return linechartWidth + 100;
                        })
                        .attr("y", function() {
                            return linechartMargin.top;
                        });
                    //顯示資料塊裡的文字
                    for (var j = 0; j < 9; ++j) {
                        d3.select('.' + tipText[j])
                            .transition()
                            .delay(10)
                            .attr("opacity", 1)
                            .attr("x", function() {
                                return linechartWidth + 100;
                            })
                            .attr("y", function() {
                                return linechartMargin.top;
                            })
                            .text(function(d) {
                                if (j == 0) return data[i].year + " 年 各教育程度失業率";
                                if (j == 1) return "平均 : " + data[i].total + "%";
                                if (j == 2) return "小學及以下 : " + data[i].primary + "%";
                                if (j == 3) return "國中 : " + data[i].junior + "%";
                                if (j == 4) return "高中 : " + data[i].senior + "%";
                                if (j == 5) return "高職 : " + data[i].vocational + "%";
                                if (j == 6) return "專科 : " + data[i].specialist + "%";
                                if (j == 7) return "大學 : " + data[i].college + "%";
                                if (j == 8) return "研究所及以上 : " + data[i].graduate + "%";
                            });
                    }
                } else if (dotIsShining != 0) { //當有某資料點正在閃爍且滑鼠離該資料點的x軸距離大於10的時候
                    //讓閃爍的點恢復成原來的樣子
                    //透過filter篩選class裡的class，還原正確的顏色
                    d3.selectAll(".dots" + i)
                        .filter(".onLine0")
                        .attr('fill', function(d) {
                            return lineColor1;
                        });
                    d3.selectAll(".dots" + i)
                        .filter(".onLine1")
                        .attr('fill', function(d) {
                            return lineColor2;
                        });
                    d3.selectAll(".dots" + i)
                        .filter(".onLine2")
                        .attr('fill', function(d) {
                            return lineColor3;
                        });
                    d3.selectAll(".dots" + i)
                        .filter(".onLine3")
                        .attr('fill', function(d) {
                            return lineColor4;
                        });

                    d3.selectAll(".dots" + i)
                        .filter(".onLine4")
                        .attr('fill', function(d) {
                            return lineColor5;
                        });
                    d3.selectAll(".dots" + i)
                        .filter(".onLine5")
                        .attr('fill', function(d) {
                            return lineColor6;
                        });
                    d3.selectAll(".dots" + i)
                        .filter(".onLine6")
                        .attr('fill', function(d) {
                            return lineColor7;
                        });
                    d3.selectAll(".dots" + i)
                        .filter(".onLine7")
                        .attr('fill', function(d) {
                            return lineColor8;
                        });

                    d3.selectAll('.dots' + i)
                        .transition() //要是沒有這兩行，
                        .duration(shineDuration) //就算直接指定半徑恢復成圓半徑，還是看不見效果
                        .attr('r', originR);
                }

            }
            //設定跟著滑鼠跑的那條線從長度從y = 0 到畫布的最底
            d3.select('#flexibleLine')
                .style('opacity', function() {
                    if (mousePosOnLinechart[0] < (scaleX(data[0].x) + linechartMargin.left))
                        return 0;
                    else if (mousePosOnLinechart[0] > scaleX(data[data.length - 1].x) + linechartMargin.left + 10)
                        return 0;
                    else return 1;
                })
                .transition()
                .duration(10)
                .attr('x1', mousePosOnLinechart[0])
                .attr('y1', 0 + linechartMargin.top)
                .attr('x2', mousePosOnLinechart[0])
                .attr('y2', mousePosOnLinechart[1] + (linechartHeight - mousePosOnLinechart[1] + linechartMargin.top));
        }

    }




});