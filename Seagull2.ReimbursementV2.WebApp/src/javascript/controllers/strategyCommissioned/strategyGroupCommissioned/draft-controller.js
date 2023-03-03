define(
    [
        'app',
        'corporationRadioSelector',
        'supplierCategory',
        'commonUtilExtend',
        'supplierCategoryExtend',
        'supplierInfoExtendV4',
        'strategyPurchaseAgreementInfoExtend',
    ],
    function (app) {
        app.controller('strategyGroupCommissionedDraft_controller', [
            '$scope', '$http', 'viewData', 'sogModal', 'seagull2Url', 'sogOguType', 'exception','wfWaiting',
            function ($scope, $http, viewData, sogModal, seagull2Url, sogOguType, exception, wfWaiting) {
                angular.extend($scope, viewData);
                $scope.mainTitle = '采购管理';
                $scope.isOpinionsShow = $scope.opinions.length > 0 ? true : false;
                //隐藏打印和传阅
                $scope.wfOperateOpts.allowPrint = false; //打印
                $scope.wfOperateOpts.allowRejection = false;//退回
                $scope.wfOperateOpts.allowCirculate = false;//传阅 

                var apiUrl = {
                    PurchaseContractCategoryUrl: seagull2Url.getPlatformUrl('/Purchase/GetPurchaseContractCategory')
                };
                //基本信息
                $scope.baseInfo = {
                    //附件设置项
                    fileopts: {
                        'resourceId': $scope.viewModel.resourceID,
                    },
                    //单选人员
                    selectRadioPeople: {
                        selectMask: sogOguType.User,
                        multiple: false
                    },
                    //多选人员
                    selectCheckBoxPeople: {
                        selectMask: sogOguType.User,
                        multiple: true
                    },
                    //合约分类
                    getPurchaseContractCategorys: function () {
                        $http.get(apiUrl.PurchaseContractCategoryUrl)
                            .success(function (data) {
                                $scope.PurchaseContractCategorys = data;
                            }).error(function (error) {
                                sogModal.openErrorDialog(error);
                            });
                    },
                    //选择合约分类
                    initPurchaseContractCategory: function () {
                        angular.forEach($scope.PurchaseContractCategorys, function (v) {
                            if (v.code == $scope.viewModel.p_StrategyPurchasePlanCase.contractAgreementTypeCode) {
                                $scope.viewModel.p_StrategyPurchasePlanCase.contractAgreementTypeName = v.cnName;
                            }
                        });
                    },
                    //招标人
                    companySelected: function () {
                        //每次重新选择招标人将之前选择的清空
                        $scope.viewModel.p_StrategyPurchasePlanCase.bidderCode = "";
                        $scope.viewModel.p_StrategyPurchasePlanCase.bidderName = "";
                        var viewpath = './htmlTemplate/dialogTemplate/common/corporationRadioSelector.html';
                        var projectDetailResult = sogModal.openDialog('<div><div ng-include="\'' + viewpath + '\'"></div></div>',
                            '选择招标人', "corporationRadioSelector_controller", $scope, { containerStyle: { width: '40%' } });
                        projectDetailResult.then(function (resultData) {
                            $scope.viewModel.p_StrategyPurchasePlanCase.bidderCode = resultData.code;
                            $scope.viewModel.p_StrategyPurchasePlanCase.bidderName = resultData.cnName;
                        });
                    },
                    //选择供应商类别
                    supplierTypeSelected: function () {
                        //清空数据
                        $scope.viewModel.p_IndustryDomainScopes = [];
                        $scope.viewModel.industryDomainName = "";
                        var tempUrl = './htmlTemplate/dialogTemplate/common/supplierCategory.html';
                        var supplierTypeDialogUrl = '<div style="height:75%;" ng-include="\'' + tempUrl + '\'"></div>';
                        var promise = sogModal.openDialog(supplierTypeDialogUrl, "选择行业领域", "supplierCategory_controller", $scope);
                        promise.then(function (result) {
                            angular.forEach(result, function (v) {
                                var obj = {
                                    industryDomainCode: v.id,
                                    industryDomainName: v.title
                                };
                                $scope.viewModel.p_IndustryDomainScopes.push(obj);
                            });
                            $scope.baseInfo.supplierTypeInit();
                            $scope.supplierOpts.supplierCatagory = $scope.viewModel.p_IndustryDomainScopes;
                        });
                    },
                    supplierTypeInit: function () {
                        $scope.viewModel.industryDomainName = "";
                        angular.forEach($scope.viewModel.p_IndustryDomainScopes, function (v) {
                            $scope.viewModel.industryDomainName += v.industryDomainName + ';';
                        });
                    },
                    // 战采协议配置
                    strategyPurchaseAgreementInfoOpts: {
                        strategyPurchaseAgreementInfoName: $scope.viewModel.p_StrategyPurchasePlanCase.renewStrategyPurchaseAgreementName,
                        type: 'strategyPurchase',
                        beforAppend: function (info) {
                            if (info) {
                                $scope.viewModel.p_StrategyPurchasePlanCase.renewStrategyPurchaseAgreementCode = info.strategyPurchaseAgreementInfoCode;
                                $scope.viewModel.p_StrategyPurchasePlanCase.renewStrategyPurchaseAgreementName = info.strategyPurchaseAgreementInfoName;
                            }
                        },
                        beforDelete: function () {
                            $scope.viewModel.p_StrategyPurchasePlanCase.renewStrategyPurchaseAgreementCode = null;
                            $scope.viewModel.p_StrategyPurchasePlanCase.renewStrategyPurchaseAgreementName = null;
                        },
                    },
                };

                //页面权限加载--对接统一权限资源权限
                function CheckPermission() {
                    var command = {
                        permissionValue: "strategyPurchaseFontOaportal",
                        permissionName: "战略采购"
                    };
                    var url = seagull2Url.getPlatformUrl("/BiddingAbnormityClewInfo/GetUpmsPermissions");
                    wfWaiting.show();
                    $http.post(url, command)
                        .success(function (data) {
                            wfWaiting.hide();
                            if (data.success) {
                                if (!data.data) {
                                    exception.throwException(500, { message: "您没有战略采购相关权限，请联系管理员!" });
                                }
                            } else {
                                exception.throwException(500, { message: data.message });
                            }
                        });
                }
                CheckPermission();

                //战略协议信息
                $scope.strategyGroupCommissioned = {
                    add: function () {
                        var StrategyGroupCommissioned = {};
                        $scope.viewModel.p_StrategyPurchaseAgreementInfos.push(StrategyGroupCommissioned);
                    },
                    selectAll: function (check, arr) {
                        angular.forEach(arr, function (v) {
                            v.checked = check;
                        });
                    },
                    selectOne: function (item, arr) {
                        if (!item.checked) {
                            $scope.selectStrategyGroupCommissionedCheckedAll = false;
                        } else {
                            var index = 0;
                            angular.forEach(arr, function (v) {
                                if (v.checked) {
                                    index++;
                                }
                            });
                            if (arr.length == index) {
                                $scope.selectStrategyGroupCommissionedCheckedAll = true;
                            } else {
                                $scope.selectStrategyGroupCommissionedCheckedAll = false;
                            }
                        };
                    },
                    delete: function () {
                        if ($scope.viewModel.p_StrategyPurchaseAgreementInfos.length == 0) {
                            sogModal.openAlertDialog("战采协议信息", "战采协议信息为空不能删除！");
                            return;
                        }

                        var count = 0;
                        var arr = [];
                        angular.forEach($scope.viewModel.p_StrategyPurchaseAgreementInfos, function (v) {
                            if (!v.checked) {
                                arr.push(v);
                            } else {
                                count++;
                            }
                        });
                        if (count == 0) {
                            sogModal.openAlertDialog("战采协议信息", "请至少选择一条需要删除的战采协议信息！");
                            return;
                        }
                        $scope.viewModel.p_StrategyPurchaseAgreementInfos = arr;
                        if (!$scope.viewModel.p_StrategyPurchaseAgreementInfos.length) {
                            $scope.selectStrategyGroupCommissionedCheckedAll = false;
                        }
                    },
                    getIndustryDomain: function (item) {

                    }
                };

                $scope.supplierOpts = {
                    'actionTypeCode': 2,
                    //供应商类别
                    'supplierCatagory': [],
                    ////小微供应商限定金额,-1表示不可以选择小微供应商
                    //'tinyAmount': -1,
                    'blackList': ['supplierCatagory'],
                    beforAppend: function (supplier, index) {
                        var item = $scope.viewModel.p_StrategyPurchaseAgreementInfos[index];
                        item.industryDomainName = "";
                        item.industryDomainCode = "";
                        item.supplierCode = "";
                        item.supplierName = "";
                    },
                    isDirectCommissioned: false,
                };


                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    defer.resolve($scope.viewModel);
                };
            }]);
    });