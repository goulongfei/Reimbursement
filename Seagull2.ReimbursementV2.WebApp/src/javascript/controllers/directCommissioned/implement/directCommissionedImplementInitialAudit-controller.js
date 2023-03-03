define(
    [
        'app',
        'commonUtilExtend',
        'directCommissionedSynthesizeExtend',
        'negativeListExtend',
        'contractAgreementExtend',
    ],
    function (app) {
        app.controller('directCommissionedImplementInitialAudit_controller', [
            '$scope', 'viewData', '$rootScope', 'wfOperate', '$http', 'seagull2Url',
            'wfWaiting', 'sogModal', 'ValidateHelper', 'sogValidator',
            'sogWfControlOperationType', 'rcTools',
            function ($scope, viewData, $rootScope, wfOperate, $http, seagull2Url,
                wfWaiting, sogModal, ValidateHelper, sogValidator,
                sogWfControlOperationType, rcTools) {
                angular.extend($scope, viewData);
                //流程标题
                $scope.mainTitle = '直接委托';
                $scope.title = '直接委托（项目实施服务类）';
                $scope.isApproval = true;
                $scope.isEditBaseInfo = true;
                //设置导航栏按钮状态
                $scope.wfOperateOpts.allowCirculate = false;//传阅 
                $scope.wfOperateOpts.allowPrint = false;//打印
                $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底
                $scope.wfOperateOpts.allowRejection = false;//退回
                // 设置审批栏权限
                angular.forEach($scope.opinionOpts.options, function (item) {
                    item.allowToBeAppended = false;
                    item.allowToBeDeleted = false;
                    item.allowToBeModified = false;
                });
                // 直接委托报告 附件设置项
                $scope.reportFileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                // 直接委托说明 附件设置项
                $scope.manualFileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                // 其他附件 附件设置项
                $scope.otherFileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                // 预算初审报告 附件设置项
                $scope.budgetReportFileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                // 预算定案表 附件设置项
                $scope.budgetFinalFormFileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                // 设置
                $scope.settings = {
                    // 委托信息
                    delegationOpts: {
                        'actionTypeCode': 5,
                        'scene': 'application',
                        'isNeedContract': true,
                    },
                    //合约规划
                    contractAgreementOpts: {
                        model: 'readOnly',
                    },
                };

                $scope.api = {
                    showErrorMessage: function (error) {
                        wfWaiting.hide();
                        if (error) {
                            sogModal.openErrorDialog(error).then(function () {
                            });
                        }
                    },
                }
        
                // 基本信息 
                $scope.baseInfo = {
                    init: function () {
                        $scope.baseInfo.setIsReject($scope);               
                        this.setOpinionOpts($scope.opinionOpts.options);
                        angular.forEach($scope.opinions, function (item, index) {
                            if (item.processId !== "InputOpinion") {
                                $scope.baseInfo.notAllOfInputOpinion = true;
                            }
                        });
                    },
                    setOpinionOpts: function (data) {
                        // 设置审批栏权限
                        angular.forEach(data, function (item) {
                            item.allowToBeAppended = false;
                            item.allowToBeDeleted = false;
                            item.allowToBeModified = false;
                        });
                    },
                    firstTrialAmountChange: function () {
                        var total = rcTools.toFixedNum($scope.viewModel.purchaseOfImplement.firstTrialAgreedPartAmount, 2) +
                            rcTools.toFixedNum($scope.viewModel.purchaseOfImplement.firstTrialDisputePartAmount, 2);
                        var costTarget = rcTools.toFixedNum($scope.viewModel.purchaseOfImplement.purchaseCostTargetAmount, 2);
                        var deviation = total - costTarget;
                        $scope.viewModel.purchaseOfImplement.firstTrialCostTargetDeviationAmount = rcTools.toFixedNum(deviation, 2);
                        $scope.viewModel.purchaseOfImplement.firstTrialCostTargetDeviationRate
                            = costTarget === 0 ? 0 : rcTools.toFixedNum((deviation / costTarget) * 100, 2);

                        $scope.viewModel.purchaseOfImplement.firstTrialAmount = total;
                        $scope.refreshProcess();
                    },
                    isReject: false,
                    setIsReject: function (data) {
                        try {
                            $scope.baseInfo.isReject = false;
                            if (data.wfOperateOpts.transitionKey === data.opinionOpts.options[0].nextStepCollection[1].transitionKey) {
                                $scope.baseInfo.isReject = true;
                            }
                        } catch (e) {
                        }
                    },
                    // 设置是否营销展示区
                    setIsMarketingExhibition: function (value) {
                        $scope.viewModel.purchaseOfImplement.isMarketingExhibition = value;
                    },
                };

                // 自定义校验器-判断字符长度
                var stringMaxLengthValidator = (function () {
                    return function (maxlength, message) {
                        this.validateData = function (value, name, validationContext) {
                            if (value && value.length > maxlength) {
                                ValidateHelper.updateValidationContext(validationContext, name, message);
                                return false;
                            }
                            return true;
                        };
                    };
                }());
                //验证
                var validData = function () {
                    var RequiredValidator = ValidateHelper.getValidator('Required');
                    // var RangeValidator = ValidateHelper.getValidator('Range');
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '初审一致部分(元)', attributeName: 'purchaseOfImplement.firstTrialAgreedPartAmount', validator: new RequiredValidator('不能为空！') },
                        { key: '成本目标偏差说明', attributeName: 'purchaseOfImplement.firstTrialCostTargetDeviationExplain', validator: new RequiredValidator('不能为空！') },
                        { key: '成本目标偏差说明', attributeName: 'purchaseOfImplement.firstTrialCostTargetDeviationExplain', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                        { key: '初审单位', attributeName: 'purchaseOfImplement.firstTrialUnitName', validator: new RequiredValidator('不能为空！') },
                        { key: '初审单位', attributeName: 'purchaseOfImplement.firstTrialUnitName', validator: new stringMaxLengthValidator(100, "不能大于100个字符!") },
                        { key: '初审附件盖章', attributeName: 'purchaseOfImplement.firstTrialIsNeedSeal', validator: new RequiredValidator('请选择！') }
                    ]);
                    // 预算初审报告
                    var budgetReportFileUploaded = false;
                    if ($scope.viewModel.budgetReportFile && angular.isArray($scope.viewModel.budgetReportFile)) {
                        for (var i = 0; i < $scope.viewModel.budgetReportFile.length; i++) {
                            var item = $scope.viewModel.budgetReportFile[i];
                            if (item.uploaded === true && item.isDeleted !== true) {
                                budgetReportFileUploaded = true;
                            }
                        }
                    }
                    if (budgetReportFileUploaded === false) {
                        modelStateDictionary.addModelError('预算初审报告', '请上传！');
                    }
                    // 预算定案表
                    var budgetFinalFormFileUploaded = false;
                    if ($scope.viewModel.budgetFinalFormFile && angular.isArray($scope.viewModel.budgetFinalFormFile)) {
                        for (var i = 0; i < $scope.viewModel.budgetFinalFormFile.length; i++) {
                            var item = $scope.viewModel.budgetFinalFormFile[i];
                            if (item.uploaded === true && item.isDeleted !== true) {
                                budgetFinalFormFileUploaded = true;
                            }
                        }
                    }
                    if (budgetFinalFormFileUploaded === false) {
                        modelStateDictionary.addModelError('预算定案表', '请上传！');
                    }
                    return modelStateDictionary;
                };
                // 保存验证
                var saveValidData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '本目标偏差说明', attributeName: 'purchaseOfImplement.firstTrialCostTargetDeviationExplain', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") },
                        { key: '初审单位', attributeName: 'purchaseOfImplement.firstTrialUnitName', validator: new stringMaxLengthValidator(100, "不能大于100个字符!") }
                    ]);

                    return modelStateDictionary;
                };
                // 复制viewModel
                function getCleanModel() {
                    var model = {};
                    angular.extend(model, $scope.viewModel);
                    model.option = null;
                    return model;
                }
                //提交数据
                $scope.collectData = function (e, defer) {
                    sogValidator.clear();
                    var result;
                    if (e.operationType === sogWfControlOperationType.MoveTo) {
                        result = validData();
                        if (!result.isValid() && $scope.baseInfo.isReject === false) {
                            sogModal.openDialogForModelStateDictionary('信息校验失败', result);
                            sogValidator.broadcastResult(result.get());
                            defer.reject($scope.viewModel);
                        } else {
                            defer.resolve(getCleanModel());
                        }
                    }
                    else if (e.operationType === sogWfControlOperationType.Comment) {
                        var promise = sogModal.openConfirmDialog("提示", "请确定已经点击保存按钮，否则页面填写的数据会刷新!")
                        promise.then(function () {
                            defer.resolve(getCleanModel());
                        }, function () {
                            defer.reject($scope.viewModel);
                        });
                    }
                    else if (e.operationType === sogWfControlOperationType.Save) {
                        result = saveValidData();
                        if (!result.isValid()) {
                            sogModal.openDialogForModelStateDictionary('信息校验失败', result);
                            sogValidator.broadcastResult(result.get());
                            defer.reject($scope.viewModel);
                        } else {
                            defer.resolve(getCleanModel());
                        }
                    }
                    else {
                        defer.resolve(getCleanModel());
                    }
                };
                // 刷新流程
                $scope.refreshProcess = function () {
                    var param = {
                        FirstTrialAmount: $scope.viewModel.purchaseOfImplement.firstTrialAmount,
                        ContractPriceTypeCode: $scope.viewModel.purchaseOfImplement.contractPriceTypeCode,
                        ProjectCode: $scope.viewModel.purchaseOfImplement.projectCode,
                    };
                    if (param.FirstTrialAmount) {
                        wfOperate.refreshProcess('/DirectCommissionedImplementInitialAuditWf', $scope.currentActivityId, null, param, true);
                    }
                };

                $rootScope.$on("$processRefreshed", function (event, data) {
                    $scope.baseInfo.setOpinionOpts(data.opinionOpts.options);
                    $scope.viewModel.isNeedAudit = data.viewModel.IsNeedAudit;
                    $scope.baseInfo.setIsReject(data);    
                });
                $scope.baseInfo.init();
            }
        ]);
    });