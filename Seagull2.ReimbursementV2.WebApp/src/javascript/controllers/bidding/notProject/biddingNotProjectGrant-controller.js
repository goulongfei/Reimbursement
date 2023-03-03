define([
    'app',
    'commonUtilExtend',
    'dateTimePickerExtend', 'leftNavExtend'], function (app) {
        app.controller('biddingNotProjectGrant_controller',
            function ($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location, viewData, sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper, rcTools, $filter) {
                angular.extend($scope, viewData);
                $scope.wfOperateOpts.transitionKey = $scope.viewModel.toEvaluateTransitionKey;
                //流程标题
                $scope.mainTitle = viewData.viewModel.purchaseBasePEMu.purchaseWayName;
                $scope.title = viewData.viewModel.formAction.actionTypeName;

                $scope.wfOperateOpts.allowRejection = false;//退回
                $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
                $scope.wfOperateOpts.allowPrint = false;//打印

                ////判断供应商是否回复
                //var blackList = [];
                //if ($scope.viewModel.grantDiscountEnquiryInfoPEMus.length > 0) {
                //    angular.forEach($scope.viewModel.grantDiscountEnquiryInfoPEMus,
                //        function (v, i) {
                //            if (v.businessGrantDiscountEnquiryFileList.length > 0) {
                //                if (v.replyStateCode == 2) {
                //                    blackList.push("true");
                //                } else {
                //                    blackList.push("false");
                //                }
                //            }
                //        });
                //}
                //$scope.nowDate = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:00.000');
                //$scope.discountDeadline = $filter('date')($scope.viewModel.purchaseOfNotProjectPEMu.discountDeadline, 'yyyy-MM-dd HH:mm:00.000');
                ////回标截止时间到或者供应商全部回复，页面左上方会出现发送按钮，您可以发送至评标环节
                //if ($scope.nowDate >= $scope.discountDeadline || blackList.indexOf('false') === -1) {
                //    $scope.wfOperateOpts.allowMoveTo = true;
                //} else {
                //    $scope.wfOperateOpts.allowMoveTo = false;
                //}
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
                        scene: 'GrantEnquiry',
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                    },
                    // 撤回评标汇总
                    returnToEvaluateSummary: function () {
                        if ($scope.viewModel.isCancelEvaluate) {
                            var responseData = $scope;
                            responseData.wfOperateOpts.transitionKey = $scope.viewModel.toEvaluateSummaryTransitionKey;
                            $rootScope.$broadcast('$processRefreshed', responseData);
                        }
                        else {
                            var responseData = $scope;
                            responseData.wfOperateOpts.transitionKey = $scope.viewModel.toEvaluateTransitionKey;
                            $rootScope.$broadcast('$processRefreshed', responseData);
                        }
                    },
                    fileReady: true,
                    //是否显示操作按钮
                    isShowOperation: false,
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
                                //是否需要回复
                                if (grantDiscount.businessGrantDiscountEnquiryFileList == null || grantDiscount.businessGrantDiscountEnquiryFileList.length == 0) {
                                    grantDiscount.isNeedReply = false;
                                } else {
                                    grantDiscount.isNeedReply = true;
                                }
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
                            amount = supplier.afterDiscountAmount;
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

                if (new Date($scope.viewModel.purchaseOfNotProjectPEMu.discountDeadline) < new Date()) {
                    $scope.baseInfo.isShowOperation = true;
                } else {
                    $scope.baseInfo.isShowOperation = false;
                }
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
                //放弃回复
                $scope.giveUpReply = function (grantDiscountEnquiryCode) {
                    var promise = sogModal.openConfirmDialog("提示", "点击后，供应商无法参与此次让利，是否确认该供应商放弃回复？");
                    promise.then(function (v) {
                        wfWaiting.show();

                        $http.get(seagull2Url.getPlatformUrl('/BiddingNotProject/GrantDiscountEnquiryGiveUpReply?grantDiscountEnquiryCode=' + grantDiscountEnquiryCode), {
                            cache: false
                        }).success(function (response) {
                            angular.forEach($scope.viewModel.grantDiscountEnquiryInfoPEMus, function (item) {
                                if (item.code == grantDiscountEnquiryCode) {
                                    item.replyStateCode = 3;
                                    item.replyStateName = "放弃回复";
                                }
                            });
                            wfWaiting.hide();
                        }).error(function (data, status) {
                            if (data) {
                                sogModal.openAlertDialog(status, data.message);
                            } else {
                                sogModal.openAlertDialog("提示", "放弃回复错误");
                            }
                            wfWaiting.hide();
                        });
                    }, function (v) {
                        $scope.msg = "点击了取消" + v;
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
                        default:
                            defer.resolve(null);
                            break;
                    }
                };
            });
    });


