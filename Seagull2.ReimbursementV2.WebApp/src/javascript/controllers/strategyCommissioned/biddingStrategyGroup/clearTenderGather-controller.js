define([
    'app',
    'leftNavExtend',
    'dateTimePickerExtend', 'commonUtilExtend'
], function (app) {
    app.controller('clearTenderGather_controller',
        function ($scope, wfOperate, sogModal, viewData, sogWfControlOperationType, sogValidator, ValidateHelper) {
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
                    scene: "ClearSummary",
                    activityInfoList: $scope.viewModel.processActivityInfoList,
                },
                //得到澄清信息
                getClearBiddingClarifyInfo: function (supplierCode) {
                    var item = {};
                    for (var i = 0; i < $scope.viewModel.p_ClearBiddingClarifyInfoPEMus.length; i++) {
                        if (supplierCode == $scope.viewModel.p_ClearBiddingClarifyInfoPEMus[i].supplierCode &&
                            $scope.viewModel.p_StrategyPurchasePlanCase.clearBiddingTimes == $scope.viewModel.p_ClearBiddingClarifyInfoPEMus[i].round) {
                            item = $scope.viewModel.p_ClearBiddingClarifyInfoPEMus[i];
                            break;
                        }
                    }
                    return item;
                }
            };
            //刷新流程
            $scope.refreshProcess = function () {
                wfOperate.refreshProcess('/BiddingStrategyGroupClearTenderGatherWf', $scope.currentActivityId, null, {
                    isClarify: $scope.viewModel.p_StrategyPurchasePlanCase.isGrantClarifyQuestionnaire
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
                if ($scope.viewModel.p_StrategyPurchasePlanCase.isGrantClarifyQuestionnaire === null || $scope.viewModel.p_StrategyPurchasePlanCase.isGrantClarifyQuestionnaire === "null") {
                    modelStateDictionary.addModelError("发放澄清问卷", "请选择是否发放澄清问卷");
                } else {
                    if ($scope.viewModel.p_StrategyPurchasePlanCase.isGrantClarifyQuestionnaire === true || $scope.viewModel.p_StrategyPurchasePlanCase.isGrantClarifyQuestionnaire === 'true') {
                        if ($scope.viewModel.p_StrategyPurchasePlanCase.clarifyDeadline == null || $scope.viewModel.p_StrategyPurchasePlanCase.clarifyDeadline == "0001-01-01T00:00:00" || $scope.viewModel.p_StrategyPurchasePlanCase.clarifyDeadline == "") {
                            modelStateDictionary.addModelError("发放澄清问卷", "澄清截止时间不能为空");
                        } else {
                            if (new Date($scope.viewModel.p_StrategyPurchasePlanCase.clarifyDeadline) < new Date()) {
                                modelStateDictionary.addModelError("发放澄清问卷", "澄清截止时间不能小于当前时间");
                            }
                        }
                        var isValid = false;
                        angular.forEach($scope.viewModel.p_ClearBiddingClarifyInfoPEMus, function (item) {
                            if (item.round == $scope.viewModel.p_StrategyPurchasePlanCase.clearBiddingTimes && item.businessClarifyFileList != null && item.businessClarifyFileList.length > 0) {
                                var count = 0;
                                angular.forEach(item.businessClarifyFileList, function (file) {
                                    if (!file.isDeleted) {
                                        count++;
                                    }
                                });
                                if (count > 0) {
                                    isValid = true;
                                }
                            }
                            if (item.round == $scope.viewModel.p_StrategyPurchasePlanCase.clearBiddingTimes && item.technologyClarifyFileList != null && item.technologyClarifyFileList.length > 0) {
                                var count = 0;
                                angular.forEach(item.technologyClarifyFileList, function (file) {
                                    if (!file.isDeleted) {
                                        count++;
                                    }
                                });
                                if (count > 0) {
                                    isValid = true;
                                }
                            }
                        });
                        if (!isValid) {
                            modelStateDictionary.addModelError("发放澄清问卷", "商务澄清问卷和技术澄清问卷必须有一个");
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


