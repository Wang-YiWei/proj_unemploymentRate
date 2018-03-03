var dataIsChanging = 0;

d3.csv("unemployment_rate.csv", function (data) {
    data.forEach(function (d) {
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

    var minYear = d3.extent(data, function (it) {
            return it.year
        })[0],
        maxYear = d3.extent(data, function (it) {
            return it.year
        })[1];
    var minTotal = d3.extent(data, function (it) {
        return it.total
    })[0];
    var maxTotal = d3.extent(data, function (it) {
        return it.total
    })[1];
    var minX = d3.min(data, function (d) {
            return d.x
        }),
        maxX = d3.max(data, function (d) {
            return d.x
        }),
        minY = 1.5,
        maxY = 6;

    //console.log(minYear);


    var linechartMargin = {
        top: 30,
        right: 50,
        bottom: 70,
        left: 10
    };
    var linechartWidth = 960 - linechartMargin.left - linechartMargin.right;
    var linechartHeight = 600 - linechartMargin.top - linechartMargin.bottom;
    var infoDivWidth = 300;

    var scaleX = d3.scale.linear()
        .range([0, linechartWidth])
        .domain([minX, maxX]);

    var scaleX2 = d3.scale.linear()
        .rangeRound([0, linechartWidth])
        .domain([minYear, maxYear]);

    var scaleY = d3.scale.linear()
        .range([linechartHeight, 0]) //d3 Y座標是越下越大,所以反過來比較直覺
        .domain([minY, maxY]);

    // --- 創造畫布
    var linechartsvg = d3.select('#lineChartSvg');
    // .append('svg')
    // .attr('id', 'lineChartSvg');

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
            .x(function (d) {
                return scaleX(d.x);
            })
            .y(function (d) {
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
    var gridInterval = 5;

    var axisX = d3.svg.axis()
        .scale(scaleX2)
        .orient("bottom") //用axis.orient 來定義座標文字的上下左右位置
        .ticks(gridInterval)
        .tickFormat(function (d) {
            return d + '年';
        });

    var axisY = d3.svg.axis()
        .scale(scaleY)
        .orient("left") //用axis.orient 來定義座標文字的上下左右位置
        .ticks(gridInterval)
        .tickFormat(function (d) {
            return d + '%';
        });

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
    var lineColor1 = '#FF7F5B'; // 5
    var lineColor2 = '#BC5148'; // 8
    var lineColor3 = 'green'; // 4
    var lineColor4 = '#9BB4DA'; // 2
    var lineColor5 = '#FFBD39'; // 3
    var lineColor6 = '#C238B5'; // 7
    var lineColor7 = '#76B39D'; //1
    var lineColor8 = 'blue'; // 6

    var lineColors = [lineColor1, lineColor2, lineColor3, lineColor4, lineColor5, lineColor6, lineColor7, lineColor8, ];

    for (var i = 0; i < 8; ++i) {
        linechartsvg.append('path')
            .attr("class", "historylines" + i)
            .attr({
                'd': lines[i](data),
                'stroke': function (d) {
                    return lineColors[i];
                },
                'stroke-width': 2,
                'transform': 'translate(' + (linechartMargin.left + infoDivWidth) + ', ' + (linechartMargin.top) + ')', //用translate挑整axisX,axisY的位置
                'fill': 'none',
                'opacity': 0 //先讓一開始的opacity是0，之後fade in
            });
    }

    //繪出X軸
    linechartsvg.append('g')
        .call(axisX) //call axisX
        .attr({
            'class': 'axisX',
            'fill': 'none',
            'stroke': 'rgba(170,170,170,1)',
            'transform': 'translate(' + (linechartMargin.left + infoDivWidth) + ', ' + (linechartHeight + linechartMargin.top) + ')' //用translate挑整axisX,axisY的位置
        })
        .selectAll('text')
        .attr({
            'fill': '#000',
            'stroke': 'none',
        }).style({
            'font-size': '20px'
        });

    //繪出Y軸
    linechartsvg.append('g')
        .call(axisY) //call axisY
        .attr({
            'class': 'axisY',
            'fill': 'none',
            'stroke': 'rgba(170,170,170,1)',
            'transform': 'translate(' + (linechartMargin.left + infoDivWidth) + ',' + (linechartMargin.top) + ')' //用translate挑整axisX,axisY的位置
        })
        .selectAll('text')
        .attr({
            'class': 'linechartYtext',
            'fill': '#000',
            'stroke': 'none',
        }).style({
            'font-size': '20px'
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
    var originR = 4,
        bigR = 6;
    var dots = [8]; //store 4 kind of value's array.
    var dotName = ['dots1', 'dots2', 'dots3', 'dots4', 'dots5', 'dots6', 'dots7', 'dots8']
    for (var j = 0; j < 8; ++j) {
        dots[j] = linechartsvg.selectAll(dotName[j])
            .data(data)
            .enter()
            .append('g')
            .append('circle')
            .attr('class', function (d, i) {
                //console.log("dots" + i + " onLine" + j)
                return "dots" + i + " onLine" + j;
            })
            .attr('cx', function (d) {
                return scaleX(d.x) + linechartMargin.left + infoDivWidth;
            })
            .attr('cy', function (d) {
                if (j == 0) return scaleY(d.total) + linechartMargin.top;
                else if (j == 1) return scaleY(d.primary) + linechartMargin.top;
                else if (j == 2) return scaleY(d.junior) + linechartMargin.top;
                else if (j == 3) return scaleY(d.senior) + linechartMargin.top;
                else if (j == 4) return scaleY(d.vocational) + linechartMargin.top;
                else if (j == 5) return scaleY(d.specialist) + linechartMargin.top;
                else if (j == 6) return scaleY(d.college) + linechartMargin.top;
                else if (j == 7) return scaleY(d.graduate) + linechartMargin.top;
            })
            .attr('fill', function (d) {
                return lineColors[j];
            })
            .attr('r', originR)
            .attr("opacity", 0);
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
            .attr('dy', function () {
                return 20 * (j + 1)
            })
            .text("")
            .attr('font-family', 'Noto Sans TC');
    }

    //跟著滑鼠跑的那條線的Function
    var dotIsShining = 0; //判斷是否有某資料點正在閃爍
    var shineDistance = 10;

    //讓線跟點淡入
    var order = [6, 3, 2, 4, 0, 7, 5, 1];
    for (var i = 0; i < 8; i++) {
        d3.select(".historylines" + order[i]).transition().duration(500).delay(300 * i).style("opacity", function () {
            return i == 4 ? 0 : 1;
        });
        for (var j = 0; j < data.length; ++j) {
            d3.selectAll(".dots" + j)
                .filter(".onLine" + order[i])
                .transition()
                .duration(500)
                .delay(300 * i)
                .style("opacity", function () {
                    return i == 4 ? 0 : 1;
                });
        }
    }

    dataIsChanging = 1;
    setTimeout(function () {
        dataIsChanging = 0;
    }, 2500);

    function linechartMove(d, i) {
        if (dataIsChanging == 0) {
            mousePosOnLinechart = d3.mouse(this);

            //show data
            for (var i = 0; i < data.length; ++i) {
                if (Math.abs(mousePosOnLinechart[0] - (scaleX(data[i].x) + linechartMargin.left + infoDivWidth)) < shineDistance) {
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
                        // .delay(10)
                        .attr('opacity', 0.4)
                        .attr("x", function () {
                            return linechartMargin.left + 50;
                        })
                        .attr("y", function () {
                            return linechartMargin.top;
                        });
                    //顯示資料塊裡的文字
                    for (var j = 0; j < 9; ++j) {
                        d3.select('.' + tipText[j])
                            .transition()
                            // .delay(10)
                            .attr("opacity", 1)
                            .attr("x", function () {
                                return linechartMargin.left + 50;
                            })
                            .attr("y", function () {
                                return linechartMargin.top;
                            })
                            .text(function (d) {
                                if (j == 0) return data[i].year + " 年 各教育程度失業率";
                                else if (j == 1) return "平均 : " + data[i].total + "%";
                                else if (j == 2) return "小學及以下 : " + data[i].primary + "%";
                                else if (j == 3) return "國中 : " + data[i].junior + "%";
                                else if (j == 4) return "高中 : " + data[i].senior + "%";
                                else if (j == 5) return "高職 : " + data[i].vocational + "%";
                                else if (j == 6) return "專科 : " + data[i].specialist + "%";
                                else if (j == 7) return "大學 : " + data[i].college + "%";
                                else if (j == 8) return "研究所及以上 : " + data[i].graduate + "%";
                            });
                    }
                } else if (dotIsShining != 0) { //當有某資料點正在閃爍且滑鼠離該資料點的x軸距離大於10的時候
                    //讓閃爍的點恢復成原來的樣子
                    //透過filter篩選class裡的class，還原正確的顏色
                    for (var a = 0; a < 8; a++) {
                        d3.selectAll(".dots" + i)
                            .filter(".onLine" + a)
                            .attr('fill', function (d) {
                                return lineColors[a];
                            });
                    }
                    d3.selectAll('.dots' + i)
                        .transition() //要是沒有這兩行，
                        .duration(shineDuration) //就算直接指定半徑恢復成圓半徑，還是看不見效果
                        .attr('r', originR);
                }

            }
            //設定跟著滑鼠跑的那條線從長度從y = 0 到畫布的最底
            d3.select('#flexibleLine')
                .style('opacity', function () {
                    if (mousePosOnLinechart[0] < (scaleX(data[0].x) + linechartMargin.left + infoDivWidth))
                        return 0;
                    else if (mousePosOnLinechart[0] > scaleX(data[data.length - 1].x) + linechartMargin.left + infoDivWidth + 10)
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

    var legendX = 70;
    var legendY = 270;
    var legendWidth = 50;
    var legendHeight = 10;
    var legendOffset = 30;


    var checkboxWidth = 100;
    var checkboxHeight = 30;
    var checkboxOffset = 40;

    var elementOffsetX = 10;
    var elementOffsetY = 6;

    var all_type = ["\"total\"", "\"primary\"", "\"junior\"", "\"senior\"", "\"vocational\"", "\"specialist\"", "\"college\"", "\"graduate\""];
    var all_type2 = ["平均", "國小", "國中", "高中", "高職", "專科", "大學", "研究所"];
    var all_type3 = ["total", "primary", "junior", "senior", "vocational", "specialist", "college", "graduate"];

    for(var i = 0 ; i < 8 ; i++){
        linechartsvg.append("text")
        .attr("transform", function(){
            var valY;
            if (i == 0) valY =  parseInt(scaleY(data[5].total))+linechartMargin.top;
                else if (i == 1) valY =  parseInt(scaleY(data[5].primary))+linechartMargin.top;
                else if (i == 2) valY =  parseInt(scaleY(data[5].junior))+linechartMargin.top;
                else if (i == 3) valY =  parseInt(scaleY(data[5].senior))+linechartMargin.top;
                else if (i == 4) valY =  parseInt(scaleY(data[5].vocational))+linechartMargin.top;
                else if (i == 5) valY =  parseInt(scaleY(data[5].specialist))+linechartMargin.top;
                else if (i == 6) valY =  parseInt(scaleY(data[5].college))+linechartMargin.top;
                else if (i == 7) valY =  parseInt(scaleY(data[5].graduate))+linechartMargin.top;
            return "translate(" + (linechartWidth+infoDivWidth + 15) + "," + valY + ")";
        })
        // .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", function(){
            return lineColors[i];
        })
        .text(function(){
            return all_type2[i];
        });
    }
    

    var legend = linechartsvg.selectAll('.legend')
        .data(all_type2)
        .enter().append('g')
        .attr("class", "legends")
        .attr("transform", function (d, i) {
            {
                return "translate(0," + i * legendOffset + ")"
            }
        })

    legend.append('rect')
        .attr("x", legendX)
        .attr("y", legendY)
        .attr("id", function (d, i) {
            //console.log("legend" + i);
            return "legend" + i;
        })
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", function (d, i) {
            return lineColors[i];
        })

    d3.select("#legend0").attr("opacity", 0);

    // checkbox
    for (var k = 0; k < 8; k++) {
        if (k != 0) {
            linechartsvg.append("foreignObject")
                .attr("x", legendX + legendWidth + elementOffsetX)
                .attr("y", legendY + legendOffset * k - elementOffsetY)
                .attr("width", checkboxWidth)
                .attr("height", checkboxHeight)
                .append("xhtml:body")
                .html("<form><input type=checkbox id=" + all_type[k] + "name=education value=" + all_type[k] + " checked><label for=" + all_type[k] + ">" + all_type2[k] + "</label></form>")
                .on("click", update_line);
        } else {
            linechartsvg.append("foreignObject")
                .attr("x", legendX + legendWidth + elementOffsetX)
                .attr("y", legendY + legendOffset * k - elementOffsetY)
                .attr("width", checkboxWidth)
                .attr("height", checkboxHeight)
                .append("xhtml:body")
                .html("<form><input type=checkbox id=" + all_type[k] + "name=education value=" + all_type[k] + "><label for=" + all_type[k] + ">" + all_type2[k] + "</label></form>")
                .on("click", update_line);
        }
    }

    function update_line() {
        for (var i = 0; i < 8; i++) {
            if (d3.select("#" + all_type3[i]).property("checked")) {
                d3.select(".historylines" + i).style("opacity", 1);
                d3.select("#legend" + i).attr("opacity", 1);
                for (var j = 0; j < data.length; ++j) {
                    d3.selectAll(".dots" + j)
                        .filter(".onLine" + i)
                        .style("opacity", 1);
                }
            } else {
                d3.select(".historylines" + i).style("opacity", 0);
                d3.select("#legend" + i).attr("opacity", 0);
                for (var j = 0; j < data.length; ++j) {
                    d3.selectAll(".dots" + j)
                        .filter(".onLine" + i)
                        .style("opacity", 0);
                }
            }
        }

    }

});