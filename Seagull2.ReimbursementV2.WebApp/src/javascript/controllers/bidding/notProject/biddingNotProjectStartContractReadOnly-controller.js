define([
    'app',
    'commonUtilExtend', 'leftNavExtend','biddingSynthesizeExtend'],
    function (app) {
        app.controller('biddingNotProjectStartContractReadOnly_controller', [
            '$scope', 'viewData', '$http', 'seagull2Url', 'configure', '$window', 'sogOguType', 'wfWaiting', 'sogModal','errorDialog',
            function ($scope, viewData, $http, seagull2Url, configure, $window, sogOguType, wfWaiting, sogModal, errorDialog) {
                angular.extend($scope, viewData);
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                //流程标题
                $scope.mainTitle = viewData.viewModel.purchaseBasePEMu.purchaseWayName;
                $scope.title = viewData.viewModel.formAction.actionTypeName;
                
                $scope.wfOperateOpts.allowRejection = false;//退回
                $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
                $scope.wfOperateOpts.allowPrint = false;//打印
                //基本信息
                $scope.baseInfo = {
                    //是否显示合计中标金额
                    isAllSupplierFinalQuoteAmount: true,
                    isShowContractOption: false,
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 1000,
                        resourceId: $scope.resourceId,
                        scene: 'StartContract',
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                    },
                    // 采购时间安排信息
                    purchaseDateArrangeOpts: {
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'ReadOnly',
                    },
                    //单选人员
                    selectRadioPeople: {
                        selectMask: sogOguType.User,
                        multiple: false
                    }
                };
                //获取合同状态
                $scope.getContractState = function () {
                    wfWaiting.show();
                    if (angular.isArray($scope.viewModel.perSignContractInfoPEMus) === false) { return; }
                    var contractResourceCodelist = [];
                    for (var i = 0; i < $scope.viewModel.perSignContractInfoPEMus.length; i++) {
                        if ($scope.viewModel.perSignContractInfoPEMus[i].contractResourceCode) {
                            contractResourceCodelist.push($scope.viewModel.perSignContractInfoPEMus[i].contractResourceCode);
                        }
                    }
                    if (angular.isArray(contractResourceCodelist) && contractResourceCodelist.length > 0) {
                        var param = {
                            resourceID: $scope.resourceId,
                            purchaseWayCode: $scope.viewModel.purchaseBasePEMu.purchaseWayCode,
                            contractResourceCodelist: contractResourceCodelist,
                        }
                        $http.post(seagull2Url.getPlatformUrl('/PurchaseContract/GetContractState'), param)
                            .success(function (data) {
                                $scope.baseInfo.isShowContractOption = (data.data && data.data.length > 0);
                                for (var i = 0; i < data.data.length; i++) {
                                    for (var y = 0; y < $scope.viewModel.perSignContractInfoPEMus.length; y++) {
                                        var item = $scope.viewModel.perSignContractInfoPEMus[y];
                                        if (item.contractResourceCode === data.data[i].contractResourceCode) {
                                            item.contractStateCode = data.data[i].contractStateCode;
                                            item.contractStateName = data.data[i].contractStateName;
                                        }
                                    }
                                }
                                wfWaiting.hide();
                            })
                            .error(function (data, status) {
                                errorDialog.openErrorDialog(data, status, "获取合同状态异常");
                                $scope.baseInfo.isShowContractOption = false;
                                wfWaiting.hide();
                            });
                    }
                    else {
                        $scope.isSuccess = true;
                        wfWaiting.hide();
                    }
                };
                $scope.getContractState();

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
                                switch ($scope.viewModel.purchaseBasePEMu.purchaseBusinessTypeCode) {
                                    case 1:
                                        // 非项目服务类合同
                                        contractTypeCode = 1;
                                        contractType = "serviceContractEntry";
                                        contractRouteType = "serviceContractView";
                                        break;
                                }
                                switch (obj.contractStateCode) {
                                    case 1:
                                        url = $scope.common.webUrlBase + obj.contractProcessDraftURL;
                                        break;
                                    case 3:
                                        url = $scope.common.webUrlBase + "/THRWebApp/ContractV2/default.htm#/" + contractRouteType + "?id=" + obj.contractResourceCode + '&contractTypeCode=' + contractTypeCode + '&systemVersionCode=2';
                                        break;
                                }
                                if (url.indexOf("?") === -1) {
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
                $scope.resetStartContract = function (item) {
                    wfWaiting.show();
                    var param = {
                        bussinessTypeCode: $scope.viewModel.purchaseBasePEMu.purchaseBusinessTypeCode,
                        purchaseWayCode: $scope.viewModel.purchaseBasePEMu.purchaseWayCode,
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
                        item.contractStateCode = 1;
                        item.contractStateName = "未生效";
                        $scope.baseInfo.isShowContractOption = true;
                        var promise = sogModal.openAlertDialog("提示", "重新发起合同成功");
                        promise.then(function (result) {
                            location.reload();
                        }, function (rejectData) {
                            location.reload();
                        });
                    });
                };

                //收集数据
                $scope.collectData = function (e, defer) {
                    sogValidator.clear();
                    switch (e.operationType) {
                        case sogWfControlOperationType.MoveTo:
                            defer.resolve($scope.viewModel);
                            break;
                        case sogWfControlOperationType.Save:
                            defer.resolve($scope.viewModel);
                            break;
                        case sogWfControlOperationType.CancelProcess:
                            defer.resolve($scope.viewModel);
                            break;
                        default:
                            defer.resolve(null);
                            break;
                    }
                };
            }]);
    });


