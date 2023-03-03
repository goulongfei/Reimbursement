﻿define([
    'app',
    'leftNavExtend',
    'commonUtilExtend'], function (app) {
        app.controller('businessEvaluateTender_controller',
            function ($scope, sogModal, viewData, sogWfControlOperationType, sogValidator, ValidateHelper, rcTools) {
                angular.extend($scope, viewData);
                $scope.mainTitle = '采购管理';
                $scope.title = "招投标（集团战采）";
                $scope.wfOperateOpts.allowRejection = false;//退回
                $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
                $scope.wfOperateOpts.allowPrint = false;//打印
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                $scope.viewModel.isBusinessEvaluateTender = true;
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
                        scene: "BusinessEvaluteTender",
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
                    }
                };
                for (var i = 1; i < $scope.viewModel.p_StrategyPurchasePlanCase.clearBiddingTimes; i++) {
                    $scope.baseInfo.clearBiddingClarifyRunds.push({ "code": i, "name": "第" + rcTools.numberToChinese(i) + "轮澄清" });
                }
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
                //数据有效性的检验
                var RequiredValidator = ValidateHelper.getValidator("Required");
                var validData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        {
                            key: '', attributeName: '', validator: new RequiredValidator('')
                        }
                    ]);
                    if ($scope.viewModel.isBusinessEvaluateTender) {
                        angular.forEach($scope.viewModel.p_SupplierScopePEMus, function (item) {
                            if (item.ranking === 0 || item.ranking === null) {
                                modelStateDictionary.addModelError("商务评标信息", "供应商【" + item.supplierName + "】请选择名次");
                            }
                        });
                        if ($scope.viewModel.businessEvaluateTenderFileList.length == 0 || $scope.viewModel.businessEvaluateTenderFileList[0].clientFileInformationList == null || $scope.viewModel.businessEvaluateTenderFileList[0].clientFileInformationList.length == 0) {
                            modelStateDictionary.addModelError("附件", "商务评标文件不能为空");
                        } else {
                            var count = 0;
                            angular.forEach($scope.viewModel.businessEvaluateTenderFileList[0].clientFileInformationList, function (file) {
                                if (!file.isDeleted) {
                                    count++;
                                }
                            });
                            if (count == 0) {
                                modelStateDictionary.addModelError("附件", "商务评标文件不能为空");
                            }
                        }
                    } else {
                        angular.forEach($scope.viewModel.p_TechnologyEvaluateBiddingInfoPEMus, function (item) {
                            if (item.isQualified === "" || item.isQualified === null || item.isQualified === "null" || item.isQualified === undefined || item.isQualified === "undefined") {
                                modelStateDictionary.addModelError("技术评标信息", "供应商【" + item.supplierName + "】请选择是否合格");
                            }
                        });
                        if ($scope.viewModel.technologyEvaluateTenderFileList.length == 0 || $scope.viewModel.technologyEvaluateTenderFileList[0].clientFileInformationList == null || $scope.viewModel.technologyEvaluateTenderFileList[0].clientFileInformationList.length == 0) {
                            modelStateDictionary.addModelError("附件", "技术评标文件不能为空");
                        } else {
                            var count = 0;
                            angular.forEach($scope.viewModel.technologyEvaluateTenderFileList[0].clientFileInformationList, function (file) {
                                if (!file.isDeleted) {
                                    count++;
                                }
                            });
                            if (count == 0) {
                                modelStateDictionary.addModelError("附件", "技术评标文件不能为空");
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


