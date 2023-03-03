define([
    'angular',
    'app',
    'commonUtilExtend',
    'supplierInfoExtendV4',
], function (angular, app) {

    //基础 opts
    app.factory("commissionBaseOpts", function () {
        function base() {
            this.corporationCode = "";
            this.corporationName = "";
            this.strategyPurchaseAgreementInfoCode = "";
            this.strategyPurchaseAgreementInfoName = "";
            this.beforAppend = function (v) { };
            this.refreshOpts = function (opts) { };//该方法接收当前的配置对象，可在这里从新修改该配置对象；
        }
        return {
            get: function (opts) {
                if (!angular.isObject(opts)) {
                    opts = {};
                }
                return angular.extend(new base(), opts);
            }
        };
    });

    //错误提示框
    app.factory("errorDialog", function (sogModal) {
        return {
            //请求出现错误调用的提示框
            openErrorDialog: function (data, status, msg) {
                sogModal.openErrorDialog({
                    message: msg,
                    exceptionMessage: status,
                    stackTrace: data || msg
                });
            }
        };
    });

    //选择法人公司(多选)
    app.directive("selectMultipleCorporation", function () {
        return {
            restrict: 'A',
            template: "<div><input style='width:88%;' type='text' class='meeting' disabled ng-value='opts.corporationName' title='{{opts.corporationName}}' placeholder='请选择法人公司'/>&nbsp;<i ng-click='open()' class='glyphicon glyphicon-folder-open' style='cursor:pointer;'></i></div>",
            scope: {
                opts: "=",
                data: "="
            },
            replace: true,
            controller: function ($scope, $element, $attrs, $http, sogModal, seagull2Url, wfWaiting, ValidateHelper, sogValidator, commissionBaseOpts, errorDialog) {
                $scope.opts = commissionBaseOpts.get($scope.opts);
                angular.forEach($scope.data, function (item) {
                    if (item.corporationName != "") {
                        $scope.opts.corporationName += item.corporationName + ',';
                    }
                });
                $scope.open = function () {
                    $scope.opts.refreshOpts($scope.opts);
                    var viewPath = 'htmlTemplate/controlTemplate/common/corproationInfoMultiSelect.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>',
                        promise = sogModal.openDialog(template, '选择法人公司', ["$scope", function ($modelScope) {
                            $modelScope.model = {
                                queryCondition: {
                                    corporationCnName: "",
                                    pageSize: 6,
                                    pageIndex: 1
                                },
                                paginationConf: {
                                    currentPage: 1,
                                    itemsPerPage: 6,
                                    totalItems: 0
                                },
                                keyword: "",
                                selectedItemList: [],
                                corporationList: [],
                                isLoaded: false,
                                showPageing: true,
                                chooseItem: function (item) {
                                    if (item.checked === true) {
                                        var isExists = false;
                                        for (var i = 0; i < this.selectedItemList.length; i++) {
                                            if (this.selectedItemList[i].corporationCode === item.corporationCode) {
                                                isExists = true;
                                            }
                                        }
                                        if (isExists === false) {
                                            item.corporationCnName = item.cnName;
                                            this.selectedItemList.push(item);
                                        }
                                    }
                                    else {
                                        if (this.showPageing === false) {
                                            var promise = sogModal.openConfirmDialog("确认", "是否取消选择法人公司?");
                                            promise.then(function () {
                                                for (var i = $modelScope.model.selectedItemList.length - 1; i >= 0; i--) {
                                                    if ($modelScope.model.selectedItemList[i].corporationCode === item.corporationCode) {
                                                        $modelScope.model.selectedItemList.splice(i, 1);
                                                    }
                                                }
                                            }, function () {
                                                for (var i = $modelScope.model.selectedItemList.length - 1; i >= 0; i--) {
                                                    if ($modelScope.model.selectedItemList[i].corporationCode === item.corporationCode) {
                                                        $modelScope.model.selectedItemList[i].checked = true;
                                                    }
                                                }
                                            });
                                        }
                                        else {
                                            for (var i = this.selectedItemList.length - 1; i >= 0; i--) {
                                                if (this.selectedItemList[i].projectCode === item.projectCode) {
                                                    $modelScope.model.selectedItemList.splice(i, 1);
                                                }
                                            }
                                        }
                                    }
                                },
                                loadData: function (pageIndex) {
                                    this.queryCondition.corporationName = this.keyword;
                                    this.queryCondition.pageSize = this.paginationConf.itemsPerPage;
                                    this.isLoaded = true;
                                    this.queryData($modelScope.model.paginationConf.currentPage, false);
                                },
                                query: function () {
                                    this.queryCondition.corporationName = this.keyword;
                                    this.queryCondition.pageSize = this.paginationConf.itemsPerPage;
                                    this.isLoaded = true;
                                    this.queryData(1, false);
                                },
                                showSelectList: function () {
                                    this.corporationList = this.selectedItemList;
                                    this.showPageing = false;
                                },
                                queryData: function (pageIndex) {
                                    wfWaiting.show();
                                    var that = $modelScope.model;
                                    that.showPageing = true;
                                    that.queryCondition.pageIndex = pageIndex;
                                    $http.post(seagull2Url.getPlatformUrl("/Purchase/QueryCorporationInfo"), that.queryCondition)
                                        .success(function (data) {
                                            that.paginationConf.totalItems = data.totalItems;
                                            that.corporationList = [];
                                            for (var y = 0; y < data.corporationInfo.length; y++) {
                                                for (var i = 0; i < that.selectedItemList.length; i++) {
                                                    if (that.selectedItemList[i].corporationCode === data.corporationInfo[y].corporationCode) {
                                                        data.corporationInfo[y].checked = true;
                                                    }
                                                }
                                                that.corporationList.push(data.corporationInfo[y]);
                                            }
                                            wfWaiting.hide();
                                        }).error(function (data, status) {
                                            errorDialog.openErrorDialog(data, status, "查询法人公司数据异常");
                                            wfWaiting.hide();
                                        });

                                },
                                confirm: function () {
                                    if (this.valideStatus()) {
                                        $modelScope.confirm(this.selectedItemList);
                                    }

                                },
                                //校验
                                valideStatus: function () {
                                    //自定义校验
                                    var ModelRequiredValidator = (function () {
                                        return function (message) {
                                            this.validateData = function (value, name, validationContext) {
                                                if (value === null || value === undefined || value === "") {
                                                    ValidateHelper.updateValidationContext(validationContext, name, message);
                                                    return false;
                                                }
                                                return true;
                                            };
                                        };
                                    }());
                                    //校验字段列表
                                    var validatorFieldList = [{ key: '法人公司列表', attributeName: 'selectedItemList', validator: new ModelRequiredValidator('请选择法人公司！') }];
                                    var modelStateDictionary = ValidateHelper.validateData($modelScope.model, validatorFieldList);
                                    if (this.selectedItemList === null || this.selectedItemList.length === 0) {
                                        modelStateDictionary.addModelError('法人公司列表', '请选择法人公司！');
                                    }
                                    sogValidator.clear();
                                    if (!modelStateDictionary.isValid()) {
                                        sogModal.openDialogForModelStateDictionary('信息校验失败', modelStateDictionary);
                                        sogValidator.broadcastResult(modelStateDictionary.get());
                                        return false;
                                    }
                                    return true;
                                }
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
                                $scope.data = v;
                                $scope.opts.corporationName = "";
                                for (var i = 0; i < v.length; i++) {
                                    $scope.opts.corporationName += v[i].corporationName + ";";
                                }
                                $scope.opts.beforAppend(v);
                            }, function (v, defer) {
                                defer.resolve(v);//取消
                            });
                }


            }
        };
    });

    //入围供应商
    app.directive("supplierScope", function () {
        return {
            restrict: 'A',
            scope: {
                opts: "=",
                data: "=",
                readonly: '=',
            },
            templateUrl: 'htmlTemplate/controlTemplate/common/comparePriceSupplierScope.html',
            replace: false,
            controller: function ($scope, sogModal, $window, configure) {
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                //附件
                $scope.fileopts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                //金额
                $scope.moneyOpts = {
                    min: 0,
                    max: 100000000000,
                    precision: 2
                };
                //添加
                $scope.addDetail = function () {
                    if (angular.isArray($scope.data) === false) {
                        $scope.data = [];
                    }
                    $scope.data.push({
                        supplierName: ''
                    });
                };
                //删除
                $scope.delDetail = function () {
                    var select = false;
                    for (var i = $scope.data.length - 1; i >= 0; i--) {
                        if ($scope.data[i].checked) {
                            select = true;
                        }
                    }
                    if (!select) {
                        sogModal.openAlertDialog("提示", "请先选中需要删除的入围供应商信息");
                    } else {
                        var promise = sogModal.openConfirmDialog("删除", "确认是否删除入围供应商信息?");
                        promise.then(function (v) {
                            for (var i = $scope.data.length - 1; i >= 0; i--) {
                                if ($scope.data[i].checked) {
                                    $scope.data.splice(i, 1);
                                }
                            }
                            $scope.select_all = false;
                        });
                    }
                };
                $scope.select_all = false;
                //全选
                $scope.selectAll = function (allChecked) {
                    for (var i = 0; i < $scope.data.length; i++) {
                        $scope.data[i].checked = allChecked;
                    }
                };
                //复选框选中
                $scope.selectOne = function () {
                    for (var i = 0; i < $scope.data.length; i++) {
                        if (!$scope.data[i].checked) {
                            $scope.select_all = false;
                            return;
                        } else {
                            $scope.select_all = true;
                        }
                    }
                };
                //选择供应商
                $scope.supplierOpts = {
                    supplierCatagory: $scope.opts.supplierCatagory,/*供应商类别 object*/
                    reason: $scope.opts.reason,/*直接委托理由， 1 是垄断*/
                    project: $scope.opts.project, /*项目 { projectCode: "", projectName: "" }*/
                    blackList: $scope.opts.blackList, /*供应商组件需要校验的字段黑名单，仅限供应商使用*/
                    actionTypeCode: $scope.opts.actionTypeCode,//直委类型
                    tinyAmount: $scope.opts.tinyAmount, //小微供应商限定金额
                    isRetrial: true,
                    beforAppend: function (supplier, index) {
                        var item = $scope.data[index];
                        item.supplierCode = '';
                        item.supplierName = '';
                        item.industryDomainCode = '';
                        item.industryDomainName = '';
                        item.isTinySupplier = false;
                        item.linkManName = '';
                        item.linkEmail = '';
                        if (supplier) {
                            var isSameSupplier = false;
                            angular.forEach($scope.data, function (item) {
                                if (supplier.supplierCode == item.supplierCode) {
                                    isSameSupplier = true;
                                }
                            });
                            if (isSameSupplier) {
                                sogModal.openAlertDialog("提示", "不能添加相同供应商！");
                            } else {
                                item.supplierCode = supplier.supplierCode;
                                item.supplierName = supplier.supplierName;
                                item.industryDomainCode = supplier.industryDomainCode;
                                item.industryDomainName = supplier.industryDomainName;
                                item.isTinySupplier = supplier.isTiny;
                                item.linkManName = supplier.linkManName;
                                item.linkEmail = supplier.linkEmail;
                            }
                        }
                        $scope.beforAppend(item);
                    },
                    isDirectCommissioned: true,
                };
                //清空入围供应商
                $scope.clearSupplierScope = function (index, item) {
                    if (!eval(item.isInstock)) {
                        item.supplierCode = $scope.newGuid();
                        $scope.data[index] = { isInstock: item.isInstock, supplierCode: item.supplierCode, supplierName: '' };
                    } else if (eval(item.isInstock)) {
                        $scope.data[index] = { isInstock: item.isInstock, supplierName: '' };
                    }
                    $scope.beforAppend(item);
                };
                //回传
                $scope.beforAppend = function (item) {
                    $scope.opts.beforAppend(item);
                };
                // 验证黑名单
                $scope.$watch('opts.blackList', function (newVal) {
                    $scope.supplierOpts.blackList = newVal;
                });
                //项目
                $scope.$watch('opts.project', function (newVal) {
                    $scope.supplierOpts.project = newVal;
                });
                //打开供应商详情页面
                $scope.OpenSupplier = function (code) {
                    var url = $scope.common.webUrlBase + "/THRWebApp/SupplierV2/default.htm#/supplierDetails?supplierCode=" + code + "&random=" + Math.random();
                    $window.open(url);
                }
                //生成Code
                $scope.newGuid = function () {
                    var guid = "";
                    for (var i = 1; i <= 32; i++) {
                        var n = Math.floor(Math.random() * 16.0).toString(16);
                        guid += n;
                        if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                            guid += "-";
                    }
                    return guid;
                }
            }
        };
    });

    //拟定中标供应商
    app.directive("signContract", function () {
        return {
            restrict: 'A',
            scope: {
                opts: "=",
                data: "=",
                readOnly: '=',
            },
            templateUrl: 'htmlTemplate/controlTemplate/common/comparePriceSignContractInfo.html',
            replace: false,
            controller: function ($scope, sogModal, sogOguType, wfWaiting, $http, seagull2Url, $window, errorDialog, configure) {
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                //单选人员
                $scope.operatorSelect = {
                    selectMask: sogOguType.User,
                    multiple: false
                };
                $scope.model = {
                    corporationScopeList: $scope.opts.corporationScopeList,
                    supplierScopeList: $scope.opts.awardSupplierList,
                };
                // 添加
                $scope.addDetail = function () {
                    if (angular.isArray($scope.data) === false) {
                        $scope.data = [];
                    }
                    $scope.data.push({
                        operatorUser: "",
                        sortNo: $scope.data.length + 1
                    });
                };
                //删除
                $scope.delDetail = function () {
                    var select = false;
                    for (var i = $scope.data.length - 1; i >= 0; i--) {
                        if ($scope.data[i].checked) {
                            select = true;
                        }
                    }
                    if (!select) {
                        sogModal.openAlertDialog("提示", "请先选中需要删除的拟定中标供应商信息")
                    } else {
                        var promise = sogModal.openConfirmDialog("删除", "确认是否删除拟定中标供应商信息?");
                        promise.then(function (v) {
                            if (angular.isArray($scope.data)) {
                                for (var i = $scope.data.length - 1; i >= 0; i--) {
                                    if ($scope.data[i].checked) {
                                        $scope.data.splice(i, 1);
                                    }
                                }
                            }
                            $scope.select_all = false;
                        })
                    }
                };
                $scope.select_all = false;
                //全选
                $scope.selectAll = function (allChecked) {
                    for (var i = 0; i < $scope.data.length; i++) {
                        $scope.data[i].checked = allChecked;
                    }
                }
                //复选框选中
                $scope.selectOne = function () {
                    for (var i = 0; i < $scope.data.length; i++) {
                        if (!$scope.data[i].checked) {
                            $scope.select_all = false;
                            return;
                        } else {
                            $scope.select_all = true;
                        }
                    }
                }
                //供应商变更
                $scope.supplierChange = function (item) {
                    var amount = 0;
                    item.perSignContractAmount = 0;
                    item.isBottomPriceWin = false;
                    angular.forEach($scope.opts.supplierScopeList, function (supplier) {
                        if (item.supplierCode === supplier.supplierCode) {
                            item.supplierName = supplier.supplierName;
                            item.industryDomainCode = supplier.industryDomainCode;
                            item.industryDomainName = supplier.industryDomainName;
                            item.perSignContractAmount = supplier.finalQuoteAmount;
                        }
                        if (amount == 0 || supplier.finalQuoteAmount < amount)
                            amount = supplier.finalQuoteAmount;
                    });
                    if (item.perSignContractAmount == amount)
                        item.isBottomPriceWin = true;
                    $scope.getPurchaseAmount();
                }
                //获取采购金额
                $scope.getPurchaseAmount = function () {
                    $scope.opts.purchaseBase.purchaseAmount = 0;
                    for (var i = 0; i < $scope.data.length; i++) {
                        var item = $scope.data[i];
                        if (item.perSignContractAmount == undefined) {
                            item.perSignContractAmount = 0;
                        }
                        $scope.opts.purchaseBase.purchaseAmount += item.perSignContractAmount;
                    }
                };
                //法人公司变更
                $scope.corporationChange = function (item) {
                    angular.forEach($scope.model.corporationScopeList, function (v) {
                        if (item.corporationCode === v.code) {
                            item.corporationName = v.name;
                        }
                    })
                }
                //查看合同详情
                $scope.lookContarctInfo = function (obj) {
                    var urlat = null;
                    $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                        .success(function (data) {
                            urlat = data;
                            if (urlat !== null) {
                                urlat = urlat.replace(/"/g, "");
                                var url = "";
                                var contractType = "";
                                var contractTypeCode = "";
                                var contractRouteType = "";
                                switch ($scope.opts.purchaseBase.purchaseBusinessTypeCode) {
                                    case 1:
                                        // 非项目服务类合同
                                        contractTypeCode = 1;
                                        contractType = "serviceContractEntry";
                                        contractRouteType = "serviceContractView";
                                        break;

                                    default:
                                }
                                switch (obj.contractStateCode) {
                                    case 1:
                                        if (obj.contractProcessDraftURL) {
                                            url = $scope.common.webUrlBase + obj.contractProcessDraftURL;
                                        }
                                        else {
                                            url = $scope.common.webUrlBase + "/THRWebApp/ContractV2/default.htm#/" + contractType + "/?resourceID=" + obj.contractResourceCode;
                                        }
                                        break;
                                    case 3:
                                        url = $scope.common.webUrlBase + "/THRWebApp/ContractV2/default.htm#/" + contractRouteType + "?id=" + obj.contractResourceCode + '&contractTypeCode=' + contractTypeCode + '&systemVersionCode=2';
                                        break;
                                }
                                if (url.indexOf("?") == -1) {
                                    url = url + "?_at=" + urlat;
                                } else {
                                    url = url + "&_at=" + urlat;
                                }
                                $window.open(url, '_blank');
                            }

                        })
                        .error(function (data, status) {
                            errorDialog.openErrorDialog(data, status, "查看合同详情异常");
                            wfWaiting.hide();
                        });
                };
                //获取合同状态
                if ($scope.opts.scene == 'Applicaiton' && $scope.readOnly === true) {
                    $scope.isSuccess = false;
                    if (angular.isArray($scope.data) == false) { return; }
                    var contractResourceCodelist = [];
                    for (var i = 0; i < $scope.data.length; i++) {
                        if ($scope.data[i].contractResourceCode) {
                            contractResourceCodelist.push($scope.data[i].contractResourceCode);
                        }
                    }
                    if (angular.isArray(contractResourceCodelist) && contractResourceCodelist.length > 0) {
                        wfWaiting.show();
                        var param = {
                            resourceID: $scope.opts.purchaseBase.resourceID,
                            purchaseWayCode: $scope.opts.purchaseBase.purchaseWayCode,
                            contractResourceCodelist: contractResourceCodelist,
                        }
                        $http.post(seagull2Url.getPlatformUrl('/PurchaseContract/GetContractState'), param)
                            .success(function (data) {
                                $scope.isSuccess = (data.data && data.data.length > 0);
                                for (var i = 0; i < data.data.length; i++) {
                                    for (var y = 0; y < $scope.data.length; y++) {
                                        var item = $scope.data[y];
                                        if (item.contractResourceCode == data.data[i].contractResourceCode) {
                                            item.contractStateCode = data.data[i].contractStateCode;
                                            item.contractStateName = data.data[i].contractStateName;
                                        }
                                    }
                                }
                                wfWaiting.hide();
                            })
                            .error(function (data, status) {
                                errorDialog.openErrorDialog(data, status, "获取合同状态异常");
                                $scope.isSuccess = false;
                                wfWaiting.hide();
                            });
                    }
                };
                //重新发起合同
                $scope.reStartContract = function (item) {
                    wfWaiting.show();
                    var param = {
                        bussinessTypeCode: $scope.opts.purchaseBase.purchaseBusinessTypeCode,
                        purchaseWayCode: $scope.opts.purchaseBase.purchaseWayCode,
                        resourceId: item.resourceID,
                        code: item.code,
                        operatorUserCode: item.operatorUser.id,
                        operatorUserName: item.operatorUser.displayName
                    }

                    $http({
                        method: 'POST',
                        url: seagull2Url.getPlatformUrl('/PurchaseContract/ReStartContract'),
                        data: param
                    }).error(function (data, status) {
                        errorDialog.openErrorDialog(data, status, "重新发起合同异常");
                        wfWaiting.hide();
                    })
                        .success(function (data) {
                            wfWaiting.hide();
                            item.contractStateCode = 1;
                            item.contractStateName = "未生效"
                            $scope.isSuccess = true;
                            var promise = sogModal.openAlertDialog("提示", "重新发起合同成功");
                            promise.then(function (result) {
                                location.reload();
                            }, function (rejectData) {
                                location.reload();
                            });
                        });

                };
                //打开供应商详情页面
                $scope.OpenSupplier = function (code) {
                    var url = $scope.common.webUrlBase + "/THRWebApp/SupplierV2/default.htm#/supplierDetails?supplierCode=" + code + "&random=" + Math.random();
                    $window.open(url);
                }
                //法人公司
                $scope.$watch('opts.corporationScopeList', function (newVal) {
                    $scope.model.corporationScopeList = newVal;
                });
                //中标供应商
                $scope.$watch('opts.awardSupplierList', function (newVal) {
                    if (!$scope.readOnly) {
                        $scope.model.supplierScopeList = newVal;
                        angular.forEach($scope.data, function (item) {
                            $scope.supplierChange(item);
                        })
                    }
                });
                //入围供应商
                $scope.$watch('opts.supplierScopeList', function (newVal) {
                    $scope.opts.supplierScopeList = newVal;
                });
            },
        };
    });
});