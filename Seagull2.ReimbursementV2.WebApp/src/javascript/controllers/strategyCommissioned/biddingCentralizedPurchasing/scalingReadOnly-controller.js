define(['app', 'commonUtilExtend', 'leftNavExtend', 'enterpriseShowExtend', 'biddingSynthesizeExtend'], function (app) {
    app.controller('scalingReadOnly_controller',
        function ($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location, viewData, sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper, configure, $window, rcTools) {
            angular.extend($scope, viewData);
            $scope.common = {};
            configure.getConfig($scope.common, 'common');
            $scope.mainTitle = '采购管理';
            $scope.title = "招投标（集中采购）";
            $scope.isOpinionsShow = true;
            $scope.isApprovalShow = false;
            angular.forEach($scope.opinions, function (v, i) {
                //审批意见是否显示
                if (v.nextStepSnapshot.length > 0 && !v.commentIsDelete)
                    $scope.isApprovalShow = true;
            });
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
            $scope.wfOperateOpts.allowPrint = false;//打印
            $scope.wfOperateOpts.allowDoAbort = false;//作废
            //基本信息
            $scope.baseInfo = {
                //采购信息是否显示招标附件
                isShowbiddingReportFile: true,
                //采购信息是否编辑招标附件
                isEditbiddingReportFile: false,
                isShowUser: true,
                //左侧导航栏
                leftNavListOpts: {
                    offset: 59.5,
                    fixed: 0,
                    delay: 1000,
                    resourceId: $scope.resourceId,
                    scene: "ConfirmTender",
                    activityInfoList: $scope.viewModel.processActivityInfoList,
                },
                //查找回标信息
                getReplyBidding: function (supplierCode) {
                    var p_SupplierReplyBiddingInfo = {};
                    for (var i = 0; i < $scope.viewModel.p_SupplierReplyBiddingInfoPEMus.length; i++) {
                        if ($scope.viewModel.p_SupplierReplyBiddingInfoPEMus[i].supplierCode == supplierCode && $scope.viewModel.p_SupplierReplyBiddingInfoPEMus[i].className == 2) {
                            p_SupplierReplyBiddingInfo = $scope.viewModel.p_SupplierReplyBiddingInfoPEMus[i];
                            break;
                        }
                    }
                    return p_SupplierReplyBiddingInfo;
                },
                //得到清标回标信息
                getClearBiddingReplyBidding: function (supplierCode) {
                    var p_SupplierReplyBiddingInfo = {};
                    for (var i = 0; i < $scope.viewModel.p_SupplierClearBiddingReplyBiddingInfos.length; i++) {
                        if ($scope.viewModel.p_SupplierClearBiddingReplyBiddingInfos[i].supplierCode == supplierCode) {
                            if ($scope.viewModel.p_SupplierClearBiddingReplyBiddingInfos[i].round == $scope.viewModel.p_StrategyPurchasePlanCase.clearBiddingTimes
                                && $scope.viewModel.p_SupplierClearBiddingReplyBiddingInfos[i].isReplyBidding) {
                                p_SupplierReplyBiddingInfo = $scope.viewModel.p_SupplierClearBiddingReplyBiddingInfos[i];
                                break;
                            } else if ($scope.viewModel.p_SupplierClearBiddingReplyBiddingInfos[i].round == ($scope.viewModel.p_StrategyPurchasePlanCase.clearBiddingTimes - 1)) {
                                p_SupplierReplyBiddingInfo = $scope.viewModel.p_SupplierClearBiddingReplyBiddingInfos[i];
                                break;
                            }
                        }
                    }
                    return p_SupplierReplyBiddingInfo;
                },
                //得到商务评标信息
                getBusinessEvaluateBiddingInfo: function (supplierCode, round) {
                    var businessEvaluateBiddingInfo = {};
                    for (var i = 0; i < $scope.viewModel.p_BusinessEvaluateBiddingInfoPEMus.length; i++) {
                        if ($scope.viewModel.p_BusinessEvaluateBiddingInfoPEMus[i].supplierCode == supplierCode
                            && $scope.viewModel.p_BusinessEvaluateBiddingInfoPEMus[i].round == round) {
                            businessEvaluateBiddingInfo = $scope.viewModel.p_BusinessEvaluateBiddingInfoPEMus[i];
                            break;
                        }
                    }
                    return businessEvaluateBiddingInfo;
                }
            };
            //查看页面
            $scope.lookInfo = function (routesType, title) {
                var urlat = null;
                $http.get(seagull2Url.getPlatformUrl("/PublicApi/TicketStr?r=" + new Date().getTime()))
                    .success(function (data) {
                        urlat = data;
                        if (urlat !== null) {
                            urlat = urlat.replace(/"/g, "");
                            var url = "";
                            var activityID = "";
                            switch (routesType) {
                                case "evaluateTenderGather":
                                    for (var i = 0; i < $scope.viewModel.processActivityInfoList.length; i++) {
                                        if ($scope.viewModel.processActivityInfoList[i].activityStateName == "evaluateTenderGather") {
                                            activityID = $scope.viewModel.processActivityInfoList[i].activityCode;
                                            break;
                                        }
                                    }
                                    break;
                                case "compilingTenderApproval":
                                    for (var i = 0; i < $scope.viewModel.processActivityInfoList.length; i++) {
                                        if ($scope.viewModel.processActivityInfoList[i].activityStateName == "compilingTender") {
                                            activityID = $scope.viewModel.processActivityInfoList[i].activityCode;
                                            break;
                                        }
                                    }
                                    break;
                            }
                            url = $scope.common.webUrlBase + "/THRWebApp/ReimbursementV2/default.htm#/" + routesType + "/?resourceID=" + $scope.viewModel.resourceID + "&activityID=" + activityID;

                            if (url.indexOf("?") == -1) {
                                url = url + "?_at=" + urlat;
                            } else {
                                url = url + "&_at=" + urlat;
                            }
                            $window.open(url, '_blank');
                        }

                    })
                    .error(function (data, status) {
                        errorDialog.openErrorDialog(data, status, title + "异常");
                        wfWaiting.hide();
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
                    case sogWfControlOperationType.Withdraw:
                        defer.resolve($scope.viewModel);
                        break;
                    default:
                        defer.resolve(null);
                        break;
                }
            };
        });
});


