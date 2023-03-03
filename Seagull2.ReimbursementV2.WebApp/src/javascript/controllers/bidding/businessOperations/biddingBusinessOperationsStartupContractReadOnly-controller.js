define(
    [
        'app',
        'commonUtilExtend',
        'contractAgreementExtend',
        'leftNavExtend',
    ],
    function (app) {
        app.controller('biddingBusinessOperationsStartupContractReadOnly_controller', 
            function ($scope, viewData, wfWaiting, sogModal, sogOguType, configure, $http, errorDialog, seagull2Url, $window) {
                $scope.common = {};
                configure.getConfig($scope.common, 'common');
                angular.extend($scope, viewData);
                //流程标题
                $scope.mainTitle = viewData.viewModel.purchaseBase.purchaseWayName;
                $scope.title = viewData.viewModel.formAction.actionTypeName;
                //设置导航栏按钮状态
                $scope.wfOperateOpts.allowCirculate = false;//传阅 
                $scope.wfOperateOpts.allowPrint = false;//打印
                $scope.wfOperateOpts.allowRejection = false;//退回 
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底 

                // 设置
                $scope.settings = {
                    //合约规划
                    contractAgreementOpts: {
                        model: 'readOnly',
                        isAdmin: $scope.viewModel.isAdmin,
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 2000,
                        resourceId: $scope.resourceId,
                        scene: "BiddingBusinessOperationsStartupContract",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfBusinessOperations.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfBusinessOperations.isGrantDiscountEnquiry,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                    },
                    //附件设置项
                    fileReady: true,
                    fileOpts: {
                        'auto': true,
                        'preview': false,
                        'fileNumLimit': 0
                    },
                    //单选人员
                    peopleSelect: {
                        selectMask: sogOguType.User,
                        multiple: false
                    },
                };

                //获取合同状态
                $scope.getContractState = function () {
                    wfWaiting.show();
                    if (angular.isArray($scope.viewModel.perSignContractInfoList) === false) { return; }
                    var contractResourceCodelist = [];
                    for (var i = 0; i < $scope.viewModel.perSignContractInfoList.length; i++) {
                        if ($scope.viewModel.perSignContractInfoList[i].contractResourceCode) {
                            contractResourceCodelist.push($scope.viewModel.perSignContractInfoList[i].contractResourceCode);
                        }
                    }
                    if (angular.isArray(contractResourceCodelist) && contractResourceCodelist.length > 0) {
                        var param = {
                            resourceID: $scope.resourceId,
                            purchaseWayCode: $scope.viewModel.purchaseBase.purchaseWayCode,
                            contractResourceCodelist: contractResourceCodelist,
                        }
                        $http.post(seagull2Url.getPlatformUrl('/PurchaseContract/GetContractState'), param)
                            .success(function (data) {
                                if (data.data && data.data.length > 0) {
                                    for (var i = 0; i < data.data.length; i++) {
                                        for (var y = 0; y < $scope.viewModel.perSignContractInfoList.length; y++) {
                                            var item = $scope.viewModel.perSignContractInfoList[y];
                                            if (item.contractResourceCode === data.data[i].contractResourceCode) {
                                                item.contractStateCode = data.data[i].contractStateCode;
                                                item.contractStateName = data.data[i].contractStateName;
                                            }
                                        }
                                    }
                                }
                                wfWaiting.hide();
                            })
                            .error(function (data, status) {
                                errorDialog.openErrorDialog(data, status, "获取合同状态异常");
                                wfWaiting.hide();
                            });
                    }
                    else {
                        $scope.isSuccess = true;
                        wfWaiting.hide();
                    }
                };
                $scope.getContractState();

                // 基本信息 
                $scope.baseInfo = {
                    //关联合约
                    relatinCotractAgreement: function (contract) {
                        var viewPath = 'htmlTemplate/dialogTemplate/common/perSignBusinessAgreement.html';
                        var template = '<div ng-include="\'' + viewPath + '\'"></div>',
                            promise = sogModal.openDialog(template, '查看所属合约', ["$scope", function ($modelScope) {
                                $modelScope.agreementData = [];
                                $modelScope.readOnly = true;
                                if (angular.isArray(contract.perSignContractAgreementScopeInfoList) && contract.perSignContractAgreementScopeInfoList.length > 0) {
                                    angular.forEach(contract.perSignContractAgreementScopeInfoList, function (perSignAgreement) {
                                        angular.forEach($scope.viewModel.contractAgreementScopeList, function (agreementScope) {
                                            if (perSignAgreement.contractAgreementCode === agreementScope.contractAgreementCode) {
                                                var lookContractAgreement = {
                                                    projectName: agreementScope.projectName,
                                                    stageAreaName: agreementScope.stageAreaName,
                                                    contractAgreementName: agreementScope.contractAgreementName,
                                                    costTargetAmount: agreementScope.contractAgreementScope,
                                                };
                                                $modelScope.agreementData.push(lookContractAgreement);
                                            }
                                        });
                                    });
                                }

                            }], $scope, { containerStyle: { width: '50%', marginRight: "auto", marginLeft: "auto" } },
                                function (v, defer) {//50%
                                    defer.resolve(v);//确定                
                                }, function (v, defer) {
                                    defer.resolve(v);//取消
                                });
                    },
                    resetStartContract : function (contract) {
                        wfWaiting.show();
                        var param = {
                            bussinessTypeCode: $scope.viewModel.purchaseBase.purchaseBusinessTypeCode,
                            purchaseWayCode: $scope.viewModel.purchaseBase.purchaseWayCode,
                            resourceId: contract.resourceID,
                            code: contract.code,
                            operatorUserCode: contract.operatorUser.id,
                            operatorUserName: contract.operatorUser.displayName
                        }
                        $http({
                            method: 'POST',
                            url: seagull2Url.getPlatformUrl('/PurchaseContract/ReStartContract'),
                            data: param
                        }).error(function (data, status) {
                            errorDialog.openErrorDialog(data, status, "重新发起合同异常");
                            wfWaiting.hide();
                        }).success(function (data) {
                            wfWaiting.hide();
                            contract.contractStateCode = 1;
                            contract.contractStateName = "未生效"
                            $scope.isSuccess = true;
                            var promise = sogModal.openAlertDialog("提示", "重新发起合同成功");
                            promise.then(function (result) {
                                location.reload();
                            }, function (rejectData) {
                                location.reload();
                            });
                        });
                    },
                    lookContarctInfo : function (contract) {
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
                                        case 10:
                                            // 非开发运营类合同
                                            contractTypeCode = 13;
                                            contractType = "commercialOperationContractEntry";
                                            contractRouteType = "commercialOperationContractView";
                                            break;
                                    }
                                    switch (contract.contractStateCode) {
                                        case 1:
                                            if (contract.contractProcessDraftURL) {
                                                url = $scope.common.webUrlBase + contract.contractProcessDraftURL;
                                            }
                                            else {
                                                url = $scope.common.webUrlBase + "/THRWebApp/ContractV2/default.htm#/" + contractType + "/?resourceID=" + contract.contractResourceCode;
                                            }
                                            break;
                                        case 3:
                                            url = $scope.common.webUrlBase + "/THRWebApp/ContractV2/default.htm#/" + contractRouteType + "?id=" + contract.contractResourceCode + '&contractTypeCode=' + contractTypeCode + '&systemVersionCode=2';
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
                    }
                }

                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    defer.resolve($scope.viewModel);
                };
            }
        );
    });