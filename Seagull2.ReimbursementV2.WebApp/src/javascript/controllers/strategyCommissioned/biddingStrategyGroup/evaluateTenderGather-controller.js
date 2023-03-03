define([
    'app',
    'commonUtilExtend',
    'leftNavExtend',
    'dateTimePickerExtend'], function (app) {
        app.controller('evaluateTenderGather_controller',
            function ($scope, wfOperate, sogModal, viewData, sogWfControlOperationType, sogValidator, ValidateHelper, rcTools) {
                angular.extend($scope, viewData);
                $scope.mainTitle = '采购管理';
                $scope.title = "招投标（集团战采）";
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

                //刷新流程
                $scope.refreshProcess = function () {
                    wfOperate.refreshProcess('/EvaluateTenderGatherWf', $scope.currentActivityId, null, {
                        isConcession: $scope.viewModel.p_StrategyPurchasePlanCase.isGrantDiscountEnquiry
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
                    if ($scope.viewModel.p_StrategyPurchasePlanCase.isGrantDiscountEnquiry === null || $scope.viewModel.p_StrategyPurchasePlanCase.isGrantDiscountEnquiry === "null") {
                        modelStateDictionary.addModelError("发放让利询价或面谈通知", "请选择是否发放让利询价");
                    } else {
                        if ($scope.viewModel.p_StrategyPurchasePlanCase.isGrantDiscountEnquiry === true || $scope.viewModel.p_StrategyPurchasePlanCase.isGrantDiscountEnquiry === 'true') {
                            if ($scope.viewModel.p_StrategyPurchasePlanCase.discountDeadline == null || $scope.viewModel.p_StrategyPurchasePlanCase.discountDeadline == "0001-01-01T00:00:00" || $scope.viewModel.p_StrategyPurchasePlanCase.discountDeadline == "") {
                                modelStateDictionary.addModelError("发放让利询价或面谈通知", "回复截止时间不能为空");
                            } else {
                                if (new Date($scope.viewModel.p_StrategyPurchasePlanCase.discountDeadline) < new Date()) {
                                    modelStateDictionary.addModelError("发放让利询价或面谈通知", "回复截止时间不能小于当前时间");
                                }
                            }
                            var count = 0;
                            angular.forEach($scope.viewModel.p_SupplierScopePEMus, function (item) {
                                var files = $scope.baseInfo.getGrantDiscountEnquiryInfo(item.supplierCode, $scope.viewModel.p_StrategyPurchasePlanCase.evaluateBiddingTimes).businessGrantDiscountEnquiryFileList;
                                if (files != null && files.length > 0) {
                                    angular.forEach(files, function (file) {
                                        if (!file.isDeleted) {
                                            count++;
                                        }
                                    });
                                }
                            });
                            if (count == 0) {
                                modelStateDictionary.addModelError("发放让利询价或面谈通知", "最少有一个供应商上传让利询价文件");
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


