define([
    'app',
    'commonUtilExtend',
    'dateTimePickerExtend', 'leftNavExtend'], function (app) {
        app.controller('biddingNotProjectEvaluateTenderGather_controller',
            function ($injector, $scope, $rootScope, $http, $state, wfOperate, seagull2Url, wfWaiting, sogModal, $location, viewData, sogWfControlOperationType, sogOguType, sogValidator, ValidateHelper, rcTools) {
                angular.extend($scope, viewData);
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
                //是否发放让利询价
                $scope.chargeGrant = function () {
                    wfOperate.refreshProcess('/BiddingNotProjectEvaluateTenderGatherWf', $scope.currentActivityId, null, {
                        isConcession: $scope.viewModel.purchaseOfNotProjectPEMu.isGrantDiscountEnquiry
                    }).success(function (d) {
                    }).error(function (data, status) { });
                };

                //数据有效性的检验
                var RequiredValidator = ValidateHelper.getValidator("Required");
                var validData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        {
                            key: '', attributeName: '', validator: new RequiredValidator('')
                        }
                    ]);
                    if ($scope.viewModel.purchaseOfNotProjectPEMu.isGrantDiscountEnquiry === null || $scope.viewModel.purchaseOfNotProjectPEMu.isGrantDiscountEnquiry === "null") {
                        modelStateDictionary.addModelError("发放让利询价", "请选择是否发放让利询价");
                    } else {
                        if ($scope.viewModel.purchaseOfNotProjectPEMu.isGrantDiscountEnquiry === true || $scope.viewModel.purchaseOfNotProjectPEMu.isGrantDiscountEnquiry === 'true') {
                            if ($scope.viewModel.purchaseOfNotProjectPEMu.discountDeadline == null || $scope.viewModel.purchaseOfNotProjectPEMu.discountDeadline == "0001-01-01T00:00:00" || $scope.viewModel.purchaseOfNotProjectPEMu.discountDeadline == "") {
                                modelStateDictionary.addModelError("发放让利询价", "回复截止时间不能为空");
                            } else {
                                if (new Date($scope.viewModel.purchaseOfNotProjectPEMu.discountDeadline) < new Date()) {
                                    modelStateDictionary.addModelError("发放让利询价", "回复截止时间不能小于当前时间");
                                }
                            }
                            var count = 0;
                            angular.forEach($scope.viewModel.supplierScopeList, function (item) {
                                var files = $scope.baseInfo.getGrantDiscountEnquiry(item.supplierCode).businessGrantDiscountEnquiryFileList;
                                if (files != null && files.length > 0) {
                                    angular.forEach(files, function (file) {
                                        if (!file.isDeleted) {
                                            count++;
                                        }
                                    });
                                }
                            });
                            if (count == 0) {
                                modelStateDictionary.addModelError("发放让利询价", "最少有一个供应商上传让利询价文件");
                            }
                        }
                    }
                    return modelStateDictionary;
                };
                var checkFileData = function () {
                    if (!$scope.baseInfo.fileReady) {
                        sogModal.openAlertDialog('提示', '附件未上传完毕');
                        return false;
                    }
                    return true;
                };
                //收集数据
                $scope.collectData = function (e, defer) {
                    sogValidator.clear();
                    if (checkFileData()) {
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
                    }
                };
            });
    });


