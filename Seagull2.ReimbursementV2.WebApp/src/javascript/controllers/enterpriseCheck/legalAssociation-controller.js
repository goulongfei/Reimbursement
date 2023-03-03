define(["app", "echarts"], function (app, echarts) {
    window.echarts = echarts;
    app.controller('legalAssociation_controller', ["$scope", "$http", "$location", "$stateParams", "$state", "wfWaiting", "seagull2Url", "$interval", "$sce", "$log", "sogModal", '$compile',
        function ($scope, $http, $location, $stateParams, $state, wfWaiting, seagull2Url, $interval, $sce, $log, sogModal, $compile) {

            $scope.paginationConf = {
                currentPage: 1,
                itemsPerPage: 5
            };

            $scope.init = function () {
                var timeSpan = null;
                var token = null;
                wfWaiting.show();
                var url = seagull2Url.getPlatformUrlBase() + '/Beneficiary/LegalAssociation';
                var body = {
                    Timespan: timeSpan,
                    CompanyName: $stateParams.companyNames,
                    Token: token
                };
                wfWaiting.show();
                $http.post(url, body).success(function (data) {
                    wfWaiting.hide();
                    $scope.data = JSON.parse(JSON.parse(data));
                    //获取有关联公司数
                    var companyStr = '', num = 0;
                    angular.forEach($scope.data.result.correlationships, function (v) {
                        if (!companyStr) {
                            companyStr += v.companyName + ',';
                            num += 1;
                        }
                        if (companyStr.indexOf(v.companyName) == -1) {
                            companyStr += v.companyName + ',';
                            num += 1;
                        }
                        if (companyStr.indexOf(v.relatedCompanyName) == -1) {
                            companyStr += v.relatedCompanyName + ',';
                            num += 1;
                        }
                    })
                    $scope.relationNum = num;
                    $scope.companyNum = $stateParams.companyNames.split(',').length;

                    $scope.initArray = $scope.data.result.correlationships;
                    $scope.paginationConf.totalItems = $scope.initArray.length;
                    $scope.result = $scope.initArray.slice(0, 5);
                    var arr = [];
                    var tarry = arr.push({ path: $scope.addRegExp($scope.result[0].path) });
                    $scope.showEchart(arr);
                })
                
                

                
            }

            //格式化字符串 对<-(...) 格式化为<-(...%)
            $scope.addRegExp = function (str) {
                var arr = str.split('<-'), str = arr[0];
                for (var i = 0; i < arr.length; i++) {
                    if (i >= 1 && i < arr.length) {
                        arr[i] = arr[i].replace(')', '%)')
                        str += '<-' + arr[i]
                    }
                }
                str = str.replace(/\)->/g, '%\)->');
                return str;
            }

            //详情查看
            $scope.showEcharts = function (item) {
                var arr = [];
                var tarry = arr.push({ path: $scope.addRegExp(item.path) });
                $scope.showEchart(arr);
            }

            //格式化字符串
            var decodeNameLink = function (fromStr) {
                var arr = fromStr.match(/\((.+?)%\)/g);//(自然人股东%)合肥讯飞产业投资合伙企业(有限合伙)  拿到['(自然人股东%)']
                if (!arr || arr.length == 0) {
                    return { value: fromStr }
                }
                for (var i = 0; i < arr.length; i++) {
                    var t = arr[i], targetArr = t.split('(');
                    if (targetArr.length > 2) {
                        arr[i] = "(" + targetArr[2];
                    }
                }
                if (arr && arr.length == 1) {
                    return {
                        value: fromStr.replace(arr[0], "").replace(arr[1], ""),
                        link: [arr[0].replace("(", '').replace("%)", '')],
                        num: fromStr.indexOf('(')
                    }
                }
                return {
                    value: fromStr.replace(arr[0], "").replace(arr[1], ""),
                    link: [arr[0].replace("(", '').replace("%)", ''), arr[1].replace("(", '').replace("%)", '')]
                }

            }

            //格式化字符串 返回html字符串
            function getInfor(item) {
                var str = '';
                tmpPath = item.path.replace(new RegExp("->", 'g'), "<-");
                tmpPathArr = tmpPath.split("<-");//["安徽讯飞联创信息科技有限公司","(董事%)张友国","(自然人股东%)合肥讯飞产业投资合伙企业(有限合伙)","(自然人股东%)刘庆峰","(自然人股东%)科大讯飞股份有限公司"]
                if (tmpPathArr && tmpPathArr.length > 0) {
                    for (var i = 0; i < tmpPathArr.length; i++) {
                        tmpPathItem = decodeNameLink(tmpPathArr[i]);
                        if (!tmpPathItem.link) str += '<a>' + tmpPathItem.value + '</a>';
                        //if (tmpPathItem.link && tmpPathItem.link.length == 2) {
                        if (tmpPathItem.link && tmpPathItem.link.length == 1) {
                            var obj;
                            if (!tmpPathItem.num) {
                                str += '<span class="beinvested"><span class="text">' + tmpPathItem.link[0] + '%</span></span><a>' + tmpPathItem.value + '</a>';
                            } else {
                                str += '<a>' + tmpPathItem.value + '</a><span class="right-line"><span class="text">' + tmpPathItem.link[0] + '%</span></span>';
                            }
                        }
                        if (tmpPathItem.link && tmpPathItem.link.length == 2) {
                            str += '<span  class="beinvested"><span class="text">' + tmpPathItem.link[0] + '%</span></span><a>' + tmpPathItem.value + '</a><span class="right-line"><span class="text">' + tmpPathItem.link[1] + '%</span></span>';
                        }
                    }
                }
                tmpPathItem = "";
                return str;
            }

            var dataLabel = {
                fontFamily: 'Microsoft YaHei',
                normal: {
                    show: true,
                    align: 'center',
                    lineHeight: 18,
                    color: '',
                    //formatter: function (params) {
                    //    var newName = '';
                    //    if (params.name.length > 7) {
                    //        newName = params.name.substring(0, 4) + '\n' + params.name.substring(4, 7) + '...';
                    //    } else if (params.name.length > 4) {
                    //        newName = params.name.substring(0, 4) + '\n' + params.name.substring(4, params.name.length);
                    //    } else {
                    //        newName = params.name;
                    //    }
                    //    return newName;
                    //}
                }
            }

            var dataLabelLarge = {
                fontFamily: 'Microsoft YaHei',
                normal: {
                    show: true,
                    align: 'center',
                    lineHeight: 18,
                    color: '',//文字颜色
                    formatter: function (params) {
                        var newName = '';
                        if (params.name.length > 10) {
                            newName = params.name.substring(0, 5) + '\n' + params.name.substring(5, 10) + '\n' + params.name.substring(10, params.name.length);
                        }else if (params.name.length > 5) {
                            newName = params.name.substring(0, 5) + '\n' + params.name.substring(5, params.name.length);
                        } else {
                            newName = params.name;
                        }
                        return newName;
                    }
                }
            }

            var dataLabelMiddleDark = {
                fontFamily: 'Microsoft YaHei',
                normal: {
                    show: true,
                    align: 'center',
                    lineHeight: 18,
                    color: '',
                    formatter: function (params) {
                        var newName = '';
                        if (params.name.length > 9) {
                            newName = params.name.substring(0, 5) + '\n' + params.name.substring(5, 9) + '...';
                        } else if (params.name.length > 5) {
                            newName = params.name.substring(0, 5) + '\n' + params.name.substring(5, params.name.length);
                        } else {
                            newName = params.name;
                        }
                        return newName;
                    }
                }
            }

            var itemStyleLarge = {
                color: '#56A3EE'
            }
            var itemStyleDark = {
                color: '#56A3EE'
            }

            var betweenC = {
                color: '#FA4460'
            }

            var linksLabel = {
                show: true,//显示连接字段
                formatter: function (arg) {
                    return arg.value;
                },
                fontSize: 11,
                color: "#555555"//自然人颜色设置
            }

            var dataList = [];
            var dataLinks = [];
            var tmpPath = '';
            var tmpPathArr = [];
            var itemPathArr = [];
            var tmpPathItem = '';

            var existDataList = function (name) {
                for (var i = 0; i < dataList.length; i++) {
                    if (dataList[i].name == name) {
                        return true
                    }
                }
                return false;
            }

            //生成echarts
            $scope.showEchart = function (array) {
                var dataList = [];
                var dataLinks = [];
                var tmpPath = '';
                var tmpPathArr = [];
                var itemPathArr = [];
                var tmpPathItem = '';
                angular.forEach(array, function (item) {
                    tmpPath = item.path.replace(new RegExp("->", 'g'), "<-");
                    tmpPathArr = tmpPath.split("<-");//["安徽讯飞联创信息科技有限公司","(董事%)张友国","(自然人股东%)合肥讯飞产业投资合伙企业(有限合伙)"]
                    if (tmpPathArr && tmpPathArr.length > 0) {
                        for (var i = 0; i < tmpPathArr.length; i++) {
                            tmpPathItem = decodeNameLink(tmpPathArr[i]);
                            itemPathArr.push(tmpPathItem.value);
                            if (tmpPathItem.link && tmpPathItem.link.length == 1) {
                                var obj;
                                if (!tmpPathItem.num) {
                                    obj = decodeNameLink(tmpPathArr[i - 1]);
                                } else {
                                    obj = decodeNameLink(tmpPathArr[i + 1]);
                                }
                                dataLinks.push({
                                    source: tmpPathItem.value,
                                    target: obj.value,
                                    value: tmpPathItem.link[0],
                                    label: linksLabel
                                })
                            }
                            if (tmpPathItem.link && tmpPathItem.link.length == 2) {
                                var obj = decodeNameLink(tmpPathArr[i - 1]);
                                dataLinks.push({
                                    source: tmpPathItem.value,
                                    target: obj.value,
                                    value: tmpPathItem.link[0],
                                    label: linksLabel
                                })
                                var obj2 = decodeNameLink(tmpPathArr[i + 1]);
                                dataLinks.push({
                                    source: tmpPathItem.value,
                                    target: obj2.value,
                                    value: tmpPathItem.link[1],
                                    label: linksLabel
                                })
                            }
                        }
                        item.pathArrList = itemPathArr;
                    }

                    tmpPath = '';
                    tmpPathArr = [];
                    itemPathArr = [];
                    tmpPathItem = "";
                });
                var cWidth = $('.container').width();
                var cHeight = cWidth * 3 / 4;
                var currentY = 0;
                var stepXLength = 0;
                var stepYlength = 120;
                function setCavansOptions(width, height) {
                    cWidth = width;
                    cHeight = height;
                }

                setCavansOptions(600, 800);
                currentY = cHeight / 2;
                var maxHeightCount = cHeight / stepYlength;

                if (array.length > maxHeightCount) {//放不下，从Y坐标0开始
                    //if (8 > maxHeightCount){
                    currentY = 0;
                } else {//放得下
                    if (array[0].pathArrList.length == 1) {
                        currentY = cHeight / 2;
                    } else if (array[0].pathArrList.length % 2 == 0) {
                        currentY = cHeight / 2 - 60 - (parseInt(array[0].pathArrList.length / 2) - 1) * 120
                    } else {
                        currentY = cHeight / 2 - parseInt(array[0].pathArrList.length + 1) / 2 * 120;
                    }
                }

                dataList.splice(0, 0, {
                    name: array[0].pathArrList[0],
                    x: 0,
                    y: cHeight / 2,
                    symbolSize: 80,
                    label: dataLabelLarge,
                    itemStyle: itemStyleLarge
                })
                dataList.splice(0, 0, {
                    name: array[0].pathArrList[array[0].pathArrList.length - 1],
                    x: cWidth,
                    y: cHeight / 2,
                    symbolSize: 80,
                    label: dataLabelLarge,
                    itemStyle: itemStyleLarge
                })

                function getYPosition(i, length, index) {
                    switch (array[0].pathArrList.length) {
                        case 1:
                            return tmpLineY;
                        case 2:
                            return i == 0 ? (tmpLineY - (Math.abs(i - parseInt((length + 1) / 2)) * 30)) : (tmpLineY + (Math.abs(i - parseInt((length + 1) / 2)) * 30))
                        default:
                            return tmpLineY + (Math.abs(i - parseInt(length / 2)) * 100)
                    }
                }
                var tmpLineY = 0;
                angular.forEach(array, function (item, index) {
                    var length = item.pathArrList.length;
                    tmpLineY = currentY;
                    console.log(currentY, parseInt(length / 2))
                    stepXLength = cWidth / (length == 3 ? 2 : length == 5 ? 4 : 6);
                    for (var i = 1; i < item.pathArrList.length - 1; i++) {
                        if (!existDataList(item.pathArrList[i])) {
                            dataList.push({
                                name: item.pathArrList[i],
                                x: stepXLength * i,
                                y: getYPosition(i, length, index),
                                symbolSize: (length == 5 && i == 2) || (length == 7 && (i == 2 || i == 4)) ? 80 : 60,
                                itemStyle: (length == 5 && i == 2) || (length == 7 && (i == 2 || i == 4)) ? itemStyleDark : betweenC,
                                label: (length == 5 && i == 2) || (length == 7 && (i == 2 || i == 4)) ? dataLabelMiddleDark : dataLabel,
                            })
                        }
                    }
                    currentY += stepYlength;
                    var myChart = echarts.init(document.getElementById('main'));
                    //label样式
                    var labelStyle = {
                        show: true,
                        //  fontSize: 12,
                        position: 'inside',
                        backgroundColor: '#ffffff',
                        symbol: "circle",
                        formatter: function (params) {
                            if (params.data.name.length < 10) {
                                return '{popup|' + params.data.name + '}'
                            } else if (params.data.name.length >= 10 && params.data.name.length < 13) {
                                return '{popupMid|' + params.data.name + '}'
                            } else {
                                return [
                                    '{popupbr|' + params.data.name.slice(0, 10) + '}',
                                    '{popupbr|' + params.data.name.slice(10) + '}'
                                ].join('\n')
                            }
                        },
                        rich: {
                            popup: {
                                align: 'center',
                                color: 'yellow',
                                backgroundColor: '#FA4460',
                                borderColor: '',
                                width: 120,
                                // lineHeight:60,
                                height: 40, //文字块的 width 和 height 指定的是内容高宽，不包含 padding。
                                fontSize: 13,
                                padding: 5,
                                //  borderWidth: 2
                            },
                            popupMid: {
                                align: 'center',
                                color: 'yellow',
                                backgroundColor: '#FA4460',
                                borderColor: '',
                                width: 160,
                                // lineHeight:60,
                                height: 60, //文字块的 width 和 height 指定的是内容高宽，不包含 padding。
                                fontSize: 14,
                                padding: 5,
                                //  borderWidth: 2
                            },
                            popupbr: {
                                align: 'center',
                                color: '#fff',
                                backgroundColor: '#FA4460',
                                width: 160,
                                lineHeight: 30,
                                height: 30,
                                fontSize: 14,
                                padding: 5,
                                //  borderWidth: 2
                            }
                        },
                    }

                    var positionLarge = [10, 20];
                    var formatterLarge = function (params) {
                        var newName = '';
                        if (params.name.length > 9) {
                            newName = params.name.substring(0, 5) + '\n' + params.name.substring(5, 9) + '...';
                        } else if (params.name.length > 5) {
                            newName = params.name.substring(0, 5) + '\n' + params.name.substring(5, params.name.length);
                        } else {
                            newName = params.name;
                        }
                        return newName;
                    }


                    var option = {
                        title: {
                            //标题
                            text: '股权关系图'
                        },
                        tooltip: {
                            //提示信息
                            formatter: function (arg1, arg2, arg3) {
                                if (arg1.dataType == 'node') {
                                    return arg1.data.name;
                                }
                                return arg1.data.source + "  -(" + arg1.data.value + ")->  " + arg1.data.target;
                            },
                        },
                        animationDurationUpdate: 1500,//数据更新动画的时长
                        animationEasingUpdate: 'backn',//数据更新动画的缓动效果
                        textStyle: {
                            //全局字体样式
                            color: '#fff',
                            fontFamily: "microsoft yahei",
                            width: 100,
                            lineHeight: 40,
                            verticalAlign: "middle",
                            align: 'center',
                        },
                        series: [
                            {
                                type: 'graph',//类型为关系数据
                                layout: 'none',
                                symbolSize: [100, 10],
                                roam: true,//是否开启鼠标缩放和平移漫游
                                // focusNodeAdjacency: false,
                                nodeScaleRatio: 0.3,//缩放比例
                                draggable: true,
                                symbol: "circle",//关系图节点标记的图形'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
                                edgeSymbol: ['circle', 'arrow'],//边两端的标记类型 三角箭头
                                edgeSymbolSize: [2, 10],//边两端的标记大小
                                //edgeLabel: {
                                //    formatter: '{b}',//{a}：系列名。{b}：数据名。{c}：数据值。
                                //    normal: {
                                //        textStyle: {
                                //            fontSize: 12,
                                //            color: 'blue'
                                //        }
                                //    }
                                //},
                                data: dataList,//关系图的节点数据列表
                                links: dataLinks,//节点间的关系数据
                                lineStyle: {//关系边的公用线条样式
                                    normal: {
                                        opacity: 0.9,//透明度
                                        width: 1.5,//线宽
                                        curveness: 0,//边的曲度，支持从 0 到 1 的值，值越大曲度越大。
                                        //color: "red"//连接线的颜色
                                    }
                                },
                                itemStyle: {//图形样式
                                    //color: 'blue',//图形样式
                                    //borderColor: 'red',//图形样式
                                    borderWidth: 1,//图形样式
                                },

                            }
                        ]
                    };


                    console.log(option);
                    myChart.setOption(option);
                })
            }

            $scope.init();

            //分页监听
            $scope.$watch("paginationConf.currentPage", function (newVal, oldVal) {
                if (oldVal == newVal) return;
                var i = newVal - 1;
                $scope.result = $scope.initArray.slice(i * 5, (i + 1) * 5);
               
                var arr = [];
                var tarry = arr.push({ path: $scope.addRegExp($scope.result[0].path) });
                $scope.showEchart(arr);

            });
        }]);
});