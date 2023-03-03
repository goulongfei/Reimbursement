define([
    'app',
    'commonUtilExtend',
    'leftNavExtend',
    'dateTimePickerExtend'], function (app) {
        app.controller('concession_controller',
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
                $scope.wfOperateOpts.transitionKey = $scope.viewModel.toEvaluateTransitionKey;


                $scope.wfOperateOpts.allowRejection = false;//退回
                $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
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
                    //是否显示操作按钮
                    isShowOperation: false,
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
                        scene: "GrantEnquiry",
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
                                //是否需要回复
                                if (item.businessGrantDiscountEnquiryFileList == null || item.businessGrantDiscountEnquiryFileList.length == 0) {
                                    item.isNeedReply = false;
                                } else {
                                    item.isNeedReply = true;
                                }
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
                if (new Date($scope.viewModel.p_StrategyPurchasePlanCase.discountDeadline) < new Date()) {
                    $scope.baseInfo.isShowOperation = true;
                } else {
                    $scope.baseInfo.isShowOperation = false;
                }
                for (var i = 1; i < $scope.viewModel.p_StrategyPurchasePlanCase.clearBiddingTimes; i++) {
                    $scope.baseInfo.clearBiddingClarifyRunds.push({ "code": i, "name": "第" + rcTools.numberToChinese(i) + "轮澄清" });
                }
                if ($scope.viewModel.isNoShowAllReplyBiddingInfo) {
                    if ($scope.viewModel.p_StrategyPurchasePlanCase.evaluateBiddingTimes > 1) {
                        $scope.baseInfo.grantDiscountEnquiryRounds.push({ "code": 1, "name": "首轮让利" });
                        var round = 2;
                        if ($scope.viewModel.p_StrategyPurchasePlanCase.evaluateBiddingTimes > 2) {
                            round = $scope.viewModel.p_StrategyPurchasePlanCase.evaluateBiddingTimes - 1;
                        }
                        if ($scope.viewModel.p_StrategyPurchasePlanCase.evaluateBiddingTimes > 3) {
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
                //放弃回复
                $scope.giveUpReply = function (grantDiscountEnquiryCode) {
                    var promise = sogModal.openConfirmDialog("提示", "点击后，供应商无法参与此次让利，是否确认该供应商放弃回复？");
                    promise.then(function (v) {
                        wfWaiting.show();

                        $http.get(seagull2Url.getPlatformUrl('/BiddingCentralizedPurchasing/GrantDiscountEnquiryGiveUpReply?grantDiscountEnquiryCode=' + grantDiscountEnquiryCode), {
                            cache: false
                        }).success(function (response) {
                            angular.forEach($scope.viewModel.p_GrantDiscountEnquiryInfoPEMus, function (item) {
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

                //数据有效性的检验
                var RequiredValidator = ValidateHelper.getValidator("Required");
                var validData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        {
                            key: '', attributeName: '', validator: new RequiredValidator('')
                        }
                    ]);
                    angular.forEach($scope.viewModel.p_SupplierScopePEMus, function (item) {
                        var supplier = $scope.baseInfo.getGrantDiscountEnquiryInfo(item.supplierCode, $scope.viewModel.p_StrategyPurchasePlanCase.evaluateBiddingTimes);
                        if ($scope.viewModel.isCancelEvaluate == false) {
                            if (supplier.isNeedReply && supplier.replyStateCode == 1) {
                                modelStateDictionary.addModelError("发放让利询价", "供应商【" + item.supplierName + "】状态为未回复不能发送");
                            }
                        } else {
                            if (supplier.isNeedReply && supplier.replyStateCode == 2) {
                                modelStateDictionary.addModelError("发放让利询价", "供应商【" + item.supplierName + "】状态为已回复不能退回");
                            }
                        }

                    });
                    return modelStateDictionary;
                };

                //收集数据
                $scope.collectData = function (e, defer) {
                    sogValidator.clear();
                    switch (e.operationType) {
                        case sogWfControlOperationType.MoveTo:
                            var result = validData();
                            if (!result.isValid()) {
                                sogModal.openDialogForModelStateDictionary('信息校验失败', result);
                                sogValidator.broadcastResult(result.get());
                                defer.reject($scope.viewModel);
                            } else {
                                defer.resolve($scope.viewModel);
                            }
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


