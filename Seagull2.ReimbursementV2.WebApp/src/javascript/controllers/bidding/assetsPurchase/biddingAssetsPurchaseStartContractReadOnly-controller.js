define(
    [
        'app',
        'biddingSynthesizeExtend',
        'fixedAssetsExtend',
        'leftNavExtend',
    ],
    function (app) {
        app.controller('biddingAssetsPurchaseStartContractReadOnly_controller', [
            '$scope', '$rootScope', '$http', 'wfOperate', 'viewData', 'errorDialog', 'wfWaiting', 'sogModal',
            'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', '$window','configure',
            function ($scope, $rootScope, $http, wfOperate, viewData, errorDialog, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $window, configure) {
                angular.extend($scope, viewData);
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                //流程标题
                $scope.mainTitle = viewData.viewModel.purchaseBase.purchaseWayName;
                $scope.title = viewData.viewModel.formAction.actionTypeName;
                //设置导航栏按钮状态 
                viewData.wfOperateOpts.allowCirculate = true;//传阅
                viewData.wfOperateOpts.allowDoAbort = false;//作废 
                viewData.wfOperateOpts.allowRejection = false;//退回 
                viewData.wfOperateOpts.allowPrint = false;//打印 
                viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底
                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                    viewData.wfOperateOpts.allowSave = false;//保存 
                }

                // 设置 
                $scope.settings = {
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 2000,
                        resourceId: $scope.resourceId,
                        scene: "StartContract",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfFixedAssets.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfFixedAssets.isGrantDiscountEnquiry,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                    },
                    // 采购时间安排信息
                    purchaseDateArrangeOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'ReadOnly',
                    },
                    //固定资产清单
                    fixedAssetsOpts: {
                        fixedAssetsList: $scope.viewModel.fixedAssetsList,
                    },
                    //单选人员
                    selectRadioPeople: {
                        selectMask: sogOguType.User,
                        multiple: false
                    },
                };
                // 基本信息                
                $scope.baseInfo = {
                    init: function () {
                        //获取合同状态 
                        wfWaiting.show();
                        $scope.isSuccess = false;
                        if (angular.isArray($scope.viewModel.perSignContractInfoList) == false) { return; }
                        var contractResourceCodelist = [];
                        for (var i = 0; i < $scope.viewModel.perSignContractInfoList.length; i++) {
                            if ($scope.viewModel.perSignContractInfoList[i].contractResourceCode) {
                                contractResourceCodelist.push($scope.viewModel.perSignContractInfoList[i].contractResourceCode);
                            }
                        }
                        if (angular.isArray(contractResourceCodelist) && contractResourceCodelist.length > 0) {
                            var param = {
                                resourceID: $scope.viewModel.purchaseBase.resourceID,
                                purchaseWayCode: $scope.viewModel.purchaseBase.purchaseWayCode,
                                contractResourceCodelist: contractResourceCodelist,
                            }
                            $http.post(seagull2Url.getPlatformUrl('/PurchaseContract/GetContractState'), param)
                                .success(function (data) {
                                    $scope.isSuccess = (data.data && data.data.length > 0);
                                    for (var i = 0; i < data.data.length; i++) {
                                        for (var y = 0; y < $scope.viewModel.perSignContractInfoList.length; y++) {
                                            var item = $scope.viewModel.perSignContractInfoList[y];
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
                            $scope.isSuccess = true;
                            wfWaiting.hide();
                        }
                    },

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
                                switch ($scope.viewModel.purchaseBase.purchaseBusinessTypeCode) {
                                    case 2:
                                        // 固定资产采购类合同
                                        contractTypeCode = 2;
                                        contractType = "assetsContractEntry";
                                        contractRouteType = "assetsContractView";
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

                //重新发起合同
                $scope.reStartContract = function (item) {
                    wfWaiting.show();
                    var param = {
                        bussinessTypeCode: $scope.viewModel.purchaseBase.purchaseBusinessTypeCode,
                        purchaseWayCode: $scope.viewModel.purchaseBase.purchaseWayCode,
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

                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    defer.resolve($scope.viewModel);
                };

                $scope.baseInfo.init();
            }]);
    });