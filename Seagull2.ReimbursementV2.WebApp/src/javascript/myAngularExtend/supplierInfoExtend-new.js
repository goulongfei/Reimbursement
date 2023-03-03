define([
    'angular',
    'app'
], function (angular, app) {
    // opts 配置
    /*
     opts = {
        mySupplier: "=", // 委托信息记录
        mySupplierName: "=", // 委托名称
        supplierCatagory: "=",// 供应商类别 object
        mySupplierCatagoryName: "=",// 供应商类别名称 string
        reason: "=",// 直接委托理由， 1 是垄断
        hasAmount: "=", // 直接委托金额
        myClick: "&",
        project: "=", // 项目 { projectCode: "", projectName: "" }
        blackList: "=", // 不校验字段的白名单
    }
     */

    //查询供应商
    app.directive("searchSingleSupplier", function () {
        return {
            restrict: "AE",
            scope: {
                data: "=",
                opts: "=",
                index: "=",
            },
            templateUrl: "htmlTemplate/controlTemplate/common/searchSupplierV2.html",
            replace: true,
            transclude: false,
            controller: ["$scope", "sogModal", "seagull2Url", 'wfWaiting', "$http", "$window", "configure", function ($scope, sogModal, seagull2Url, wfWaiting, $http, $window, configure) {
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                $scope.SelectSupplier = function () {
                    var opts = $scope.opts;
                    var blackList = $scope.opts.blackList;
                    if (!angular.isArray(blackList)) {
                        blackList = [];
                    }

                    // 校验 项目
                    if (blackList.indexOf('project') !== -1 && (!opts.project || !opts.project.projectCode || !opts.project.projectName)) {
                        sogModal.openAlertDialog("提示", "请先选择项目，再添加供应商！")
                        return;
                    }

                    if (blackList.indexOf('supplierCatagory') !== -1) {
                        if (angular.isArray(opts.supplierCatagory) === false || opts.supplierCatagory.length === 0) {
                            sogModal.openAlertDialog("提示", "请先选择供应商类别，再添加供应商！");
                            return;
                        }
                    }
                    if (blackList.indexOf('reason') !== -1 && !opts.reason) {
                        sogModal.openAlertDialog("提示", "请先选择直接委托理由，再添加供应商！");
                        return;
                    }

                    // delegationAmount
                    if (blackList.indexOf('delegationAmount') !== -1 && (!$scope.data.delegationAmount || $scope.data.delegationAmount <= 0)) {
                        sogModal.openAlertDialog("提示", "请先填写直接委托金额，再添加供应商！");
                        return;
                    }
                    if ($scope.opts.supplierCatagory) {
                        // 供应商类型名称拼接
                        $scope.opts.mySupplierCatagoryName = "";
                        var names = "";
                        angular.forEach($scope.opts.supplierCatagory, function (item) {
                            names += item.industryDomainName + ",";
                        });
                        $scope.opts.mySupplierCatagoryName = names.substring(0, names.length - 1);
                    }
                    var viewPath = 'htmlTemplate/dialogTemplate/common/supplierInfoSelector-new.html';
                    sogModal.openLayer('<div><div ng-include="\'' + viewPath + '\'"></div></div>', ['$scope', function ($modalScope) {
                        //分页
                        $modalScope.selectCommodityPaging = {
                            currentPage: 1,
                            itemsPerPage: 6,
                            totalItems: 0
                        };
                        //级别下拉控件
                        var url = $scope.common.apiUrlBase + "/THRWebApi/SupplierV2/FindSupplierFromResult/LoadSupplierLevel";
                        $http.post(url).success(function (data) {
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
                        if ($scope.opts.mySupplierCatagoryName != "" && $scope.opts.mySupplierCatagoryName != undefined) {
                            var tradeCatagoryCode = "";
                            if ($scope.opts.supplierCatagory.length > 0) {
                                angular.forEach($scope.opts.supplierCatagory, function (item) {
                                    tradeCatagoryCode += item.industryDomainCode + ","
                                })
                                tradeCatagoryCode = tradeCatagoryCode.substring(0, tradeCatagoryCode.length - 1);
                            }
                            $modalScope.tradeCatagory = tradeCatagoryCode;
                            $modalScope.tradeCatagoryName = $scope.opts.mySupplierCatagoryName;
                            $modalScope.tradeCatagoryReadOnly = true;
                        }
                        $modalScope.contractsName = ""
                        $modalScope.selectnum = "";
                        $modalScope.supplierLevel = "";
                        $modalScope.isMonopolyEditable = false;
                        $modalScope.isMonopoly = false;
                        $modalScope.isStrategy = false;
                        if ($scope.opts.reason === 1) {
                            $modalScope.isMonopolyEditable = true;
                            $modalScope.isMonopoly = true;
                        }
                        if ($scope.opts.reason === 4) {
                            $modalScope.isStrategy = true;
                        }
                        $modalScope.Search = function (isSearch) {
                            wfWaiting.show();
                            if ($modalScope.$$childHead) {
                                $modalScope.$$childHead.selectnum = -1;
                            }
                            if (isSearch == 1)
                                $modalScope.selectCommodityPaging.currentPage = 1;
                            var pageSize = $modalScope.selectCommodityPaging.itemsPerPage;
                            var pageIndex = $modalScope.selectCommodityPaging.currentPage - 1;
                            // 是否带出小微供应商
                            var isTiny = $scope.data.delegationAmount <= $scope.opts.tinyAmount;
                            // /THRWebApp/SupplierV/FindSupplierFromResult/FindSupplierFromResult
                            // /THRWebApi/SupplierV2/FindSupplierFromResult/FindSupplierFromResult?
                            var url = $scope.common.apiUrlBase + "/THRWebApi/SupplierV2/FindSupplierFromResult/FindSupplierFromResult?pageIndex=" + pageIndex + "&pageSize=" + pageSize;
                            url += "&isMonopoly=" + $modalScope.isMonopoly + "&isTiny=" + isTiny + "&isStrategy=" + $modalScope.isStrategy;
                            if (blackList.indexOf('project') !== -1 && (!!opts.project || !!opts.project.projectCode)) {
                                url += "&projectCode=" + $scope.opts.project.projectCode;
                            }
                            if ($modalScope.supplierName != "")
                                url += "&SupplierName=" + $modalScope.supplierName;
                            if ($modalScope.tradeCatagory != "") {
                                if ($modalScope.tradeCatagoryReadOnly) {
                                    url += "&SupplierCatagory=" + $modalScope.tradeCatagory;
                                } else {
                                    var tradeCatagoryCode = "";
                                    if (angular.isArray($modalScope.tradeCatagory)) {
                                        if ($modalScope.tradeCatagory.length > 0) {
                                            angular.forEach($modalScope.tradeCatagory, function (item) {
                                                tradeCatagoryCode = item.industryDomainCode + ","
                                            })
                                            tradeCatagoryCode = tradeCatagoryCode.substring(0, tradeCatagoryCode.length - 1);
                                            url += "&SupplierCatagory=" + tradeCatagoryCode;
                                        }
                                    }
                                }
                            }
                            if ($modalScope.supplierLevel != "")
                                url += "&SupplierLevel=" + $modalScope.supplierLevel;
                            $http.post(encodeURI(url))
                                .success(function (data) {
                                    wfWaiting.hide();
                                    $modalScope.querySupplierList = data;
                                    $modalScope.selectCommodityPaging.totalItems = data.totalCount;
                                })
                                .error(function (err) {
                                    wfWaiting.hide();
                                    sogModal.openAlertDialog("提示", err.message || "查询出现异常，请稍后重试！");
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

                        //查询条件重置
                        $modalScope.isMonopolyChange = function (val) {
                            $modalScope.isMonopoly = val;
                        }

                        //将查出的供应商添加到拟单页
                        $modalScope.Add = function (obj) {
                            if (obj === "" || obj === -1) {
                                sogModal.openAlertDialog("提示", "请选择供应商！");
                                return;
                            }
                            var temp = $modalScope.querySupplierList.data[obj];
                            //不能选择待考察,不合格，出库的供应商
                            if (temp.tradeAreaLevel == "4" || temp.tradeAreaLevel == "5" || temp.tradeAreaLevel == "7") {
                                var message = "不能选择供应商等级为" + temp.tradeAreaLevelName + "的供应商！";
                                sogModal.openAlertDialog("提示", message);
                                return false;
                            }
                            var expiredInfo = "";
                            var expireInfo = "";
                            for (var i = 0; i < temp.expiredInfoList.length; i++) {
                                var expired = temp.expiredInfoList[i];
                                if (expired.expiredDays <= 0) {
                                    expiredInfo += expired.typeName + "，";
                                }
                                else if (expired.expiredDays >= 1 && expired.expiredDays < 30) {
                                    expireInfo += expired.typeName + "，";
                                }
                            }
                            var alertInfo = "";
                            var isTimeEnd = false;
                            var isToTimeEnd = false;
                            if (expiredInfo) {
                                alertInfo += expiredInfo + "已过期，请尽快邀请供应商更新证件信息！";
                                isTimeEnd = true;
                            }
                            if (expireInfo) {
                                alertInfo += expireInfo + "即将在30日后过期，请及时邀请供应商更新证件信息！";
                                isToTimeEnd = true;
                            }
                            if (alertInfo) {
                                if (isTimeEnd === false) {
                                    if (isToTimeEnd === true) {
                                        sogModal.openAlertDialog("提示", temp.supplierName + alertInfo);
                                    }

                                } else {
                                    sogModal.openAlertDialog("提示", temp.supplierName + alertInfo);
                                    return;
                                }


                            }
                            var supplier = {
                                supplierCode: temp.code,
                                supplierName: temp.supplierName,
                                industryDomainCode: temp.tradeAreaCode,
                                industryDomainName: temp.tradeArea,
                                isTiny: temp.isTiny
                            }
                            $scope.supplierName = temp.supplierName;
                            $scope.opts.beforAppend(supplier, $scope.index);
                            $modalScope.closeThisDialog();
                        }

                        //查看供应商入库及考察审批完成页面
                        $modalScope.findInspectionConclusion = function (code) {
                            wfWaiting.show();
                            var url = $scope.common.apiUrlBase + "/THRWebApi/SupplierV2/FindSupplierFromResult/GetFinishInspectionUrl";
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
                            }).error(function (err) {
                                sogModal.openAlertDialog("提示", err.message || "查询异常，请稍后重试！");
                            });

                        };

                        //点击供应商详情
                        $modalScope.checkSupplierDetails = function (code) {
                            var url = $scope.common.webUrlBase + "/THRWebApp/SupplierV2/default.htm#/supplierDetails?supplierCode=" + code + "&random=" + Math.random();
                            $window.open(url);
                        };

                        // 合作次数
                        $modalScope.openCooperationDetailsModal = function (item) {
                            if (!item.cooperationTimes || item.cooperationTimes <= 0) { return; }
                            var viewPath = 'htmlTemplate/dialogTemplate/common/cooperationDetailsTemp.html';
                            var template = '<div ng-include="\'' + viewPath + '\'"></div>';
                            var promise = sogModal.openDialog(template, '合作详情', ["$scope", function ($cooperationModelScope) {
                                $cooperationModelScope.cooperation = {
                                    list: [],
                                    supplierCode: item.code,
                                    pagination: {
                                        currentPage: 1,
                                        itemsPerPage: 6,
                                        totalItems: 0
                                    }
                                };
                                // 分页监控
                                $cooperationModelScope.$watch('cooperation.pagination.currentPage', function () {
                                    getCooperationList();
                                });
                                // 请求数据
                                function getCooperationList() {
                                    var coop = $cooperationModelScope.cooperation;
                                    var params = {
                                        supplierCode: coop.supplierCode,
                                        pageIndex: coop.pagination.currentPage - 1,
                                        pageSize: coop.pagination.itemsPerPage
                                    };
                                    wfWaiting.show();
                                    $http.post($scope.common.apiUrlBase + "/THRWebApi/SupplierV2/FindSupplieContactDetails/FindSupplieContactDetails", params)
                                        .success(function (data) {
                                            $cooperationModelScope.cooperation.list = data.data;
                                            $cooperationModelScope.cooperation.pagination.totalItems = data.totalCount;
                                            wfWaiting.hide();
                                        }).error(function (err) {
                                            sogModal.openAlertDialog("提示", err.message || "查询异常，请稍后重试！");
                                            wfWaiting.hide();
                                        });
                                };

                            }], $scope, { containerStyle: { width: '70%' }, },
                                function (v, defer) {//50%
                                    defer.resolve(v);//确定                
                                }, function (v, defer) {
                                    defer.resolve(v);//取消
                                });
                        }


                    }]);
                };
                //清除
                $scope.RemoveSupplier = function () {
                    $scope.supplierName = null;
                    $scope.opts.beforAppend(null, $scope.index);
                };
            }],
            link: function ($scope, element, attrs) {
            }
        };
    });


});