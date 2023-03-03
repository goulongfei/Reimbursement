define(['app', 'echarts'], function (app, echarts) {
    //普通柱状图
    app.directive("barEchart", function () {
        return {
            restrict: "AE",
            scope: {
                opt: '=', 
                data: '=', 
            },
            template: "<div style='margin-left:0px;'><div class='col-xs-12 charts-box' style='height:230px;padding:0;'></div> <div class='col-xs-12' style='padding:0;'></div> </div>",
            replace: true,
            link: function (scope, iElement, iAttr) { 
                var charts = echarts.init($(".charts-box", iElement)[0]);
                var option = {
                    color: ['#3398DB'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {// 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'// 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '5%',
                        right: '5%',
                        top: '3%',
                        bottom: '2%',
                    },
                    xAxis: [
                        {
                            show: false,
                            type: 'category',
                            data: scope.opt,
                            nameGap: 20,
                            scale: false,
                            axisLine: {
                                show: false,
                            },
                        }
                    ],
                    yAxis: [
                        {
                            show: false,
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '金额',
                            type: 'bar',
                            barWidth: '20%',
                            data: scope.data
                        }
                    ]
                };
                //渲染图表
                if (option && typeof option === "object") {
                    charts.setOption(option, true);
                }
            }
        }
    });

    
    app.directive("ellipseEchart", function () {
        return {
            restrict: "AE",
            scope: {
                opt: '=', 
                data: '=', 
            },
            template: "<div style='margin-left:0px;'><div class='col-xs-12 charts-box' style='height:230px;padding:0;'></div> <div class='col-xs-12' style='padding:0;'></div> </div>",
            replace: true,
            link: function (scope, iElement, iAttr) { 
                //默认颜色
               // var color =  ["#70AD47", "#FFC000", "#ED7D31"];
                var charts = echarts.init($(".charts-box", iElement)[0]);
                var option = {
                       // title: {
                       //     text: scope.opt.title,
                       //     top: 5,
                       //     x: 'center',
                       //     textStyle: {
                       //         fontSize: 15,
                       //         fontStyle: 'normal',
                       //         fontWeight: 'bolder'
                       //     }
                       // },
                        color: scope.opt.color,
                        tooltip: {
                            trigger: 'item',
                            formatter: "{b} : {c} ({d}%)"
                        },
                        series: [
                            {
                                name: '各项明细数据',
                                type: 'pie',
                                top : 20,
                                radius: [65, 80],
                                label: {
                                    normal: {
                                        formatter: '{d}%',
                                        color: '#333',
                                        textStyle: {
                                            fontWeight: 'normal',
                                            fontSize: 13
                                        }
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        label: {
                                            position: 'outside', // 在 label 位置 设置为'outside'的时候会显示视觉引导线。 
                                            show: true,
                                        },
                                        labelLine: {
                                            show: true,
                                            length: 20,
                                            length2: 30,
                                        }
                                    }
                                },
                                data: scope.data
                            },
                        ]
                    };
               

                //渲染图表
                if (option && typeof option === "object") {
                    charts.setOption(option, true);
                }
            }
        }
    });
})
 