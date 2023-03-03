define([
    'app',
    'leftNavExtend',
    'commonUtilExtend'], function (app) {
        app.controller('evaluateTenderGatherReadOnly_controller',
            function ($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location, viewData, sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper, rcTools) {
                angular.extend($scope, viewData);
                $scope.mainTitle = '采购管理';
                $scope.title = "招投标（集中采购）";
                $scope.isOpinionsShow = false;
                angular.forEach($scope.opinions, function (v, i) {

                    //评价意见是否显示
                    if (v.commentIsDelete)
                        $scope.isOpinionsShow = true;
                });
                
                $scope.wfOperateOpts.allowRejection = false;//退回
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
                $scope.wfOperateOpts.allowPrint = false;//打印
                //基本信息
                $scope.baseInfo = {
                    //采购信息是否显示招标附件
                    isShowbiddingReportFile: true,
                    //采购信息是否编辑招标附件
                    isEditbiddingReportFile: false,
                    //是否显示采购主责人信息
                    isShowUser: true,
                    clearBiddingClarifyRunds: [],
                    grantDiscountEnquiryRounds: [],
                    //附件
                    fileopts: {
                        'auto': true,
                        'resourceId': $scope.viewModel.resourceID,
                        'preview': false,
                        'fileNumLimit': 10
                    },
                    fileReady: true,
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 1000,
                        resourceId: $scope.resourceId,
                        scene: "EvaluateSummary",
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
                    //得到澄清信息
                    getClearBiddingClarifyInfo: function (supplierCode, round) {
                        var item = {};
                        for (var i = 0; i < $scope.viewModel.p_ClearBiddingClarifyInfoPEMus.length; i++) {
                            if (supplierCode == $scope.viewModel.p_ClearBiddingClarifyInfoPEMus[i].supplierCode && round == $scope.viewModel.p_ClearBiddingClarifyInfoPEMus[i].round) {
                                item = $scope.viewModel.p_ClearBiddingClarifyInfoPEMus[i];
                                break;
                            }
                        }
                        return item;
                    },
                    //得到清标回标信息
                    getClearBiddingReplyBidding: function (supplierCode, round) {
                        var p_SupplierReplyBiddingInfo = {};
                        for (var i = 0; i < $scope.viewModel.p_SupplierClearBiddingReplyBiddingInfos.length; i++) {
                            if ($scope.viewModel.p_SupplierClearBiddingReplyBiddingInfos[i].supplierCode == supplierCode && $scope.viewModel.p_SupplierClearBiddingReplyBiddingInfos[i].round == round) {
                                p_SupplierReplyBiddingInfo = $scope.viewModel.p_SupplierClearBiddingReplyBiddingInfos[i];
                                break;
                            }
                        }
                        return p_SupplierReplyBiddingInfo;
                    },
                    //得到评标回标信息
                    getEvaluateBiddingReplyBidding: function (supplierCode, round) {
                        var p_SupplierReplyBiddingInfo = {};
                        for (var i = 0; i < $scope.viewModel.p_SupplierEvaluateBiddingReplyBiddingInfos.length; i++) {
                            if ($scope.viewModel.p_SupplierEvaluateBiddingReplyBiddingInfos[i].supplierCode == supplierCode && $scope.viewModel.p_SupplierEvaluateBiddingReplyBiddingInfos[i].round == round) {
                                p_SupplierReplyBiddingInfo = $scope.viewModel.p_SupplierEvaluateBiddingReplyBiddingInfos[i];
                                break;
                            }
                        }
                        return p_SupplierReplyBiddingInfo;
                    },
                    //得到让利询价信息
                    getGrantDiscountEnquiryInfo: function (supplierCode, round) {
                        var item = {};
                        for (var i = 0; i < $scope.viewModel.p_GrantDiscountEnquiryInfoPEMus.length; i++) {
                            if (supplierCode == $scope.viewModel.p_GrantDiscountEnquiryInfoPEMus[i].supplierCode && round == $scope.viewModel.p_GrantDiscountEnquiryInfoPEMus[i].round) {
                                item = $scope.viewModel.p_GrantDiscountEnquiryInfoPEMus[i];
                                break;
                            }
                        }
                        return item;
                    },
                    //得到商务评标信息
                    getBusinessEvaluateBiddingInfo: function (supplierCode) {
                        var businessEvaluateBiddingInfo = {};
                        for (var i = 0; i < $scope.viewModel.p_BusinessEvaluateBiddingInfoPEMus.length; i++) {
                            if ($scope.viewModel.p_BusinessEvaluateBiddingInfoPEMus[i].supplierCode == supplierCode
                                && $scope.viewModel.p_BusinessEvaluateBiddingInfoPEMus[i].round == $scope.viewModel.p_StrategyPurchasePlanCase.evaluateBiddingTimes) {
                                businessEvaluateBiddingInfo = $scope.viewModel.p_BusinessEvaluateBiddingInfoPEMus[i];
                                break;
                            }
                        }
                        return businessEvaluateBiddingInfo;
                    },
                    //得到技术评标信息
                    getTechnologyEvaluateBiddingInfo: function (supplierCode) {
                        var technologyEvaluateBiddingInfo = {};
                        for (var i = 0; i < $scope.viewModel.p_TechnologyEvaluateBiddingInfoPEMus.length; i++) {
                            if ($scope.viewModel.p_TechnologyEvaluateBiddingInfoPEMus[i].supplierCode == supplierCode) {
                                technologyEvaluateBiddingInfo = $scope.viewModel.p_TechnologyEvaluateBiddingInfoPEMus[i];
                                break;
                            }
                        }
                        return technologyEvaluateBiddingInfo;
                    }
                };
                for (var i = 1; i < $scope.viewModel.p_StrategyPurchasePlanCase.clearBiddingTimes; i++) {
                    $scope.baseInfo.clearBiddingClarifyRunds.push({ "code": i, "name": "第" + rcTools.numberToChinese(i) + "轮澄清" });
                }

                if ($scope.viewModel.isNoShowAllReplyBiddingInfo) {
                    if ($scope.viewModel.p_StrategyPurchasePlanCase.evaluateBiddingTimes > 1) {
                        $scope.baseInfo.grantDiscountEnquiryRounds.push({ "code": 1, "name": "首轮让利" });
                        var round = 2;
                        if ($scope.viewModel.p_StrategyPurchasePlanCase.evaluateBiddingTimes > 2) {
                            round = $scope.viewModel.p_StrategyPurchasePlanCase.evaluateBiddingTimes - 1;
                            $scope.baseInfo.grantDiscountEnquiryRounds.push({ "code": round, "name": "最终让利" });
                        }
                    }
                } else {
                    if ($scope.viewModel.p_StrategyPurchasePlanCase.evaluateBiddingTimes > 1) {
                        $scope.baseInfo.grantDiscountEnquiryRounds.push({ "code": 1, "name": "首轮让利" });
                        var round = 2;
                        if ($scope.viewModel.p_StrategyPurchasePlanCase.evaluateBiddingTimes > 2) {
                            round = $scope.viewModel.p_StrategyPurchasePlanCase.evaluateBiddingTimes - 1;
                        }
                        $scope.baseInfo.grantDiscountEnquiryRounds.push({ "code": round, "name": "最终让利" });
                    } else {
                        $scope.baseInfo.grantDiscountEnquiryRounds.push({ "code": 1, "name": "首轮让利" });
                    }
                }
                
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


