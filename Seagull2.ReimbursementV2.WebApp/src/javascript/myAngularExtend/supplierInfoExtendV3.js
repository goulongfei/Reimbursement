define([
    'angular',
    'app',
    'supplierProjectCityExtend',
    'supplierProjectExtend',
], function (angular, app) {

    //查询供应商
    app.directive("selectSupplierInfo", function () {
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
            controller: ["$scope", "sogModal", "seagull2Url", 'wfWaiting', "$http", "$window", "configure", "$filter", "$injector", function ($scope, sogModal, seagull2Url, wfWaiting, $http, $window, configure, $filter, $injector) {
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                //$scope.urlBase = $injector.get('configure').getConfig('urlCommonConfig').urlBase;
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
                    var viewPath = 'htmlTemplate/dialogTemplate/common/supplierInfoSelectorV3.html';
                    var template = '<div><div ng-include="\'' + viewPath + '\'"></div></div>';
                    var opts = {
                        footerHeight: 0
                    };
                    var promise = sogModal.openDialog(template, '供应商选择', ["$scope", function ($modalScope) {
                        //分页
                        $modalScope.selectCommodityPaging = {
                            currentPage: 1,
                            itemsPerPage: 8,
                            totalItems: 0
                        };
                        //供应商级别
                        var url = $scope.common.apiUrlBase + "/THRWebApi/SupplierV2/FindSupplierFromResult/LoadSupplierLevel";
                        $http.post(url).success(function (data) {
                            $modalScope.supplierLevelList = data;
                        });
                        $modalScope.selectnum = "";
                        $modalScope.cityName = "";
                        $modalScope.supplierName = "";
                        $modalScope.supplierLevel = [];
                        $modalScope.tradeCatagoryCodeList = [];
                        $modalScope.tradeCatagory = "";
                        $modalScope.tradeCatagoryName = "";
                        $modalScope.tradeCatagoryReadOnly = false;
                        $modalScope.cityList = [];
                        $modalScope.cityCodelist = [];
                        $modalScope.projectCodeList = [];
                        $modalScope.cooperateProjectCodeList = [];
                        if ($scope.opts.project != null) {
                            $modalScope.projectCodeList.push($scope.opts.project.projectCode);
                        }
                        $modalScope.tradeCatagoryOpts = {
                            beforAppend: function (tradeCatagory) {
                                for (var i = 0; i < tradeCatagory.length; i++) {
                                    var item = tradeCatagory[i];
                                    $modalScope.tradeCatagoryCodeList.push(item.code)
                                }
                            }
                        }
                        //合作城市信息
                        $modalScope.projectCityOpts = {
                            cityName: $modalScope.cityName,
                            beforAppend: function (city) {
                                var codes = [];
                                if (city.length != 0) {
                                    for (var i = 0; i < city.length; i++) {
                                        var item = city[i];
                                        codes.push(item.code);
                                    }
                                    $modalScope.cityCodelist = codes;
                                } else {
                                    $modalScope.cityCodelist = [];
                                }
                            }
                        }
                        //合作项目信息
                        $modalScope.projectOpts = {
                            projectName: $modalScope.projectName,
                            cityList: $modalScope.cityList,
                            beforAppend: function (project) {
                                var codes = [];
                                if (project.length != 0) {
                                    for (var i = 0; i < project.length; i++) {
                                        var item = project[i];
                                        codes.push(item.code)
                                    }
                                    $modalScope.cooperateProjectCodeList = codes;
                                } else {
                                    $modalScope.cooperateProjectCodeList = [];
                                }
                            }
                        }
                        var getCityListUrl = seagull2Url.getPlatformUrlBase() + '/ProjectInfo/GetProjectCitys';
                        $http.get(getCityListUrl)
                            .success(function (data) {
                                $modalScope.cityList = data;
                                $modalScope.projectOpts.cityList = data;
                            }).error(function (data, status) {
                                errorDialog.openErrorDialog(data, status, "查询城市数据异常");
                                wfWaiting.hide();
                            });
                        //供应商级别选中
                        $modalScope.levelChecked = function () {
                            var codes = [];
                            for (var i = 0; i < $modalScope.supplierLevelList.length; i++) {
                                var item = $modalScope.supplierLevelList[i];
                                if (item.checked) {
                                    codes.push(item.code)
                                }
                            }
                            $modalScope.supplierLevel = codes;
                        }
                        if ($scope.opts.mySupplierCatagoryName != "" && $scope.opts.mySupplierCatagoryName != undefined) {
                            var tradeCatagoryCode = "";
                            if ($scope.opts.supplierCatagory.length > 0) {
                                angular.forEach($scope.opts.supplierCatagory, function (item) {
                                    $modalScope.tradeCatagoryCodeList.push(item.industryDomainCode);
                                    tradeCatagoryCode += item.industryDomainCode + ","
                                })
                                tradeCatagoryCode = tradeCatagoryCode.substring(0, tradeCatagoryCode.length - 1);
                            }
                            $modalScope.tradeCatagory = tradeCatagoryCode;
                            $modalScope.tradeCatagoryName = $scope.opts.mySupplierCatagoryName;
                            $modalScope.tradeCatagoryReadOnly = true;
                        }
                        $modalScope.sorted = false;
                        $modalScope.isMonopolyEditable = false;
                        $modalScope.isStrategyEditable = false;
                        $modalScope.isTinyEditable = false;
                        $modalScope.isMonopoly = null;
                        $modalScope.isStrategy = null;
                        $modalScope.isTiny = null;
                        $modalScope.enterStartTime = null;
                        $modalScope.enterEndTime = null;
                        $modalScope.cooperationStartTime = null;
                        $modalScope.cooperationEndTime = null;
                        if ($scope.opts.actionTypeCode != 4) {
                            if ($scope.data.delegationAmount > $scope.opts.tinyAmount) {
                                $modalScope.isTinyEditable = true;
                                $modalScope.isTiny = false;
                            }
                        }

                        if ($scope.opts.reason === 1) {
                            $modalScope.isMonopolyEditable = true;
                            $modalScope.isMonopoly = true;
                        }
                        if ($scope.opts.reason === 4) {
                            $modalScope.isStrategy = true;
                            $modalScope.isStrategyEditable = true;
                        }
                        //是否垄断变化
                        $modalScope.isMonopolyChange = function (val) {
                            $modalScope.isMonopoly = val;
                        }
                        //是否战采变化
                        $modalScope.isStrategyChange = function (val) {
                            $modalScope.isStrategy = val;
                        }
                        //是否小微变化
                        $modalScope.isTinyChange = function (val) {
                            $modalScope.isTiny = val;
                        }
                        var enterStartTime = null;
                        var enterEndTime = null;
                        var cooperationStartTime = null;
                        var cooperationEndTime = null;
                        $modalScope.filedName = "";
                        $modalScope.isDesc = null;

                        //搜索
                        $modalScope.Search = function (filedName, isDesc) {
                            wfWaiting.show();
                            if ($modalScope.$$childHead) {
                                $modalScope.$$childHead.selectnum = -1;
                            }
                            var $arrow_up = $(".glyphicon-arrow-up");
                            var $arrow_down = $(".glyphicon-arrow-down");
                            var className = "changeColor";
                            if (isDesc == true) {
                                $arrow_down.addClass(className);
                                $arrow_up.removeClass(className);
                            } else if (isDesc == false) {
                                $arrow_up.addClass(className);
                                $arrow_down.removeClass(className);
                               
                            } else {
                                $arrow_up.removeClass(className);
                                $arrow_down.removeClass(className);
                            }
                            var pageSize = $modalScope.selectCommodityPaging.itemsPerPage;
                            var pageIndex = $modalScope.selectCommodityPaging.currentPage - 1;

                            var url = $scope.common.apiUrlBase + "/THRWebApi/SupplierV2/SearchSupplier/FecthSupplierList";

                            if ($modalScope.enterStartTime != null) {
                                $modalScope.enterStartTime = $filter('date')($modalScope.enterStartTime, 'yyyy-MM-dd');
                            }
                            if ($modalScope.enterEndTime != null) {
                                $modalScope.enterEndTime = $filter('date')($modalScope.enterEndTime, 'yyyy-MM-dd');
                            }
                            if ($modalScope.cooperationStartTime != null) {
                                $modalScope.cooperationStartTime = $filter('date')($modalScope.cooperationStartTime, 'yyyy-MM-dd');
                            }
                            if ($modalScope.cooperationEndTime != null) {
                                $modalScope.cooperationEndTime = $filter('date')($modalScope.cooperationEndTime, 'yyyy-MM-dd');
                            }
                            if (filedName && (isDesc === true || isDesc === false)) {
                                var params = {
                                    SupplierCatagoryCodeArray: $modalScope.tradeCatagoryCodeList,
                                    SupplierName: $modalScope.supplierName,
                                    SupplierCityCodeArray: $modalScope.cityCodelist,
                                    StorageBeginDate: enterStartTime,
                                    StorageEndDate: enterEndTime,
                                    CooperateBeginDate: cooperationStartTime,
                                    CooperateEndDate: cooperationEndTime,
                                    ProjectCodeArray: $modalScope.projectCodeList,
                                    CooperateProjectCodeArray: $modalScope.cooperateProjectCodeList,
                                    IsMonopoly: $modalScope.isMonopoly,
                                    IsStrategy: $modalScope.isStrategy,
                                    IsTiny: $modalScope.isTiny,
                                    SupplierLevelArray: $modalScope.supplierLevel,
                                    OrderByName: filedName,
                                    IsDesc: isDesc,
                                    PageSize: pageSize,
                                    PageIndex: pageIndex,
                                    IsDirectCommissioned: true,
                                };
                                $modalScope.filedName = filedName;
                                $modalScope.isDesc = isDesc;
                            } else {
                                var params = {
                                    SupplierCatagoryCodeArray: $modalScope.tradeCatagoryCodeList,
                                    SupplierName: $modalScope.supplierName,
                                    SupplierCityCodeArray: $modalScope.cityCodelist,
                                    StorageBeginDate: $modalScope.enterStartTime,
                                    StorageEndDate: $modalScope.enterEndTime,
                                    CooperateBeginDate: $modalScope.cooperationStartTime,
                                    CooperateEndDate: $modalScope.cooperationEndTime,
                                    ProjectCodeArray: $modalScope.projectCodeList,
                                    CooperateProjectCodeArray: $modalScope.cooperateProjectCodeList,
                                    IsMonopoly: $modalScope.isMonopoly,
                                    IsStrategy: $modalScope.isStrategy,
                                    IsTiny: $modalScope.isTiny,
                                    SupplierLevelArray: $modalScope.supplierLevel,
                                    PageSize: pageSize,
                                    PageIndex: pageIndex,
                                    IsDirectCommissioned: true,
                                };
                            }

                            //获取供应商信息
                            $http.post(url, params)
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
                            $modalScope.Search($modalScope.filedName, $modalScope.isDesc)
                        });
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

                        //查询条件重置
                        $modalScope.ResetSearchConditions = function () {
                            $modalScope.supplierName = "";
                            for (var i = 0; i < $modalScope.supplierLevelList.length; i++) {
                                var item = $modalScope.supplierLevelList[i];
                                if (item.checked) {
                                    item.checked = false;
                                }
                            }
                            $modalScope.enterStartTime = null;
                            $modalScope.enterEndTime = null;
                            $modalScope.cooperationStartTime = null;
                            $modalScope.cooperationEndTime = null;
                            $modalScope.supplierLevel = [];
                            $modalScope.tradeCatagoryCodeList = [];
                            $modalScope.cityCodelist = [];
                            $modalScope.cooperateProjectCodeList = [];
                            document.getElementById("enterStartTime").value = null;
                            document.getElementById("enterEndTime").value = null;
                            document.getElementById("cooperationStartTime").value = null;
                            document.getElementById("cooperationEndTime").value = null;
                            document.getElementById("inputSupplierCategoryName").value = "";
                            document.getElementById("inputProjectCityName").value = "";
                            document.getElementById("inputProjectName").value = "";
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

                        //查看供应商合作次数、行业领域合作次数
                        $modalScope.openCooperationDetailsModal = function (fileName, item) {
                            if (!item.cooperationTimes || item.cooperationTimes <= 0) { return; }
                            if (!item.domainCooperationTimes || item.domainCooperationTimes <= 0) { return; }
                            if (fileName == "tradeArea") {
                                var viewPath = 'htmlTemplate/dialogTemplate/common/cooperationDetailsTempV3.html';
                            } else {
                                var viewPath = 'htmlTemplate/dialogTemplate/common/performanceDetailsTempV3.html';
                            }

                            var template = '<div ng-include="\'' + viewPath + '\'"></div>';
                            var promise = sogModal.openDialog(template, '合作详情', ["$scope", function ($cooperationModelScope) {
                                if (fileName == "tradeArea") {
                                    $cooperationModelScope.cooperation = {
                                        list: [],
                                        supplierCode: item.code,
                                        supplierCatagoryCode: item.tradeAreaCode,
                                        pagination: {
                                            currentPage: 1,
                                            itemsPerPage: 6,
                                            totalItems: 0
                                        }
                                    };
                                } else {
                                    $cooperationModelScope.cooperation = {
                                        list: [],
                                        supplierCode: item.code,
                                        pagination: {
                                            currentPage: 1,
                                            itemsPerPage: 6,
                                            totalItems: 0
                                        }
                                    };
                                }

                                // 分页监控
                                $cooperationModelScope.$watch('cooperation.pagination.currentPage', function () {
                                    getCooperationList();
                                });
                                // 请求数据
                                function getCooperationList() {
                                    var coop = $cooperationModelScope.cooperation;
                                    var params = {
                                        supplierCode: coop.supplierCode,
                                        supplierCatagoryCode: coop.supplierCatagoryCode,
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

                        //查看行业领域入围次数
                        $modalScope.openDomainShortListTimesModal = function (item) {
                            if (!item.domainShortListTimes || item.domainShortListTimes <= 0) { return; }
                            var viewPath = 'htmlTemplate/dialogTemplate/common/domainShortListDetailsTempV3.html';
                            var template = '<div ng-include="\'' + viewPath + '\'"></div>';
                            var promise = sogModal.openDialog(template, '入围详情', ["$scope", function ($domainShortListScope) {
                                $domainShortListScope.domainShortList = {
                                    list: [],
                                    supplierCode: item.code,
                                    supplierCatagoryCode: item.tradeAreaCode,
                                    pagination: {
                                        currentPage: 1,
                                        itemsPerPage: 6,
                                        totalItems: 0
                                    }
                                };
                                // 分页监控
                                $domainShortListScope.$watch('domainShortList.pagination.currentPage', function () {
                                    getDomainShortList();
                                });
                                // 请求数据
                                function getDomainShortList() {
                                    var domain = $domainShortListScope.domainShortList;
                                    var params = {
                                        supplierCode: domain.supplierCode,
                                        supplierCatagoryCode: domain.supplierCatagoryCode,
                                        pageIndex: domain.pagination.currentPage - 1,
                                        pageSize: domain.pagination.itemsPerPage
                                    };
                                    wfWaiting.show();
                                    $http.post($scope.common.apiUrlBase + "/THRWebApi/SupplierV2/FindSupplieShortListDetails/FindSupplieShortListDetails", params)
                                        .success(function (data) {
                                            $domainShortListScope.domainShortList.list = data.data;
                                            $domainShortListScope.domainShortList.pagination.totalItems = data.totalCount;
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
                    }], $scope, { containerStyle: { width: '95%'}, },
                        function (v, defer) {
                            defer.resolve(v);//确定
                        }, function (v, defer) {
                            defer.resolve(v);//取消
                        });

                }

                //清除
                $scope.RemoveSupplier = function () {
                    $scope.supplierName = null;
                    $scope.opts.beforAppend(null, $scope.index);
                };
            }], link: function ($scope, element, attrs) {
            }
        };
    });
});