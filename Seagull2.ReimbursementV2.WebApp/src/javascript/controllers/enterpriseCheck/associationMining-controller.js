define(["app", "echarts"], function (app, echarts) {
    window.echarts = echarts;
    app.controller('associationMining_controller', ["$scope", "$http", "$location", "$stateParams", "$state", "wfWaiting", "seagull2Url", "$interval", "$sce", "$log", "sogModal", '$compile',
        function ($scope, $http, $location, $stateParams, $state, wfWaiting, seagull2Url, $interval, $sce, $log, sogModal, $compile) {


            $scope.paginationConf = {
                currentPage: 1,
                itemsPerPage: 5
            };

            //初始化方法
            $scope.init = function () {
                var timeSpan = null;
                var token = null;
                var url = seagull2Url.getPlatformUrlBase() + '/Beneficiary/Association';
                var body = {
                    Timespan: timeSpan,
                    CompanyName: $stateParams.companyNames,
                    Token: token
                };
                wfWaiting.show();
                $http.post(url, body).success(function (data) {
                    wfWaiting.hide();
                    if (!data || data === '""') { return; }
                    data = JSON.parse(JSON.parse(data));
                    //获取有关联公司数
                    var companyStr = '', num = 0;
                    angular.forEach(data.result.relationships, function (v) {
                        if (!companyStr) {
                            companyStr += v.startCompanyName + ',';
                            num += 1;
                        }
                        if (companyStr.indexOf(v.startCompanyName) == -1) {
                            companyStr += v.startCompanyName + ',';
                            num += 1;
                        }
                        if (companyStr.indexOf(v.endCompanyName) == -1) {
                            companyStr += v.endCompanyName + ',';
                            num += 1;
                        }
                    })
                    $scope.relationNum = num;
                    $scope.companyNum = $stateParams.companyNames.split(',').length;

                    $scope.initArray = data.result.relationships;
                    $scope.paginationConf.totalItems = $scope.initArray.length;
                    $scope.result = $scope.initArray.slice(0, 5);
                    var str = '';//result=data.result;
                    for (var i = 0; i < $scope.result.length; i++) {
                        str += '<tr class="text-center"><td>' + (i + 1) + '</td><td><a style="color:#0C83E2" ng-click=showDetail(' + i + ')>查看</a></td><td>' + $scope.result[i].startCompanyName + '</td><td>' + $scope.result[i].level + '</td><td>' + $scope.result[i].endCompanyName + '</td><td>' + $scope.result[i].relatedName + '</td><td>' + getInfor($scope.result[i]); +'</td></tr>';
                    }
                    var ele = $compile(str)($scope);
                    $("#talbe-list").html(ele);
                    var arr = [];

                    var tarry = arr.push({ path: $scope.result[0].path });
                    $scope.showEchart(arr);
                })


            }

            //查看详情
            $scope.showDetail = function (i) {
                var arr = [];
                var tarry = arr.push({ path: $scope.result[i].path });
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

            //格式化字符串 添加左右指向
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

            //显示设置
            var dataLabel = {
                fontFamily: 'Microsoft YaHei',
                normal: {
                    show: true,
                    align: 'center',
                    lineHeight: 18,
                    color: '#8F9399',
                    formatter: function (params) {
                        var newName = '';
                        if (params.name.length > 7) {
                            newName = params.name.substring(0, 4) + '\n' + params.name.substring(4, 7) + '...';
                        } else if (params.name.length > 4) {
                            newName = params.name.substring(0, 4) + '\n' + params.name.substring(4, params.name.length);
                        } else {
                            newName = params.name;
                        }
                        return newName;
                    }
                }
            }

            //显示设置
            var dataLabelLarge = {
                fontFamily: 'Microsoft YaHei',
                normal: {
                    show: true,
                    align: 'center',
                    lineHeight: 18,
                    color: '#F2784B',//文字颜色
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

            //显示设置
            var dataLabelMiddleDark = {
                fontFamily: 'Microsoft YaHei',
                normal: {
                    show: true,
                    align: 'center',
                    lineHeight: 18,
                    color: '#606266',
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
                color: 'transparent',
                borderColor: '#F2784B',
            }
            var itemStyleDark = {
                color: 'transparent',
                borderColor: '#606266',
            }
            var linksLabel = {
                show: true,//显示连接字段
                formatter: function (arg) {
                    return arg.value;
                },
                fontSize: 11,
                color: "#C0C4CC"//自然人颜色设置
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
                                    value: tmpPathItem.link[0] + '%',
                                    label: linksLabel
                                })
                            }
                            if (tmpPathItem.link && tmpPathItem.link.length == 2) {
                                var obj = decodeNameLink(tmpPathArr[i - 1]);
                                dataLinks.push({
                                    source: tmpPathItem.value,
                                    target: obj.value,
                                    value: tmpPathItem.link[0] + '%',
                                    label: linksLabel
                                })
                                var obj2 = decodeNameLink(tmpPathArr[i + 1]);
                                dataLinks.push({
                                    source: tmpPathItem.value,
                                    target: obj2.value,
                                    value: tmpPathItem.link[1] + '%',
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
                                itemStyle: (length == 5 && i == 2) || (length == 7 && (i == 2 || i == 4)) ? itemStyleDark : '',
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
                        backgroundColor: 'pink',
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
                                backgroundColor: 'blue',
                                borderColor: 'green',
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
                                backgroundColor: 'blue',
                                borderColor: 'green',
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
                                backgroundColor: 'blue',
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
                        animationEasingUpdate: 'quinticInOut',//数据更新动画的缓动效果
                        textStyle: {
                            //全局字体样式
                            color: '#606266',
                            fontFamily: "microsoft yahei",
                            width: 60,
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
                                edgeLabel: {
                                    formatter: '{b}',//{a}：系列名。{b}：数据名。{c}：数据值。
                                    normal: {
                                        textStyle: {
                                            fontSize: 12,
                                            color: 'black'
                                        }
                                    }
                                },
                                data: dataList,//关系图的节点数据列表
                                links: dataLinks,//节点间的关系数据
                                lineStyle: {//关系边的公用线条样式
                                    normal: {
                                        opacity: 0.9,//透明度
                                        width: 1.5,//线宽
                                        curveness: 0,//边的曲度，支持从 0 到 1 的值，值越大曲度越大。
                                        color: "#C0C4CC"//连接线的颜色
                                    }
                                },
                                itemStyle: {//图形样式
                                    color: 'transparent',//图形样式
                                    borderColor: '#8F9399',//图形样式
                                    borderWidth: 1,//图形样式
                                },

                            }
                        ]
                    };
                    var lastClickNode = '';

                    //注册点击事件
                    myChart.on("click", function (params) {//被点击的事件
                        if (lastClickNode && lastClickNode.seriesId == params.seriesId && lastClickNode.seriesName == params.seriesName &&
                            lastClickNode.seriesIndex == params.seriesIndex && lastClickNode.dataIndex == params.dataIndex) {
                            setItemUnFocus(params);
                            lastClickNode = ''
                        } else {
                            lastClickNode = params;
                            if (params && params.dataType == 'node') {
                                setItemFocus(params);
                            } else {
                                setItemUnFocus();
                            }
                        }

                    })
                    function setItemFocus(params) {//高亮显示
                        if (!params) return
                        myChart.dispatchAction({
                            type: 'focusNodeAdjacency',
                            seriesId: params.seriesId, // 使用 seriesId 或 seriesIndex 或 seriesName 来定位 series.
                            seriesIndex: params.seriesIndex,
                            seriesName: params.seriesName || '',
                            dataIndex: params.dataIndex // 使用 dataIndex 来定位节点。
                        })
                    }

                    function setItemUnFocus() {//取消高亮
                        if (myChart) {
                            myChart.dispatchAction({
                                type: 'unfocusNodeAdjacency',
                            })
                        }
                    }
                    myChart.setOption(option);
                })
            }

            $scope.init();

            $scope.$watch("paginationConf.currentPage", function (newVal, oldVal) {
                if (oldVal == newVal) return;
                var i = newVal - 1, str = '';
                $scope.result = $scope.initArray.slice(i * 5, (i + 1) * 5);
                for (var i = 0; i < $scope.result.length; i++) {
                    str += '<tr class="text-center"><td>' + (i + 1) + '</td><td><a style="color:#0C83E2" ng-click=showDetail(' + i + ')>查看</a></td><td>' + $scope.result[i].startCompanyName + '</td><td>' + $scope.result[i].level + '</td><td>' + $scope.result[i].endCompanyName + '</td><td>' + $scope.result[i].relatedName + '</td><td>' + getInfor($scope.result[i]); +'</td></tr>';
                }
                $("#talbe-list").empty();
                var ele = $compile(str)($scope);
                $("#talbe-list").html(ele);
                var arr = [];
                var tarry = arr.push({ path: $scope.result[0].path });
                $scope.showEchart(arr);

            });

        }]);
});