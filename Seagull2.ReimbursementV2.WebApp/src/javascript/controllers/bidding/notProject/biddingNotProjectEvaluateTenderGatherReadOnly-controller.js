define([
    'app',
    'commonUtilExtend', 'leftNavExtend'], function (app) {
        app.controller('biddingNotProjectEvaluateTenderGatherReadOnly_controller',
            function ($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location, viewData, sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper, rcTools) {
                angular.extend($scope, viewData);
                //流程标题
                $scope.mainTitle = viewData.viewModel.purchaseBasePEMu.purchaseWayName;
                $scope.title = viewData.viewModel.formAction.actionTypeName;
                
                $scope.wfOperateOpts.allowRejection = false;//退回
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
                $scope.wfOperateOpts.allowPrint = false;//打印

                var replyCount = 0;
                angular.forEach($scope.viewModel.grantDiscountEnquiryInfoPEMus, function (v) {
                    if (v.replyStateCode == "2") {
                        replyCount = replyCount + 1;
                    }
                });

                if (replyCount == 0) {
                    $scope.wfOperateOpts.allowDoWithdraw = true;//撤回
                }
                else {
                    $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
                }

                //基本信息
                $scope.baseInfo = {
                    //是否显示合计中标金额
                    isAllSupplierFinalQuoteAmount: false,
                    //附件
                    fileopts: {
                        'auto': true,
                        'resourceId': $scope.viewModel.resourceID,
                        'preview': false,
                        'fileNumLimit': 10
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 1000,
                        resourceId: $scope.resourceId,
                        scene: 'EvaluateSummary',
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                    },
                    fileReady: true,
                    //查找回标信息
                    getReplyBidding: function (supplierCode) {
                        var p_SupplierReplyBiddingInfo = {};
                        for (var i = 0; i < $scope.viewModel.supplierReplyBiddingInfoSaves.length; i++) {
                            if ($scope.viewModel.supplierReplyBiddingInfoSaves[i].supplierCode == supplierCode && $scope.viewModel.supplierReplyBiddingInfoSaves[i].className == 1) {
                                p_SupplierReplyBiddingInfo = $scope.viewModel.supplierReplyBiddingInfoSaves[i];
                                break;
                            }
                        }
                        return p_SupplierReplyBiddingInfo;
                    },
                    //查找让利询价信息
                    getGrantDiscountEnquiry: function (supplierCode) {
                        var grantDiscount = {};
                        for (var i = 0; i < $scope.viewModel.grantDiscountEnquiryInfoPEMus.length; i++) {
                            if ($scope.viewModel.grantDiscountEnquiryInfoPEMus[i].supplierCode == supplierCode
                                && $scope.viewModel.grantDiscountEnquiryInfoPEMus[i].round == $scope.viewModel.purchaseOfNotProjectPEMu.evaluateBiddingTimes) {
                                grantDiscount = $scope.viewModel.grantDiscountEnquiryInfoPEMus[i];
                                break;
                            }
                        }
                        return grantDiscount;
                    },
                    //查找商务评标信息
                    getBusinessEvaluateBiddingInfo: function (supplier) {
                        var amount = 0;
                        for (var i = 0; i < $scope.viewModel.supplierEvaluateBiddingReplyBiddingInfoSubmits.length; i++) {
                            if ($scope.viewModel.supplierEvaluateBiddingReplyBiddingInfoSubmits[i].supplierCode == supplier.supplierCode
                                && $scope.viewModel.supplierEvaluateBiddingReplyBiddingInfoSubmits[i].round == $scope.viewModel.purchaseOfNotProjectPEMu.evaluateBiddingTimes - 1) {
                                amount = $scope.viewModel.supplierEvaluateBiddingReplyBiddingInfoSubmits[i].afterDiscountAmount;
                                break;
                            }
                        }
                        if (amount == 0) {
                            amount = supplier.totalAmountWithTax;
                        }
                        return amount;
                    },
                    //查找技术标
                    getSupplierReplyBiddingInfo: function (supplierCode) {
                        var supplierReplyBiddingInfo = {};
                        for (var i = 0; i < $scope.viewModel.supplierReplyBiddingInfoSaves.length; i++) {
                            if ($scope.viewModel.supplierReplyBiddingInfoSaves[i].supplierCode == supplierCode) {
                                supplierReplyBiddingInfo = $scope.viewModel.supplierReplyBiddingInfoSaves[i];
                                break;
                            }
                        }
                        return supplierReplyBiddingInfo;
                    }
                };
                //初始化每个供应商历史让利文件
                angular.forEach($scope.viewModel.supplierScopeList, function (supplier) {
                    supplier.historyGrantDiscountEnquiryFileList = [];
                    supplier.historyGrantDiscountEnquiryReplyFileList = [];
                    angular.forEach($scope.viewModel.grantDiscountEnquiryInfoPEMus, function (grantDiscount) {
                        if (grantDiscount.supplierCode == supplier.supplierCode && grantDiscount.round < $scope.viewModel.purchaseOfNotProjectPEMu.evaluateBiddingTimes) {
                            if (grantDiscount.businessGrantDiscountEnquiryFileList != null && grantDiscount.businessGrantDiscountEnquiryFileList.length > 0) {
                                angular.forEach(grantDiscount.businessGrantDiscountEnquiryFileList, function (file) {
                                    supplier.historyGrantDiscountEnquiryFileList.push(file);
                                });
                            }
                            if (grantDiscount.businessGrantDiscountEnquiryReplyFileList != null && grantDiscount.businessGrantDiscountEnquiryReplyFileList.length > 0) {
                                angular.forEach(grantDiscount.businessGrantDiscountEnquiryReplyFileList, function (file) {
                                    supplier.historyGrantDiscountEnquiryReplyFileList.push(file);
                                });
                            }
                        }
                    });
                });
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
            });
    });


