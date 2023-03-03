define([
    'angular',
    'app'
], function (angular, app) {
    // opts 配置
    /*
     opts = {

    }
     */

    //查询供应商
    app.directive("enterpriseShow", function () {
        return {
            restrict: "AE",
            scope: {
                data: "=",
                readOnly: "=",
            },
            templateUrl: "htmlTemplate/controlTemplate/common/enterpriseShowInfo.html",
            replace: true,
            transclude: false,
            controller: ["$scope", "sogModal", "seagull2Url", 'wfWaiting', "$http", "$window", "configure", "$compile", "$timeout", "$injector", function ($scope, sogModal, seagull2Url, wfWaiting, $http, $window, configure, $compile, $timeout, $injector) {
                $scope.companyItems = [];
                angular.forEach($scope.data, function (v) {
                    var supplier = {
                        supplierCode: v.supplierCode,
                        companyName: v.supplierName,
                    }
                    $scope.companyItems.push(supplier);
                })

                 //初始化供应商关联关系查询结果
                $scope.initenterpriseCheck = function (companyItems) {
                    if (companyItems.length <= 1) {
                        sogModal.openAlertDialog("提示", "最少选择两个公司");
                        return;
                    }
                    var url = seagull2Url.getPlatformUrl('/GetRelationShip') + '?r=' + Math.random();
                    var timeSpan = null;
                    var token = null;
                    var body = {
                        Timespan: timeSpan,
                        CompanyCollcetion: companyItems,
                        Token: token,
                        PageIndex: 1,
                        PageSize: 10,
                        code: 4
                    };
                    $scope.isLoaded = false;
                    $http.post(url, body).success(function (data) {
                        $scope.isLoaded = true;
                        $scope.infors = data.companyCollcetion;
                    }).error(function () {
                        $scope.isLoaded = false;
                    })
                };
                $scope.initenterpriseCheck($scope.companyItems);
                
                 //查询供应商共同参与投标数据
                $scope.togetherTenderCheck = function (companyItems) {
                    if (companyItems.length <= 1) {
                        sogModal.openAlertDialog("提示", "最少选择两个公司");
                        return;
                    }
                    var url = seagull2Url.getPlatformUrl('/Beneficiary/GetTogetherTenderTimesInfo') + '?r=' + Math.random();
                    $scope.tenderTimesLoaded = false;
                    $http.post(url, companyItems).success(function (data) {
                        $scope.tenderTimesLoaded = true;
                        $scope.tenderTimesInfors = data;
                    }).error(function () {
                        $scope.tenderTimesLoaded = false;
                    })
                };
                $scope.togetherTenderCheck($scope.companyItems);

                //关联关系挖掘 companyName：公司名称(至少两家企业)
                $scope.showDetail = function (array) {
                    var str = "";
                    angular.forEach(array, function (v) {
                        str += v.companyName + ","
                    })
                    str = str.substring(0, str.length - 1);
                    var url = "default.htm#/associationMining/" + str;
                    window.open(url, '_blank');
                }

                // 受益人详情
                $scope.beneficiaryIfor = function (item) {
                    var addr = "./views/enterpriseCheck/beneficiaryDialog.html";
                    var template = '<div ng-include="\'' + addr + '\'" ></div>';

                    var promise = sogModal.openDialog(template, '受益人详情', ["$scope", function ($ModelScope) {
                        $ModelScope.init = function () {
                            var timeSpan = Math.round(new Date().getTime() / 1000);
                            var token = null;
                            wfWaiting.show();
                            var url = seagull2Url.getPlatformUrlBase() + '/Beneficiary/GetBeneficiary';
                            var body = {
                                Timespan: timeSpan,
                                CompanyName: item.companyName,
                                Token: token
                            };
                            $http.post(url, body).success(function (data) {
                                $ModelScope.data = JSON.parse(JSON.parse(data));
                                $ModelScope.beneficiaryArray = $ModelScope.data.result;
                                var str = '', result = $ModelScope.data.result;
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
                                var ele = $compile(str)($ModelScope);
                                $timeout(function () {
                                    $("#talbe-list").html(str);
                                    wfWaiting.hide();
                                }, 100)
                            })
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
                                    if (!tmpPathItem.link) str += '<a style="color:blue">' + tmpPathItem.value + '</a>';
                                    if (tmpPathItem.link && tmpPathItem.link.length == 1) {
                                        var obj;
                                        if (!tmpPathItem.num) {
                                            str += '<span class="right-line"><span class="text">' + tmpPathItem.link[0] + '%</span></span><a>' + tmpPathItem.value + '</a>';
                                        } else {
                                            str += '<a style="color:blue">' + tmpPathItem.value + '</a><span class="beinvested"><span class="text">' + tmpPathItem.link[0] + '%</span></span>';
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
                        $ModelScope.init();
                    }], $scope, { containerStyle: {} },
                        function (v, defer) {//50%
                            defer.resolve(v);//确定                
                        }, function (v, defer) {
                            defer.resolve(v);//取消
                        });
                }

                //股东关系关联 companyName：相关公司(至少两家企业)
                $scope.showPersonDetail = function (array) {
                    var str = "";

                    angular.forEach(array, function (v) {
                        str += v.companyName + ","
                    })

                    str = str.substring(0, str.length - 1);
                    var url = "default.htm#/legalAssociation/" + str;
                    window.open(url, '_blank');
                }

                //行政处罚风险：   companyName：公司名称 keyNo :公司内部关联主键KeyNo 
                $scope.monitoringReportDetail = function (item) {
                    var url = "default.htm#/monitoringReportDetail/" + item.companyName;
                    window.open(url, '_blank');
                }

                //根据属性默认加载数据
                $scope.init = function () {
                    $scope.isLoaded = false;
                    if ($scope.opts.isshowenterpriseCheck) {
                        $scope.selectenterpriseCheck();
                    }
                    else {
                        $scope.isLoaded = true;
                    }
                }
            }],
            link: function ($scope, element, attrs) {
            }
        };
    });
});