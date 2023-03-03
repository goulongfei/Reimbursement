define([
    'angular',
    'app',
], function (angular, app) {

    //使用成本中心
    app.directive("selectUsecostcenter", function () {
        return {
            restrict: 'A',
            scope: {
                data: "=",
                expendType: "=",
                mainCode: "=",
                readonly: "=",
                isproject: "=",
                isnotprojectdirect: "=",
                isjdshop: "="
            },
            templateUrl: 'htmlTemplate/controlTemplate/common/useCostCenter.html',
            replace: false,
            controller: function ($scope, $http, sogModal, seagull2Url, wfWaiting, ValidateHelper, sogValidator, errorDialog) {
                //生成code
                var guidGenerator = function () {
                    var result;
                    $.ajax({
                        url: seagull2Url.getPlatformUrl('/Purchase/GuidGenerator'),
                        data: {
                            'timeStamp': new Date().getTime()
                        },
                        dataType: "text",
                        type: "get",
                        async: false,
                        success: function (returnResult) {
                            result = returnResult.replace("\"", "").replace("\"", "");
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            console.log(XMLHttpRequest.status);
                            console.log(XMLHttpRequest.readyState);
                            console.log(textStatus);
                            console.log(errorThrown);
                        }
                    });
                    return result;
                };
                //添加
                $scope.addDetail = function () {
                    var itemCostCenter = {
                        code: guidGenerator(),
                        checked: false,
                    };
                    itemCostCenter.chargeCompanyOpts = {
                        corporationName: "",
                        expendType: $scope.expendType,
                        beforAppend: function (corporation) {
                            itemCostCenter.useChargeCompanyCode = corporation.corporationCode;
                            itemCostCenter.useChargeCompanyName = corporation.corporationName;
                            itemCostCenter.useCostCenterCode = "";
                            itemCostCenter.useCostCenterName = "";
                            $scope.baseUseInfo.loadCostCenter(itemCostCenter);
                        }
                    }
                    $scope.data.push(itemCostCenter);
                };
                $scope.select_all = false;
                //全选
                $scope.selectAll = function (allChecked) {
                    for (var i = 0; i < $scope.data.length; i++) {
                        $scope.data[i].checked = allChecked;
                    }
                };
                //复选框选中
                $scope.selectOne = function (checked) {
                    for (var i = 0; i < $scope.data.length; i++) {
                        if (!$scope.data[i].checked) {
                            $scope.select_all = false;
                            return;
                        } else {
                            $scope.select_all = true;
                        }
                    }
                };
                //删除
                $scope.deleteDetail = function () {
                    var select = false;
                    for (var i = $scope.data.length - 1; i >= 0; i--) {
                        if ($scope.data[i].checked) {
                            select = true;
                        }
                    }
                    if (!select) {
                        sogModal.openAlertDialog("提示", "请先选中需要删除的信息");
                    } else {
                        var promise = sogModal.openConfirmDialog("删除", "确认是否删除?");
                        promise.then(function (v) {
                            for (var i = $scope.data.length - 1; i >= 0; i--) {
                                if ($scope.data[i].checked) {
                                    $scope.data.splice(i, 1);
                                }
                            }
                            $scope.select_all = false;
                            if ($scope.data == null || $scope.data.length == 0) {
                                $scope.mainCode = null;
                            }
                            if ($scope.data != null && $scope.data.length > 0) {
                                $scope.mainCode = $scope.data[0].useCostCenterCode;
                            }
                        });
                    }
                };

                $scope.baseUseInfo = {
                    //加载成本中心    
                    loadCostCenter: function (item) {
                        wfWaiting.show();
                        item.costCenterList = [];
                        var isUseCostCenter = false;
                        var isproject = false;
                        var isFilterOperationCostControl = false;
                        if ($scope.expendType === 3) {
                            isUseCostCenter = true;
                        } else if ($scope.expendType === 2 && $scope.isproject) {
                            isproject = true;
                        }
                        if ($scope.isnotprojectdirect) {
                            if (!$scope.isjdshop) {
                                isFilterOperationCostControl = true;
                            }
                        }
                        $http.get(seagull2Url.getPlatformUrl('/Purchase/GetCostCenterList?r=' + Math.random() + '&chargeCompanyCode=' + item.useChargeCompanyCode + "&isUseCostCenter=" + isUseCostCenter + "&isFilterOperationCostControl=" + isFilterOperationCostControl + "&isproject=" + isproject))
                            .success(function (data) {
                                item.costCenterList = data;
                                wfWaiting.hide();
                            })
                            .error(function (data, status) {
                                errorDialog.openErrorDialog(data, status, "加载成本中心异常");
                                wfWaiting.hide();
                            });
                    },
                    //成本中心选中下拉框数据变化
                    costCenterChange: function (item) {
                        if ($scope.data.length > 1) {
                            var flag = false;
                            angular.forEach($scope.data, function (itemData) {
                                if (item.code != itemData.code && item.useCostCenterCode === itemData.useCostCenterCode) {
                                    flag = true;
                                }
                            });
                            if (flag) {
                                item.useCostCenterCode = "";
                                item.useCostCenterName = "";
                                sogModal.openAlertDialog('提示', '使用成本中心不能重复!');
                                return;
                            }
                        }

                        angular.forEach(item.costCenterList, function (v) {
                            if (item.useCostCenterCode === v.code) {
                                item.useCostCenterName = v.name;
                                if (item.code == $scope.data[0].code) {
                                    $scope.mainCode = v.code;
                                }
                            }
                        });
                    },
                };

                //记账公司
                if ($scope.data && $scope.data.length > 0) {
                    angular.forEach($scope.data, function (item) {
                        item.chargeCompanyOpts = {
                            corporationName: item.useChargeCompanyName,
                            beforAppend: function (corporation) {
                                item.useChargeCompanyCode = corporation.corporationCode;
                                item.useChargeCompanyName = corporation.corporationName;
                                item.useCostCenterCode = "";
                                item.useCostCenterName = "";
                                $scope.baseUseInfo.loadCostCenter(item);
                            }
                        }
                    });
                }


            },
            link: function ($scope, element, attrs) {
            }
        };
    });

    //多审批流选择
    app.directive("mulitWorkflow", function () {
        return {
            restrict: "A",
            scope: {
                data: '=',
                opts: '=',
            },
            template: '<div style="color:blue;" ng-click="openModal()">{{data.purchaseName}}</div>',
            replace: true,
            transclude: false,
            controller: function ($scope, $http, sogModal, configure) {
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                $scope.openModal = function () {
                    var viewPath = 'htmlTemplate/controlTemplate/common/multiWorkflowSpreadView.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>';
                    promise = sogModal.openDialog(template, '查看正在进行的审批流', ["$scope", "wfWaiting", "$http", "configure", "seagull2Url",
                        function ($modelScope, wfWaiting, $http, configure, seagull2Url) {
                            var getUrl = seagull2Url.getPlatformUrl("/Purchase/GetMultiWorkFlowAddress") + "?resourceID=" + $scope.data.resourceID + "&linkName=" + $scope.opts;
                            $modelScope.multiWorkflowList = [];
                            $modelScope.queryData = function () {
                                wfWaiting.show();
                                $http.get(getUrl + '&r=' + Math.random(), { cache: false })
                                    .success(function (data) {
                                        $modelScope.multiWorkflowList = data;
                                        wfWaiting.hide();
                                    }).error(function (data, status) {
                                        wfWaiting.hide();
                                    });
                            }
                            $modelScope.queryData();
                        }], $scope, { containerStyle: { width: '50%' } },
                        function (v, defer) {//50%
                            defer.resolve(v);//确定
                        }, function (v, defer) {
                            defer.resolve(v);//取消
                        });
                }
            },
            link: function (scope, iElement, iAttr) {
            }
        }
    });

    //选择记账公司-单选
    app.directive("selectSingleChargecompany", function () {
        return {
            restrict: 'A',
            template: "<div style='height:25px;'><input type='text' class='meeting' style='display:inline-block;' ng-style='{width:readOnly?\"100%\":\"calc(100% - 22px)\",backgroundColor:opts.readOnly?\"#eee\":\"\"}' disabled ng-value='opts.corporationName' title='{{opts.corporationName}}' placeholder='请选择记账公司' sog-valide-status='记账公司'/>&nbsp;<i ng-click='open()' class='glyphicon glyphicon-folder-open' style='cursor:pointer;'></i></div>",
            scope: {
                opts: "=",
                data: "="
            },
            replace: true,
            controller: function ($scope, $element, $attrs, $http, sogModal, seagull2Url, wfWaiting, ValidateHelper, sogValidator, commissionBaseOpts, errorDialog) {
                $scope.opts = commissionBaseOpts.get($scope.opts);
                $scope.opts.corporationName = $scope.opts.corporationName || "";
                $scope.open = function () {
                    $scope.opts.refreshOpts($scope.opts);
                    var viewPath = 'htmlTemplate/controlTemplate/common/corporationInfoSelect.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>',
                        promise = sogModal.openDialog(template, '选择记账公司', ["$scope", function ($modelScope) {
                            $modelScope.model = {
                                queryCondition: {
                                    corporationCnName: "",
                                    organizationType: null,
                                    pageSize: 6,
                                    pageIndex: 1
                                },
                                paginationConf: {
                                    currentPage: 1,
                                    itemsPerPage: 6,
                                    totalItems: 0
                                },
                                keyword: "",
                                selectedItem: null,
                                corporationList: [],
                                isLoaded: false,
                                chooseItem: function (item) {
                                    this.selectedItem = item;
                                    this.selectedItem.corporationName = item.corporationName;
                                },

                                loadData: function (pageIndex) {
                                    this.queryCondition.corporationName = this.keyword;
                                    this.queryCondition.pageSize = this.paginationConf.itemsPerPage;
                                    this.selectedItem = null;
                                    this.isLoaded = true;
                                    this.queryData($modelScope.model.paginationConf.currentPage, false);
                                },
                                query: function () {
                                    this.queryCondition.corporationName = this.keyword;
                                    this.queryCondition.pageSize = this.paginationConf.itemsPerPage;
                                    this.selectedItem = null;
                                    this.isLoaded = true;
                                    this.queryData(1, false);
                                },
                                queryData: function (pageIndex) {
                                    wfWaiting.show();
                                    var that = $modelScope.model;
                                    if ($scope.opts.expendType == 2) {
                                        that.queryCondition.organizationType = 1;
                                    }
                                    that.queryCondition.pageIndex = pageIndex;
                                    $http.post(seagull2Url.getPlatformUrl("/Purchase/QueryChargeCompanyInfo"), that.queryCondition)
                                        .success(function (data) {
                                            that.paginationConf.totalItems = data.totalItems;
                                            that.corporationList = data.chargeCompanyInfo;
                                            wfWaiting.hide();
                                        })
                                        .error(function (data, status) {
                                            errorDialog.openErrorDialog(data, status, "查询法人公司数据异常");
                                            wfWaiting.hide();
                                        });

                                },
                                confirm: function () {
                                    if (this.selectedItem != null) {
                                        $modelScope.confirm(this.selectedItem);
                                    } else {
                                        sogModal.openAlertDialog("提示", "请选择一个法人公司");
                                    }

                                },
                            };
                            //分页监控
                            $modelScope.$watch('model.paginationConf.currentPage', function (newVal, oldVal) {
                                if ($modelScope.model.isLoaded) {
                                    $modelScope.model.loadData(newVal, true);
                                }
                            });
                        }], $scope, { containerStyle: { width: '50%', marginRight: "auto", marginLeft: "auto" } },
                            function (v, defer) {//50%
                                defer.resolve(v);//确定
                                $scope.opts.corporationName = v.corporationName;
                                $scope.opts.beforAppend(v);
                            }, function (v, defer) {
                                defer.resolve(v);//取消
                            });
                };


            }
        };
    });
})