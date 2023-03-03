define([
    'app',
    'commonUtilExtend',
    'leftNavExtend',
    'dateTimePickerExtend'], function (app) {
        app.controller('concession_controller',
            function ($injector, $scope, $rootScope, $http, seagull2Url, wfWaiting, sogModal, $location, viewData, sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper, rcTools) {
                angular.extend($scope, viewData);
                $scope.mainTitle = '采购管理';
                $scope.title = "招投标（集团战采）";
                $scope.wfOperateOpts.transitionKey = $scope.viewModel.toEvaluateTransitionKey;
                $scope.wfOperateOpts.allowRejection = false;//退回
                $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
                $scope.wfOperateOpts.allowPrint = false;//打印
                $scope.wfOperateOpts.allowDoAbort = false;//作废
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
                
                //放弃回复
                $scope.giveUpReply = function (grantDiscountEnquiryCode) {
                    var promise = sogModal.openConfirmDialog("提示", "点击后，供应商无法参与此次让利，是否确认该供应商放弃回复？");
                    promise.then(function (v) {
                        wfWaiting.show();

                        $http.get(seagull2Url.getPlatformUrl('/BiddingStrategyGroup/GrantDiscountEnquiryGiveUpReply?grantDiscountEnquiryCode=' + grantDiscountEnquiryCode), { cache: false })
                            .success(function (response) {
                                angular.forEach($scope.viewModel.p_GrantDiscountEnquiryInfoPEMus, function (item) {
                                    if (item.code == grantDiscountEnquiryCode) {
                                        item.replyStateCode = 3;
                                        item.replyStateName = "放弃回复";
                                    }
                                });
                                wfWaiting.hide();
                            }).error(function (data, status) {
                                wfWaiting.hide();
                                if (data) {
                                    sogModal.openAlertDialog(status, data.message);
                                } else {
                                    sogModal.openAlertDialog("提示", "放弃回复错误");
                                }
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


