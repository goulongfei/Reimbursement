define([
    'angular',
    'app',
    'commonUtilExtend'
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
    //选择法人公司
    app.directive("selectCorporation", function () {
        return {
            restrict: 'A',
            template: "<div style='height:25px;'><input type='text' class='meeting' style='display:inline-block;' ng-style='{width:readOnly?\"100%\":\"calc(100% - 22px)\",backgroundColor:opts.readOnly?\"#eee\":\"\"}' disabled ng-value='opts.corporationName' title='{{opts.corporationName}}' placeholder='请选择法人公司' sog-valide-status='法人公司'/>&nbsp;<i ng-click='open()' class='glyphicon glyphicon-folder-open' style='cursor:pointer;'></i></div>",
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
                                    that.queryCondition.pageIndex = pageIndex;
                                    $http.post(seagull2Url.getPlatformUrl("/Purchase/QueryCorporationInfo"), that.queryCondition)
                                        .success(function (data) {
                                            that.paginationConf.totalItems = data.totalItems;
                                            that.corporationList = data.corporationInfo;
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

    //选择记账公司-单选
    app.directive("selectChargecompany", function () {
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

    //委托信息
    app.directive("purchaseDelegationInfo", function () {
        return {
            restrict: 'A',
            scope: {
                readonly: "=",
                opts: "=",
                data: "=",
            },
            templateUrl: 'htmlTemplate/controlTemplate/common/purchaseDelegationInfo.html',
            replace: false,
            controller: function ($scope, $stateParams, $element, $attrs, $http, sogModal, seagull2Url, wfWaiting, ValidateHelper, sogValidator, sogOguType, $location, $window, errorDialog, configure) {
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                //单选人员
                $scope.operatorSelect = {
                    selectMask: sogOguType.User,
                    multiple: false
                };
                // 直接委托报告
                $scope.priceFileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                // 金额配置
                $scope.moneyOpts = {
                    min: 0,
                    max: 100000000000,
                    precision: 2
                };
                // 战采协议配置
                $scope.strategyPurchaseAgreementInfoOpts = {
                    strategyPurchaseAgreementInfoName: angular.isArray($scope.data) && $scope.data.length > 0 ? $scope.data[0].strategyPurchaseAgreementInfoName : null,
                    beforAppend: function (info) {
                        if (angular.isArray($scope.data) && $scope.data.length > 0) {
                            var item = $scope.data[0];
                            item.strategyPurchaseAgreementInfoCode = info.strategyPurchaseAgreementInfoCode;
                            item.strategyPurchaseAgreementInfoName = info.strategyPurchaseAgreementInfoName;
                        }
                    }
                };
                //添加
                $scope.addDetail = function () {
                    var list = {
                        checked: false,
                        delegationAmount: $scope.data.delegationAmount,
                        supplierName: $scope.data.supplierName,
                        industryDomainName: $scope.data.industryDomainName,
                        isTinySupplier: false,
                        operatorUser: "",
                        fixedAssetsGoodsNames: $scope.data.fixedAssetsGoodsNames,
                    };
                    $scope.data.push(list);
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
                // 选择供应商
                $scope.supplierOpts = {
                    supplierCatagory: $scope.opts.supplierCatagory,/*供应商类别 object*/
                    reason: $scope.opts.reason,/*直接委托理由， 1 是垄断*/
                    project: $scope.opts.project, /*项目 { projectCode: "", projectName: "" }*/
                    blackList: $scope.opts.blackList, /*供应商组件需要校验的字段黑名单，仅限供应商使用*/
                    actionTypeCode: $scope.opts.actionTypeCode,//直委类型
                    tinyAmount: $scope.opts.tinyAmount, //小微供应商限定金额
                    beforAppend: function (supplier, index) {
                        var item = $scope.data[index];
                        if (supplier) {
                            if (item.supplierCode !== supplier.supplierCode) {
                                item.strategyPurchaseAgreementInfoCode = null;
                                item.strategyPurchaseAgreementInfoName = null;
                            }
                            item.supplierCode = supplier.supplierCode;
                            item.supplierName = supplier.supplierName;
                            item.industryDomainCode = supplier.industryDomainCode;
                            item.industryDomainName = supplier.industryDomainName;
                            item.isTinySupplier = supplier.isTiny;
                        }
                        else {
                            item.strategyPurchaseAgreementInfoCode = null;
                            item.strategyPurchaseAgreementInfoName = null;
                            item.supplierCode = null;
                            item.supplierName = null;
                            item.industryDomainCode = null;
                            item.industryDomainName = null;
                            item.isTinySupplier = false;
                        }
                    },
                    isDirectCommissioned: true,
                };
                //获取供应商
                getFixedAssetsList = function () {
                    // test data
                    fixedAssetsList = [];
                    // 合约成本科目明细
                    angular.forEach($scope.opts.fixedAssetsList, function (fixedAssets) {
                        var item = {
                            goodsName: fixedAssets.goodsName,
                            perPrice: fixedAssets.perPrice,
                            count: fixedAssets.count,
                            measurementUnitName: "",
                            assetsTypeCode: fixedAssets.assetsTypeCode,
                            assetsTypeCnName: fixedAssets.assetsTypeCnName,
                            code: fixedAssets.code,
                        };
                        fixedAssetsList.push(item);
                    });
                    return fixedAssetsList;
                };
                // 固定资产清单
                $scope.fixedAssetsOpts = {
                    // test data
                    fixedAssetsList: getFixedAssetsList(),
                    beforAppend: function (index) {
                        var item = $scope.data[index];
                        var goodsNames = "";
                        var fixedAssetsPurchaseGoodsDetailInfoList = [];
                        if (this.fixedAssetsList.length > 0) {
                            angular.forEach(this.fixedAssetsList, function (fixedAssets) {
                                if (fixedAssets.checked) {
                                    goodsNames += fixedAssets.goodsName + "；";
                                    var fixedAssetsPurchaseGoodsDetailInfo = {
                                        fixedAssetsPurchaseGoodsInfoCode: fixedAssets.code,
                                        assetsTypeCode: fixedAssets.assetsTypeCode,
                                        assetsTypeCnName: fixedAssets.assetsTypeCnName,
                                        goodsName: fixedAssets.goodsName,
                                        perPrice: fixedAssets.perPrice,
                                        count: fixedAssets.count,
                                    };
                                    fixedAssetsPurchaseGoodsDetailInfoList.push(fixedAssetsPurchaseGoodsDetailInfo);
                                    fixedAssets.checked = false;
                                }
                            });
                            goodsNames = goodsNames.substring(0, goodsNames.length - 1);
                        }
                        item.fixedAssetsGoodsNames = goodsNames;
                        item.fixedAssetsPurchaseGoodsDetailInfoList = fixedAssetsPurchaseGoodsDetailInfoList;
                    },
                    beforClear: function (index) {
                        var item = $scope.data[index];
                        item.fixedAssetsGoodsNames = null;
                        item.fixedAssetsPurchaseGoodsDetailInfoList = [];

                    },
                };
                // 验证黑名单
                $scope.$watch('opts.blackList', function (newVal) {
                    $scope.supplierOpts.blackList = newVal;
                });
                // 项目
                $scope.$watch('opts.project', function (newVal) {
                    $scope.supplierOpts.project = newVal;
                });
                // 直接委托理由
                $scope.$watch('opts.reason', function (newVal) {
                    $scope.supplierOpts.reason = newVal;
                });
                // 供应商类别
                $scope.$watch('opts.supplierCatagory', function (newVal) {
                    $scope.supplierOpts.supplierCatagory = newVal;
                });
                //删除
                $scope.deleteDetail = function () {
                    var select = false;
                    for (var i = $scope.data.length - 1; i >= 0; i--) {
                        if ($scope.data[i].checked) {
                            select = true;
                        }
                    }
                    if (!select) {
                        sogModal.openAlertDialog("提示", "请先选中需要删除的委托信息");
                    } else {
                        var promise = sogModal.openConfirmDialog("删除", "确认是否删除委托信息?");
                        promise.then(function (v) {
                            for (var i = $scope.data.length - 1; i >= 0; i--) {
                                if ($scope.data[i].checked) {
                                    var delegationAmount = $scope.data[i].delegationAmount == undefined ? 0 : $scope.data[i].delegationAmount;
                                    $scope.opts.purchaseBase.purchaseAmount = $scope.opts.purchaseBase.purchaseAmount - delegationAmount;
                                    if (angular.isArray($scope.data[i].perSignContractAgreementScopeInfoList)) {
                                        for (var m = 0; m < $scope.data[i].perSignContractAgreementScopeInfoList.length; m++) {
                                            var per = $scope.data[i].perSignContractAgreementScopeInfoList[m];
                                            for (var j = 0; j < $scope.opts.contractAgreementScopeForPurchaseDelegation.length; j++) {
                                                var contractAgreement = $scope.opts.contractAgreementScopeForPurchaseDelegation[j];
                                                if (per.contractAgreementCode === contractAgreement.contractAgreementCode) {
                                                    contractAgreement.disabled = false;
                                                }
                                            }
                                        }
                                    }
                                    $scope.data.splice(i, 1);
                                }
                            }
                            $scope.select_all = false;
                        });
                    }
                };

                //获取采购金额
                $scope.getPurchaseAmount = function () {
                    $scope.opts.purchaseBase.purchaseAmount = 0;
                    for (var i = 0; i < $scope.data.length; i++) {
                        var item = $scope.data[i];
                        if (item.delegationAmount == undefined) {
                            item.delegationAmount = 0;
                        }
                        $scope.opts.purchaseBase.purchaseAmount += item.delegationAmount;
                        // 委托金额不能选小微供应商
                        if (angular.isNumber($scope.data[i].delegationAmount) && item.delegationAmount > $scope.opts.tinyAmount) {
                            if ($scope.data[i].isTinySupplier === true) {
                                item.supplierCode = null;
                                item.supplierName = null;
                                item.industryDomainCode = null;
                                item.industryDomainName = null;
                                item.isTinySupplier = false;
                            }
                        }
                    }

                };

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
                                    case 2:
                                        // 固定资产采购类合同
                                        contractTypeCode = 2;
                                        contractType = "assetsContractEntry";
                                        contractRouteType = "assetsContractView";
                                        break;
                                    case 4:
                                        // 项目定义类合同
                                        contractTypeCode = 7;
                                        contractType = "projectDefinitionEntry";
                                        contractRouteType = "projectDefinitionContractView";
                                        break;
                                    case 5:
                                        // 项目实施合同
                                        contractTypeCode = 3;
                                        contractType = "projectContractEntry";
                                        contractRouteType = "projectContractView";

                                        break;
                                    case 6:
                                        // 工程采购合同
                                        contractTypeCode = 4;
                                        contractType = "projectmaterialcontractentry";
                                        contractRouteType = "projectmaterialcontractview";
                                        break;
                                    case 7:
                                        // 营销类合同
                                        contractTypeCode = 5;
                                        contractType = "marketingContractEntry";
                                        contractRouteType = "marketingContractView";
                                        break;
                                    case 8:
                                        // 土地开发类合同
                                        contractTypeCode = 8;
                                        contractType = "developLandContractEntry";
                                        contractRouteType = "demolitionContractView";
                                        break;
                                    case 9:
                                        // 第三方维保类合同
                                        contractTypeCode = 9;
                                        contractType = "merchantsContractEntry";
                                        contractRouteType = "merchantsContractView";
                                        break;
                                    case 10:
                                        // 非开发运营类合同
                                        contractTypeCode = 13;
                                        contractType = "commercialOperationContractEntry";
                                        contractRouteType = "commercialOperationContractView";
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
                // 供应商详情
                $scope.checkSupplierDetails = function (code) {
                    var config = {};
                    var BaseRootUrl = configure.getConfig(config, 'common').apiUrlBase;
                    var url = "/THRWebApp/SupplierV2/default.htm#/supplierDetails?supplierCode=" + code;
                    $window.open(BaseRootUrl + url);
                };
                // 查看采购内容
                $scope.showfixedAssetsGoods = function (fixedAssetsPurchaseGoodsDetailInfoList) {
                    var viewPath = 'htmlTemplate/dialogTemplate/common/fixedAssetsPurchaseGoods.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>',
                        promise = sogModal.openDialog(template, '查看采购明细', ["$scope", function ($modelScope) {
                            $modelScope.data = fixedAssetsPurchaseGoodsDetailInfoList;
                            $modelScope.readOnly = true;
                        }], $scope, { containerStyle: { width: '50%', marginRight: "auto", marginLeft: "auto" } },
                            function (v, defer) {//50%
                                defer.resolve(v);//确定
                                $scope.opts.beforAppend($scope.index);
                            }, function (v, defer) {
                                defer.resolve(v);//取消
                            });
                };
                // 查看所属合约
                $scope.lookContractAgreement = function (purchaseDelegationInfo) {
                    var viewPath = 'htmlTemplate/dialogTemplate/common/perSignContractAgreement.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>',
                        promise = sogModal.openDialog(template, '查看所属合约', ["$scope", function ($modelScope) {
                            $modelScope.lookContractAgreementList = [];
                            $modelScope.readOnly = true;
                            $modelScope.isBusinessAgreement = false;
                            if ($scope.opts.isBusinessAgreement == true)
                                $modelScope.isBusinessAgreement = true;
                            angular.forEach(purchaseDelegationInfo.perSignContractAgreementScopeInfoList, function (perSignContractAgreementScopeInfo) {
                                angular.forEach($scope.opts.contractAgreementScopeList, function (contractAgreementScope) {
                                    if (perSignContractAgreementScopeInfo.contractAgreementCode === contractAgreementScope.contractAgreementCode) {
                                        var lookContractAgreement = {
                                            projectName: contractAgreementScope.projectName,
                                            stageAreaName: contractAgreementScope.stageAreaName,
                                            contractAgreementName: contractAgreementScope.contractAgreementName,
                                            costTargetAmount: contractAgreementScope.contractAgreementScope,
                                        };
                                        $modelScope.lookContractAgreementList.push(lookContractAgreement);
                                    }
                                });
                            });
                            $modelScope.data = $modelScope.lookContractAgreementList;
                        }], $scope, { containerStyle: { width: '50%', marginRight: "auto", marginLeft: "auto" } },
                            function (v, defer) {//50%
                                defer.resolve(v);//确定                
                            }, function (v, defer) {
                                defer.resolve(v);//取消
                            });
                };
                // 选择所属合约
                $scope.showContractAgreement = function (purchaseDelegationInfo) {
                    if (!$scope.opts.contractAgreementScopeForPurchaseDelegation || !$scope.opts.contractAgreementScopeForPurchaseDelegation.length) {
                        var message = "请先添加合约规划！";
                        sogModal.openAlertDialog("提示", message);
                        return false;
                    }
                    var viewPath = 'htmlTemplate/dialogTemplate/common/perSignContractAgreement.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>',
                        promise = sogModal.openDialog(template, '选择所属合约', ["$scope", function ($modelScope) {
                            $modelScope.data = $scope.opts.contractAgreementScopeForPurchaseDelegation;
                            angular.forEach($modelScope.data, function (item) {
                                item.selected = false;
                                angular.forEach(purchaseDelegationInfo.perSignContractAgreementScopeInfoList, function (per) {
                                    if (per.contractAgreementCode === item.contractAgreementCode) {
                                        item.disabled = false;
                                        item.selected = true;
                                    }
                                });
                            });
                            $modelScope.projectCollection = [];
                            $modelScope.projectCode = $scope.opts.project.projectCode;
                            $modelScope.projectName = $scope.opts.project.projectName;
                            $modelScope.stageAreaName = $scope.opts.stageAreaName;
                            $modelScope.stageAreaCode = $scope.opts.stageAreaCode;
                            if (!$modelScope.stageAreaName) {
                                angular.forEach($scope.opts.stageAreaList, function (item) {
                                    $modelScope.stageAreaName += item.stageAreaName + ';';
                                });
                            }
                            readOnly = false;
                            //商写营销类情况
                            $modelScope.isBusinessAgreement = false;
                            if ($scope.opts.isBusinessAgreement == true)
                                $modelScope.isBusinessAgreement = true;
                            // 填充项目选项
                            angular.forEach($scope.opts.contractAgreementScopeForPurchaseDelegation, function (item) {
                                var isExistProject = false;
                                var project = {
                                    code: item.projectCode,
                                    name: item.projectName,
                                };
                                angular.forEach($modelScope.projectCollection, function (p) {
                                    if (p.code === item.projectCode) {
                                        isExistProject = true;
                                        return;
                                    }
                                });
                                if (!isExistProject) {
                                    $modelScope.projectCollection.push(project);
                                }
                            });
                            // 填充期区选项
                            $modelScope.projectChange = function (projectCode) {
                                $modelScope.stageAreaCollection = [];
                                if (projectCode === undefined || projectCode === "")
                                    return;
                                angular.forEach($scope.opts.contractAgreementScopeForPurchaseDelegation, function (item) {
                                    var isExistStageArea = false;
                                    if (projectCode === item.projectCode) {
                                        var stageArea = {
                                            code: item.stageAreaCode,
                                            name: item.stageAreaName,
                                        };
                                        angular.forEach($modelScope.stageAreaCollection, function (s) {
                                            if (s.code === item.stageAreaCode) {
                                                isExistStageArea = true;
                                                return;
                                            }
                                        });
                                        if (!isExistStageArea) {
                                            $modelScope.stageAreaCollection.push(stageArea);
                                        }
                                    }
                                });
                            };

                            //确定
                            $modelScope.selectedOk = function () {
                                //直接委托项目定义类
                                if ($scope.opts.actionTypeCode === 4) {
                                    if ($modelScope.data.length > 1) {
                                        var flagCount = 0;
                                        var selectCount = 0;
                                        angular.forEach($modelScope.data, function (item) {
                                            if ((item.contractAgreementTypeCode === "7" || item.contractAgreementTypeCode === 7) && item.selected) {
                                                flagCount += 1;
                                            }
                                            if (item.selected) {
                                                selectCount += 1;
                                            }
                                        });
                                        if (flagCount > 0 && flagCount < selectCount) {
                                            sogModal.openAlertDialog("提示", "一个合同不能同时关联营销合约与四项合约");
                                            return false;
                                        }
                                    }
                                }
                                var perSignContractAgreementScopeInfoList = [];
                                angular.forEach($modelScope.data, function (item) {
                                    if (item.selected) {
                                        item.disabled = true;
                                        var perSignContractAgreementScopeInfo = {
                                            contractAgreementCode: item.contractAgreementCode,
                                            contractAgreementName: item.contractAgreementName,
                                            contractAgreementScopeAmount: item.costTargetAmount,
                                        };
                                        perSignContractAgreementScopeInfoList.push(perSignContractAgreementScopeInfo);
                                    }
                                });
                                purchaseDelegationInfo.perSignContractAgreementScopeInfoList = perSignContractAgreementScopeInfoList;
                                $modelScope.confirm();
                            };

                            //全选
                            $modelScope.selectAll = function (allChecked) {
                                for (var i = 0; i < $modelScope.data.length; i++) {
                                    if (!$modelScope.data[i].disabled) {
                                        $modelScope.data[i].selected = allChecked;
                                    }
                                }
                            };
                            //复选框选中
                            $modelScope.selectOne = function (selected) {
                                for (var i = 0; i < $modelScope.data.length; i++) {
                                    if (!$modelScope.data[i].selected) {
                                        $modelScope.select_all = false;
                                        return;
                                    } else {
                                        $modelScope.select_all = true;
                                    }
                                }
                            };
                        }], $scope, { 'containerStyle': { 'width': '50%', 'marginRight': 'auto', 'marginLeft': 'auto' } },
                            function (v, defer) {//50%
                                defer.resolve(v);//确定                
                            }, function (v, defer) {
                                angular.forEach($scope.opts.contractAgreementScopeForPurchaseDelegation, function (item) {
                                    angular.forEach(purchaseDelegationInfo.perSignContractAgreementScopeInfoList, function (perSignContractAgreementScopeInfo) {
                                        if (perSignContractAgreementScopeInfo.contractAgreementCode === item.contractAgreementCode) {
                                            item.disabled = true;
                                            item.selected = true;
                                            return;
                                        }
                                    });
                                });
                                defer.resolve(v);//取消
                            });
                };
                //获取合同状态
                if ($scope.opts.scene == 'startupContract' && $scope.readonly === true) {
                    wfWaiting.show();
                    $scope.isSuccess = false;
                    if (angular.isArray($scope.data) == false) { return; }
                    var contractResourceCodelist = [];
                    for (var i = 0; i < $scope.data.length; i++) {
                        if ($scope.data[i].contractResourceCode) {
                            contractResourceCodelist.push($scope.data[i].contractResourceCode);
                        }
                    }
                    if (angular.isArray(contractResourceCodelist) && contractResourceCodelist.length > 0) {
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
                    else {
                        wfWaiting.hide();
                        $scope.isSuccess = true;
                    }
                }
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
                    };

                    $http({
                        method: 'POST',
                        url: seagull2Url.getPlatformUrl('/PurchaseContract/ReStartContract'),
                        data: param
                    }).error(function (data, status) {
                        errorDialog.openErrorDialog(data, status, "重新发起合同异常");
                        wfWaiting.hide();
                    }).success(function (data) {
                        wfWaiting.hide();
                        sogModal.openAlertDialog("提示", "重新发起合同成功");
                        item.contractStateCode = 1;
                        item.contractStateName = "未生效";
                        $scope.isSuccess = true;
                    });

                };
                // 查看初审环节
                $scope.openFirstTrial = function () {
                    $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                        .success(function (data) {
                            var urlat = data;
                            if (urlat !== null) {
                                urlat = urlat.replace(/"/g, "");
                                var bussinessType = '';
                                if ($stateParams.viewData.viewModel.formAction.actionTypeCode === 5) {
                                    bussinessType = 'directCommissionedEngineeringInitialAudit';
                                }
                                else if ($stateParams.viewData.viewModel.formAction.actionTypeCode === 6) {
                                    bussinessType = 'directCommissionedImplementInitialAudit';
                                }
                                var url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/" + bussinessType + "/" + $stateParams.activityId + "?_at=" + urlat;
                                $window.open(url, '_blank');
                            }
                        })
                        .error(function (data, status) {
                            errorDialog.openErrorDialog(data, status, "查看初审详情异常");
                            wfWaiting.hide();
                        });
                };
                // 查看复审环节
                $scope.openReTrial = function () {
                    $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                        .success(function (data) {
                            var urlat = data;
                            if (urlat !== null) {
                                urlat = urlat.replace(/"/g, "");
                                var bussinessType = '';
                                if ($stateParams.viewData.viewModel.formAction.actionTypeCode === 5) {
                                    bussinessType = 'directCommissionedEngineeringAuditImplementation';
                                }
                                else if ($stateParams.viewData.viewModel.formAction.actionTypeCode === 6) {
                                    bussinessType = 'directCommissionedImplementAuditImplementation';
                                }
                                var url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/" + bussinessType + "/" + $stateParams.activityId + "?_at=" + urlat;
                                $window.open(url, '_blank');
                            }
                        })
                        .error(function (data, status) {
                            errorDialog.openErrorDialog(data, status, "查看初审详情异常");
                            wfWaiting.hide();
                        });
                };
            },
        };
    });

    //战略框架协议信息
    app.directive("purchaseStrategyContractInfo", function () {
        return {
            restrict: 'A',
            scope: {
                readonly: "=",
                opts: "=",
                data: "=",
            },
            templateUrl: 'htmlTemplate/controlTemplate/common/purchaseStrategyContractInfo.html',
            replace: false,
            controller: function ($scope, $stateParams, $element, $attrs, $http, sogModal, seagull2Url, wfWaiting, ValidateHelper, sogValidator, sogOguType, $location, $window, errorDialog, configure) {
                $scope.common = {};
                configure.getConfig($scope.common, 'common');

                //选择拟变更战采协议
                $scope.addDetail = function () {
                    var viewpath = './htmlTemplate/dialogTemplate/common/purchaseStrategyContractSelector.html';
                    sogModal.openDialog('<div><div ng-include="\'' + viewpath + '\'"></div></div>',
                        '选择战略框架协议', ["$scope", function ($modelScope) {
                            $modelScope.model = {

                                queryCondition: {
                                    supplierName: "",
                                    contractName: "",
                                    pageSize: 6,
                                    pageIndex: 1
                                },
                                paginationConf: {
                                    currentPage: 1,
                                    itemsPerPage: 6,
                                    totalItems: 0
                                },
                                strategyContractList: [],
                            };

                            //选战采协议-查询刷新数据
                            $modelScope.setCondition = function () {
                                purchaseStrategySearch(1);
                            }

                            //选战采协议-条件重置
                            $modelScope.renewConditon = function () {
                                var that = $modelScope.model;
                                that.queryCondition.supplierName = "";
                                that.queryCondition.contractName = "";
                                purchaseStrategySearch(1);
                            }

                            //查询战采协议
                            var purchaseStrategySearch = function (pageIndex) {
                                var url = seagull2Url.getPlatformUrl('/Purchase/GetPurchaseStrategyContractList');
                                var that = $modelScope.model;
                                that.queryCondition.pageIndex = pageIndex;
                                wfWaiting.show();
                                $http.post(url, that.queryCondition)
                                    .success(function (data) {
                                        $modelScope.model.paginationConf.totalItems = data.total;
                                        $modelScope.model.strategyContractList = data.data;
                                        wfWaiting.hide();
                                    })
                                    .error(function (data, status) {
                                        errorDialog.openErrorDialog(data, status, "查询战略框架协议数据异常");
                                        wfWaiting.hide();
                                    });
                            }
                            var AddNewProposedChangeInfo = function (newProposedChangeInfo) {
                                if ($scope.data == null) {
                                    $scope.data = [];
                                    $scope.data.push(newProposedChangeInfo);
                                    //getPurchaseStrategyFile($scope.data[0]);
                                } else {
                                    if ($scope.data.length == 0) {
                                        $scope.data.push(newProposedChangeInfo);
                                    } else {
                                        var flag = false;
                                        angular.forEach($scope.data, function (item) {
                                            if (item.agreementCode == newProposedChangeInfo.agreementCode) {
                                                flag = true;
                                            }
                                        });
                                        if (flag) {
                                            sogModal.openAlertDialog('提示', '此合约已经添加，请勿重复添加同一条合约！');
                                        } else {
                                            $scope.data.push(newProposedChangeInfo);
                                        }
                                    }
                                }
                            }

                            purchaseStrategySearch(1);

                            //单选方法
                            $modelScope.strategyContractOk = function (item) {
                                if (item) {
                                    var contractResult = JSON.parse(item);

                                    var newProposedChangeInfo = {
                                        supplierCode: contractResult.supplierCode,
                                        supplierName: contractResult.supplierName,
                                        industryDomainCode: contractResult.tradeAreaCode,
                                        industryDomainName: contractResult.tradeAreaName,
                                        agreementCode: contractResult.code,
                                        agreementName: contractResult.contractFileName,
                                        agreementStartTime: contractResult.contractStartTime,
                                        agreementEndTime: contractResult.contractEndTime,
                                        agreementDelayDays: 0
                                    }
                                    AddNewProposedChangeInfo(newProposedChangeInfo);
                                    $modelScope.confirm(contractResult);
                                    //$scope.confirm(contractResult);
                                }
                                else {
                                    sogModal.openAlertDialog('提示', '请选择协议！');
                                }
                            }
                            //分页监控
                            $modelScope.$watch('model.paginationConf.currentPage', function (newVal, oldVal) {
                                purchaseStrategySearch(newVal);
                            });

                        }], $scope, { containerStyle: { width: '80%', marginRight: "auto", marginLeft: "auto" } },
                        function (v, defer) {//50%
                            defer.resolve(v);//确定
                            //$scope.opts.corporationName = v.corporationName;
                            //$scope.opts.beforAppend(v);
                        }, function (v, defer) {
                            defer.resolve(v);//取消
                        });
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

                $scope.changeDate = function (item) {

                    if (item.agreementDelayTime == null || item.agreementDelayTime.length == 0 || item.agreementDelayTime == undefined) return false;

                    var newContractDelayTime = new Date(item.agreementDelayTime);
                    var nowDateTime = new Date();
                    if (newContractDelayTime.getTime() < nowDateTime.getTime()) {
                        if (newContractDelayTime.getDay() != nowDateTime.getDay()) {
                            return false;
                        }
                    }
                    var dateSpan = Math.abs(newContractDelayTime.getTime() - nowDateTime.getTime());

                    item.agreementDelayDays = Math.ceil(dateSpan / (24 * 3600 * 1000));

                    //angular.forEach(newValue, function (newItem) {
                    //    if (newItem.contractDelayTime != undefined) {

                    //    }
                    //});
                };

                $scope.deleteDetail = function () {
                    var select = false;
                    for (var i = $scope.data.length - 1; i >= 0; i--) {
                        if ($scope.data[i].checked) {
                            select = true;
                        }
                    }
                    if (!select) {
                        sogModal.openAlertDialog("提示", "请先选中需要删除的委托信息");
                    } else {
                        var promise = sogModal.openConfirmDialog("删除", "确认是否删除拟变更信息?");
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

            },
        };
    });

    //战采协议
    app.directive("selectStrategyPurchaseAgreementInfo", function () {
        return {
            restrict: 'A',
            template: "<div><input style='width:82%;' type='text' class='meeting' disabled ng-value='data.strategyPurchaseAgreementInfoName' title='{{data.strategyPurchaseAgreementInfoName}}' placeholder='请选择'/>&nbsp;<i ng-click='open()' class='glyphicon glyphicon-folder-open' style='cursor:pointer;'></i>&nbsp<i ng-click='remove()' class='glyphicon glyphicon-remove' style='cursor: pointer;'></i></div>",
            scope: {
                opts: "=",
                data: "=",
            },
            replace: true,
            controller: function ($scope, $element, $attrs, $http, sogModal, seagull2Url, wfWaiting, ValidateHelper, sogValidator, commissionBaseOpts, errorDialog) {
                $scope.opts = commissionBaseOpts.get($scope.opts);
                $scope.data.strategyPurchaseAgreementInfoName = $scope.data.strategyPurchaseAgreementInfoName || "";
                $scope.open = function () {
                    $scope.opts.refreshOpts($scope.opts);
                    var viewPath = 'htmlTemplate/controlTemplate/common/strategyPurchaseAgreementInfoSelect.html';
                    var template = '<div ng-include="\'' + viewPath + '\'"></div>',
                        promise = sogModal.openDialog(template, '选择战采协议', ["$scope", function ($modelScope) {
                            $modelScope.model = {
                                queryCondition: {
                                    strategyPurchaseAgreementInfoName: "",
                                    industryDomainName: "",
                                    supplierCode: "",
                                    pageSize: 6,
                                    pageIndex: 1
                                },
                                paginationConf: {
                                    currentPage: 1,
                                    itemsPerPage: 6,
                                    totalItems: 0
                                },
                                // supplierNameKeyWord: '',
                                supplierName: $scope.data.supplierName,
                                agreementInfoNameKeyWord: '',
                                industryDomainNameKeyWord: '',
                                selectedItem: null,
                                strategyPurchaseAgreementInfoList: [],
                                isLoaded: false,
                                chooseItem: function (item) {
                                    this.selectedItem = item;
                                    this.selectedItem.strategyPurchaseAgreementInfoName = item.strategyPurchaseAgreementInfoName;
                                },

                                loadData: function (pageIndex) {
                                    this.queryCondition.strategyPurchaseAgreementInfoName = this.agreementInfoNameKeyWord;
                                    this.queryCondition.industryDomainName = this.industryDomainNameKeyWord;
                                    this.queryCondition.supplierCode = $scope.data.supplierCode;
                                    this.queryCondition.pageSize = this.paginationConf.itemsPerPage;
                                    this.selectedItem = null;
                                    this.isLoaded = true;
                                    this.queryData($modelScope.model.paginationConf.currentPage, false);
                                },
                                query: function () {
                                    this.queryCondition.strategyPurchaseAgreementInfoName = this.agreementInfoNameKeyWord;
                                    this.queryCondition.industryDomainName = this.industryDomainNameKeyWord;
                                    this.queryCondition.supplierCode = $scope.data.supplierCode;
                                    this.queryCondition.pageSize = this.paginationConf.itemsPerPage;
                                    this.selectedItem = null;
                                    this.isLoaded = true;
                                    this.queryData(1, false);
                                },
                                queryData: function (pageIndex) {
                                    wfWaiting.show();
                                    var that = $modelScope.model;
                                    that.queryCondition.pageIndex = pageIndex;
                                    $http.post(seagull2Url.getPlatformUrl("/Purchase/QueryStrategyPurchaseAgreementInfo"), that.queryCondition)
                                        .success(function (data) {
                                            that.paginationConf.totalItems = data.totalItems;
                                            that.strategyPurchaseAgreementInfoList = data.strategyPurchaseAgreementInfo;
                                            wfWaiting.hide();
                                        })
                                        .error(function (data, status) {
                                            errorDialog.openErrorDialog(data, status, "查询战采协议数据异常");
                                            wfWaiting.hide();
                                        });

                                },
                                clear: function () {
                                    //  this.supplierNameKeyWord = '';
                                    this.agreementInfoNameKeyWord = '';
                                    this.industryDomainNameKeyWord = '';
                                },
                                confirm: function () {
                                    if (this.selectedItem != null) {
                                        $modelScope.confirm(this.selectedItem);
                                    } else {
                                        sogModal.openAlertDialog("提示", "请选择一个战采协议");
                                    }

                                },
                            };
                            //分页监控
                            $modelScope.$watch('model.paginationConf.currentPage', function (newVal, oldVal) {
                                if ($modelScope.model.isLoaded) {
                                    $modelScope.model.loadData(newVal, true);
                                }
                            });
                        }], $scope, { containerStyle: { width: '80%', marginRight: "auto", marginLeft: "auto" } },
                            function (v, defer) {//50%
                                defer.resolve(v);//确定
                                $scope.data.strategyPurchaseAgreementInfoName = v.strategyPurchaseAgreementInfoName;
                                $scope.opts.beforAppend(v);
                            }, function (v, defer) {
                                defer.resolve(v);//取消
                            });
                };

                $scope.remove = function () {
                    $scope.opts.strategyPurchaseAgreementInfoName = "";
                };

            }
        };

    });
});