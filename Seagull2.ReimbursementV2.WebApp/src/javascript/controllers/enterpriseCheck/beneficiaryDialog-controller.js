define(["app"], function (app) {
    app.controller('beneficiaryDialog_controller', ["$scope", "$http", "$location", "$stateParams", "$state", "wfWaiting", "seagull2Url", "$interval", "$sce", "$log", "sogModal", '$compile','$timeout',
        function ($scope, $http, $location, $stateParams, $state, wfWaiting, seagull2Url, $interval, $sce, $log, sogModal, $compile, $timeout) {
            
            $scope.init = function () {
                var timeSpan = null;
                var token = null;
                wfWaiting.show();
                var url = seagull2Url.getPlatformUrlBase() + '/Beneficiary/GetBeneficiary';
                var body = {
                    Timespan: timeSpan,
                    CompanyName: $scope.companyName,
                    Token: token
                };
                $http.post(url, body).success(function (data) {
                    $scope.data = JSON.parse(JSON.parse(data));
                    $scope.beneficiaryArray = $scope.data.result;
                    var str = '', result = $scope.data.result;
                    for (var i = 0; i < result.breakThroughList.length; i++) {
                        str += '<tr class="text-center">';
                        var arr = result.breakThroughList[i].detailInfoList;
                        if (arr.length > 1) {
                            str += "<td rowspan=" + arr.length + ">" + (i + 1) + "</td><td rowspan=" + arr.length + ">" + result.breakThroughList[i].name + "</td><td rowspan=" + arr.length + ">" + result.breakThroughList[i].totalStockPercent + "</td>";
                            for (var j = 0; j < arr.length; j++) {
                                if (j >= 1) {
                                    str += '<tr class="text-center">';
                                }
                                str += '<td>' + arr[j].stockType + "</td><td>" + arr[j].breakthroughStockPercent + "</td><td>" + getInfor(arr[j]) + "</td></tr>";
                            }
                        } else {
                            str += "<td>" + (i + 1) + "</td><td>" + result.breakThroughList[i].name + "</td><td>" + result.breakThroughList[i].totalStockPercent + "</td><td>" + arr[0].stockType + "</td><td>" + arr[0].breakthroughStockPercent + "</td><td>" + getInfor(arr[0]) + "</td></tr>";
                        }

                    }
                    var ele = $compile(str)($scope);
                    $timeout(function () {
                        $("#talbe-list").html(str);
                        wfWaiting.hide();
                    }, 100)
                })
            //    $scope.data= {
            //    "status":"200",
            //    "msg":"查询成功",
            //    "result":{
            //        "companyName":"苏州朗动网络科技有限公司",
            //        "keyNo":"f625a5b661058ba5082ca508f99ffe1b",
            //        "findMatched":"Y",
            //        "operName":null,
            //        "remark":null,
            //        "breakThroughList":[
            //            {
            //                "name":"陈德强",
            //                "keyNo":"pb9ac28faba8285ca3d516ab6a91235f",
            //                "totalStockPercent":"44.924%",
            //                "detailInfoList":[
            //                    {
            //                        "level":1,
            //                        "shouldCapi":99.617,
            //                        "capitalType":"货币",
            //                        "breakthroughStockPercent":"33.03%",
            //                        "stockType":"直接",
            //                        "path":"陈德强(33.03%)->苏州朗动网络科技有限公司",
            //                        "stockPercent":"33.03%"
            //                    },{
            //                        "level":2,
            //                        "shouldCapi":84.000,
            //                        "capitalType":"货币",
            //                        "breakthroughStockPercent":"11.894%",
            //                        "stockType":"间接",
            //                        "path":"陈德强(84%)->苏州知彼信息科技中心(有限合伙)(14.16%)->苏州朗动网络科技有限公司",
            //                        "stockPercent":"84%"
            //                    }
            //                ]
							
            //            }
            //        ]
			
            //    }
	
            //}
                
        
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

            //格式化字符串 得到需要html
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
                                str += '<span class="right-line"><span class="text">' + tmpPathItem.link[0] + '%</span></span><a>' + tmpPathItem.value + '</a>';
                            } else {
                                str += '<a>' + tmpPathItem.value + '</a><span class="beinvested"><span class="text">' + tmpPathItem.link[0] + '%</span></span>';
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

            $scope.init();

        }]);
});