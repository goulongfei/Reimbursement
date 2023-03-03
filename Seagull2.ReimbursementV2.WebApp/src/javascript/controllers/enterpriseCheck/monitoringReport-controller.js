define(
    [
        'app',
        'echarts',
        'javascript/controllers/enterpriseCheck/judicialDetail-controller.js'
], function (app, echarts) {
    window.echarts = echarts;
        app.controller('monitoringReport_controller', ["$scope", "$http", "$location", "$stateParams", "$state", "wfWaiting", "seagull2Url", "$interval", "$sce", "$log", "sogModal", '$compile', '$timeout',
            function ($scope, $http, $location, $stateParams, $state, wfWaiting, seagull2Url, $interval, $sce, $log, sogModal, $compile, $timeout) {

                $scope.init = function () {
                    var myChart = echarts.init(document.getElementById('main'));
                    var colors = ['#5793f3', '#d14a61', '#675bba'];
                    option = {
                        color: colors,

                        tooltip: {
                            trigger: 'none',
                            axisPointer: {
                                type: 'cross'
                            }
                        },
                        legend: {
                            data: ['裁判文书', '开庭公告']
                        },
                        grid: {
                            top: 70,
                            bottom: 50
                        },
                        xAxis: [
                            {
                                type: 'category',
                                axisTick: {
                                    alignWithLabel: true
                                },
                                axisLine: {
                                    onZero: false,
                                    lineStyle: {
                                        color: colors[1]
                                    }
                                },
                                axisPointer: {
                                    label: {
                                        formatter: function (params) {
                                            return '降水量  ' + params.value
                                                + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                                        }
                                    }
                                },
                                data: ["2016-1", "2016-2", "2016-3", "2016-4", "2016-5", "2016-6", "2016-7", "2016-8", "2016-9", "2016-10", "2016-11", "2016-12"]
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],

                        series: [
                            {
                                name: '裁判文书',
                                type: 'line',
                                data: [0, 2, 19, 2, 0],
                                smooth: 0.4,
                            },
                            {
                                name: '开庭公告',
                                type: 'line',
                                data: [0, 2, 3, 8, 0, 0, 0, 2, 3, 0],
                                smooth: 0.4,
                            }
                        ]
                    };
                    myChart.setOption(option);
                }

                $scope.risk = function () {
                    var Chart = echarts.init(document.getElementById('risk'));
                    var colors = ['#5793f3', '#d14a61', '#675bba'];
                    option = {
                        color: colors,

                        tooltip: {
                            trigger: 'none',
                            axisPointer: {
                                type: 'cross'
                            }
                        },
                        legend: {
                            data: ['警示信息', '高风险信息', '良好信息', '提示信息']
                        },
                        grid: {
                            top: 70,
                            bottom: 50
                        },
                        xAxis: [
                            {
                                type: 'category',
                                axisTick: {
                                    alignWithLabel: true
                                },
                                axisLine: {
                                    onZero: false,
                                    lineStyle: {
                                        color: colors[1]
                                    }
                                },
                                axisPointer: {
                                    label: {
                                        formatter: function (params) {
                                            return '降水量  ' + params.value
                                                + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                                        }
                                    }
                                },
                                data: ["2016-1", "2016-2", "2016-3", "2016-4", "2016-5", "2016-6", "2016-7", "2016-8", "2016-9", "2016-10", "2016-11", "2016-12"]
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],

                        series: [
                            {
                                name: '警示信息',
                                type: 'line',
                                data: [0, 2, 19, 2, 0],
                                smooth: 0.4,
                            },
                            {
                                name: '高风险信息',
                                type: 'line',
                                data: [0, 2, 3, 8, 0, 0, 0, 2, 3, 0],
                                smooth: 0.4,
                            },
                            {
                                name: '良好信息',
                                type: 'line',
                                data: [0, 2, 4, 5, 0, 6, 0, 2, 3, 0],
                                smooth: 0.4,
                            },
                            {
                                name: '提示信息',
                                type: 'line',
                                data: [0, 2, 2, 5, 0, 3, 0, 2, 1, 0],
                                smooth: 0.4,
                            }
                        ]
                    };
                    Chart.setOption(option);
                }

                $scope.setDynamic = function () {
                    var chartDynamic = echarts.init(document.getElementById('dynamic'));
                    option = {
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        series: [
                            {
                                name: '姓名',
                                type: 'pie',
                                radius: '55%',
                                center: ['50%', '50%'],
                                data: [{ name: '赵', value: 109 }, { name: '李', value: 100 }],
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    };
                    chartDynamic.setOption(option);



                }

                $scope.setEnterprise = function () {
                    var enterprise = echarts.init(document.getElementById('enterprise'));
                    option = {
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },

                        series: [
                            {
                                name: '姓名',
                                type: 'pie',
                                radius: '55%',
                                center: ['50%', '50%'],
                                data: [{ name: '赵', value: 109 }, { name: '李', value: 100 }],
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    };

                    enterprise.setOption(option);
                }

                //详情查看
                $scope.showDetail = function () {
                    $scope.startTime = new Date(new Date().getTime() - 1000 * 24 * 3600 * 6);
                    $scope.startTime = new Date(new Date());
                    var addr = "./views/enterpriseCheck/judicialDetail.html";
                    var template = '<div ng-include="\'' + addr + '\'" ></div>';
                    var promise = sogModal.openDialog(template, "司法诉讼详情", 'judicialDetail_controller', $scope, { startTime: $scope.startTime, endTime: $scope.endTime });
                }

                //生成4个echarts
                $scope.init();
                $scope.risk();
                $scope.setDynamic();
                $scope.setEnterprise();
            }]);
    });