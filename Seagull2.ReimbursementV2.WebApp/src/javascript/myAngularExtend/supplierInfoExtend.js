define([
    'angular',
    'app'
], function (angular, app) {

    //查询供应商
    app.directive("searchSingleSupplier", function () {
        return {
            restrict: "AE",
            scope: {
                mySupplier: "=",
                mySupplierName: "=",
                mySupplierCatagory: "=",
                mySupplierCatagoryName: "=",
                mySupplierCatagoryValidation: "=",
                reason: "=",
                isselectproject: "=",
                hasAmount: "=",
                myClick: "&",
                actionTypeCode: "=",
            },
            templateUrl: "htmlTemplate/controlTemplate/common/searchSupplier.html",
            replace: true,
            transclude: false,
            controller: ["$scope", "sogModal", "seagull2Url", 'wfWaiting', "$http", "$window", "configure", function ($scope, sogModal, seagull2Url, wfWaiting, $http, $window, configure) {
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                $scope.SelectSupplier = function () {
                    if ($scope.mySupplierCatagoryValidation) {
                        if ($scope.mySupplierCatagory === undefined || $scope.mySupplierCatagory.length === 0) {
                            var message = "请先选择供应商类别，再添加供应商";
                            sogModal.openAlertDialog("提示", message);
                            return false;
                        }
                    }
                    //if ($scope.actionTypeCode && !$scope.isselectproject) {
                    //    sogModal.openAlertDialog("提示", "请先选择项目，再添加供应商");
                    //    return false;
                    //}
                    //// 直接委托(固定资产采购类)、直接委托(第三方维保类)、直接委托(集中采购)、直接委托(集团战略采购)不需要验证直接委托理由
                    //if ($scope.actionTypeCode !== 9 && $scope.actionTypeCode !== 10 && $scope.actionTypeCode !== 1  && $scope.actionTypeCode !== 2) {
                    //    if (!$scope.reason) {
                    //        sogModal.openAlertDialog("提示", "请先选择直接委托理由，再添加供应商");
                    //        return false;
                    //    }
                    //}
                    //if ($scope.actionTypeCode && !$scope.hasAmount) {
                    //    sogModal.openAlertDialog("提示", "请先填写直接委托金额，再添加供应商");
                    //    return false;
                    //}
                    if ($scope.mySupplierCatagory) {
                        // 供应商类型名称拼接
                        $scope.mySupplierCatagoryName = "";
                        var names = "";
                        angular.forEach($scope.mySupplierCatagory, function (item) {
                            names += item.industryDomainName + ",";
                        });
                        $scope.mySupplierCatagoryName = names.substring(0, names.length - 1);
                    }
                    var viewPath = 'htmlTemplate/dialogTemplate/common/supplierInfoSelector.html';
                    sogModal.openLayer('<div><div ng-include="\'' + viewPath + '\'"></div></div>', ['$scope', function ($modalScope) {
                        //分页
                        $modalScope.selectCommodityPaging = {
                            currentPage: 1,
                            itemsPerPage: 6,
                            totalItems: 0
                        };
                        //级别下拉控件
                        var url = $scope.common.apiUrlBase + "/THRWebApi/SupplierV2/GetProjectData/GetSupplierLevel";
                        $http.get(url).success(function (data) {
                            $modalScope.supplierLevelList = data;
                        });
                        $modalScope.industryDomain = {
                            industryDomainCode: "",
                            industryDomainName: "",
                        };
                        $modalScope.supplierName = "";
                        $modalScope.tradeCatagory = "";
                        $modalScope.tradeCatagoryName = "";
                        $modalScope.tradeCatagoryReadOnly = false;
                        if ($scope.mySupplierCatagoryName != "" && $scope.mySupplierCatagoryName != undefined) {
                            var tradeCatagoryCode = "";
                            if ($scope.mySupplierCatagory.length > 0) {
                                angular.forEach($scope.mySupplierCatagory, function (item) {
                                    tradeCatagoryCode = item.industryDomainCode + ","
                                })
                                tradeCatagoryCode = tradeCatagoryCode.substring(0, tradeCatagoryCode.length - 1);
                            }
                            $modalScope.tradeCatagory = tradeCatagoryCode;
                            $modalScope.tradeCatagoryName = $scope.mySupplierCatagoryName;
                            $modalScope.tradeCatagoryReadOnly = true;
                        }
                        $modalScope.contractsName = ""
                        $modalScope.Selectnum = "";
                        $modalScope.supplierLevel = "";
                        $modalScope.isMonopoly = false;
                        if ($scope.reason == 5) {
                            $modalScope.isMonopoly = true;
                        }
                        $modalScope.Search = function (isSearch) {
                            wfWaiting.show();
                            if (isSearch == 1)
                                $modalScope.selectCommodityPaging.currentPage = 1;
                            var pageSize = $modalScope.selectCommodityPaging.itemsPerPage;
                            var pageIndex = $modalScope.selectCommodityPaging.currentPage - 1;
                            var url = $scope.common.apiUrlBase + "/THRWebApi/SupplierV2/GetProjectData/FindSupplierFromResult?pageIndex=" + pageIndex + "&pageSize=" + pageSize;
                            url += "&isMonopoly=" + $modalScope.isMonopoly;
                            if ($modalScope.supplierName != "")
                                url += "&SupplierName=" + $modalScope.supplierName;
                            if ($modalScope.tradeCatagory != "") {
                                if ($modalScope.tradeCatagoryReadOnly) {
                                    url += "&SupplierCatagory=" + $modalScope.tradeCatagory;
                                } else {
                                    var tradeCatagoryCode = "";
                                    if ($modalScope.tradeCatagory.length > 0) {
                                        angular.forEach($modalScope.tradeCatagory, function (item) {
                                            tradeCatagoryCode = item.industryDomainCode + ","
                                        })
                                        tradeCatagoryCode = tradeCatagoryCode.substring(0, tradeCatagoryCode.length - 1);
                                        url += "&SupplierCatagory=" + tradeCatagoryCode;
                                    }
                                }
                            }
                            if ($modalScope.supplierLevel != "")
                                url += "&SupplierLevel=" + $modalScope.supplierLevel;
                            $http.get(encodeURI(url)).success(function (data) {
                                wfWaiting.hide();
                                $modalScope.querySupplierList = data;
                                $modalScope.selectCommodityPaging.totalItems = data.totalCount;
                            });
                        };

                        //监听ViewModel页数的变化更新ViewModel的数据
                        $modalScope.$watch('selectCommodityPaging.currentPage', function () {
                            $modalScope.Search(0)
                        });

                        //查询条件重置
                        $modalScope.ResetSearchConditions = function () {
                            $modalScope.supplierName = "";
                            $modalScope.supplierLevel = "";
                            $modalScope.isMonopoly = false;
                        }

                        //将查出的供应商添加到拟单页
                        $modalScope.Add = function (obj) {
                            for (var ids = 0; ids < $modalScope.querySupplierList.data.length; ids++) {
                                if (ids == obj) {
                                    var temp = $modalScope.querySupplierList.data[ids];
                                    //不能选择待考察,不合格，出库的供应商
                                    if (temp.tradeAreaLevel == "4" || temp.tradeAreaLevel == "5" || temp.tradeAreaLevel == "7") {
                                        var message = "不能选择供应商等级为" + temp.tradeAreaLevelName + "的供应商！";
                                        sogModal.openAlertDialog("提示", message);
                                        return false;
                                        break;
                                    }
                                }
                            }
                            for (var ids = 0; ids < $modalScope.querySupplierList.data.length; ids++) {
                                if (ids == obj) {
                                    var temp = $modalScope.querySupplierList.data[ids];
                                    $scope.mySupplier.supplierCode = temp.code;
                                    $scope.mySupplier.supplierName = temp.supplierName;
                                    $scope.mySupplier.industryDomainCode = temp.tradeAreaCode;
                                    $scope.mySupplier.industryDomainName = temp.tradeArea;
                                    $scope.myClick($scope.mySupplier);
                                    break;
                                }
                            }
                        }

                        //查看供应商入库及考察审批完成页面
                        $modalScope.findInspectionConclusion = function (code) {
                            wfWaiting.show();
                            var url = $scope.common.webUrlBase + "/THRWebApi/SupplierV2/FindSupplierFromResult/GetFinishInspectionUrl";
                            url += "?SupplierCode=" + code + "&random=" + Math.random();
                            $http.post(encodeURI(url)).success(function (data) {
                                wfWaiting.hide();
                                if (data.url != "" && data.activityId != "") {
                                    if (typeof WebViewBridge == 'undefined') {
                                        $window.open($scope.common.webUrlBase + data.url);
                                    }
                                    else {
                                        WebViewBridge.send(JSON.stringify({ type: 'attachment', title: "供应商入库及考察", url: RootUrl + data.url }));
                                    }
                                } else {
                                    sogModal.openAlertDialog("流程", "未能找到该流程！");
                                }
                            }).error(function (data) {
                                console.log(data);
                            });

                        };

                        //点击供应商详情
                        $modalScope.checkSupplierDetails = function (code) {
                            var url = $scope.common.webUrlBase + "/THRWebApp/SupplierV2/default.htm#/supplierDetails?supplierCode=" + code + "&random=" + Math.random();
                            $window.open(url);
                        }
                    }], undefined, { containerStyle: { width: "70%" } }, undefined, undefined);
                };
                //清除
                $scope.RemoveSupplier = function () {
                    $scope.mySupplier.supplierCode = "";
                    $scope.mySupplier.supplierName = "";
                    $scope.mySupplier.industryDomainName = "";
                    $scope.mySupplier.industryDomainCode = "";
                    $scope.myClick();
                };
            }],
            link: function ($scope, element, attrs) {
            }
        };
    });


});