define(
    [
        'app',
        'commonUtilExtend',
        'directCommissionedSynthesizeExtend',
        'negativeListExtend',
        'contractAgreementExtend',
        "autoCompleteExtend",
        'supplierInfoExtendV4'
    ],
    function (app) {
        app.controller('directCommissionedImplementAuditImplementation_controller', [
            '$scope', 'viewData', '$rootScope', '$http', 'seagull2Url',
            'wfWaiting', 'sogModal', 'ValidateHelper', 'sogValidator',
            'sogWfControlOperationType', 'rcTools', 'wfOperate',
            function ($scope, viewData, $rootScope, $http, seagull2Url,
                wfWaiting, sogModal, ValidateHelper, sogValidator,
                sogWfControlOperationType, rcTools, wfOperate) {
                angular.extend($scope, viewData);
                //流程标题
                $scope.mainTitle = '直接委托';
                $scope.title = '直接委托（项目实施服务类）';
                $scope.isApproval = true;
                //是否是传阅页面
                $scope.isCirculatePage = false;
                //设置导航栏按钮状态
                $scope.wfOperateOpts.allowPrint = false;//打印 
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底
                $scope.wfOperateOpts.allowAdminMoveTo = false;//超级发送
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
                // 审计报告 附件设置项
                $scope.auditReportFileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                // 复审定案表 附件设置项
                $scope.auditFinalFormFileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                $scope.reTrialUnitData = {
                    delegationAmount: 1,
                    supplierCode: $scope.viewModel.purchaseOfImplement.outReTrialUnitCode,
                    supplierName: $scope.viewModel.purchaseOfImplement.outReTrialUnitName,
                    industryDomainCode: '',
                    industryDomainName: ''
                }
                //页面加载先执行刷新
                if ($scope.viewModel.purchaseOfImplement.outReTrialTaskStateCode == 1) {
                    $scope.wfOperateOpts.allowMoveTo = false;//发送
                    $scope.wfOperateOpts.allowSave = false;//保存
                    $scope.reTrialTaskRuning = true;
                }

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
                    //人员名字自动提示
                    reTrialPrincipalOpts: {
                        dataList: $scope.viewModel.recheckUserOption,
                        inintStr: $scope.viewModel.purchaseOfImplement.outReTrialPrincipalName,
                        afterSelected: function (item) {
                            if (item != null) {
                                $scope.viewModel.purchaseOfImplement.outReTrialPrincipalName = item.name;
                                $scope.viewModel.linkPhoneOption = item.linkPhoneList;
                                $scope.settings.principalPhoneOpts.dataList = item.linkPhoneList;
                                $scope.viewModel.purchaseOfImplement.outReTrialPrincipalPhone = "";
                            }
                        }
                    },
                    //手机号自动提示
                    principalPhoneOpts: {
                        dataList: $scope.viewModel.linkPhoneOption,
                        inintStr: $scope.viewModel.purchaseOfImplement.outReTrialPrincipalPhone,
                        afterSelected: function (item) {
                            if (item != null) {
                                $scope.viewModel.purchaseOfImplement.outReTrialPrincipalPhone = item.name;
                            }
                        }
                    },
                    // 选择供应商
                    reTrialUnitOpts: {
                        blackList: [], /*供应商组件需要校验的字段黑名单，仅限供应商使用*/
                        actionTypeCode: 4,
                        tinyAmount: 50000, //小微供应商限定金额
                        isRetrial: true,
                        beforAppend: function (supplier, index) {
                            $scope.viewModel.purchaseOfImplement.outReTrialUnitCode = '';
                            $scope.viewModel.purchaseOfImplement.outReTrialUnitName = '';
                            if (supplier != null) {
                                $scope.viewModel.purchaseOfImplement.outReTrialUnitCode = supplier.supplierCode;
                                $scope.viewModel.purchaseOfImplement.outReTrialUnitName = supplier.supplierName;
                                $scope.api.getRecheckUserOption();
                            }
                        },
                        isDirectCommissioned: true,
                    }
                };

                $scope.api = {
                    showErrorMessage: function (error) {
                        wfWaiting.hide();
                        if (error) {
                            sogModal.openErrorDialog(error).then(function () {
                            });
                        }
                    },
                    stratUpOutRetrialTask: function () {
                        if (!$scope.viewModel.purchaseOfImplement.outReTrialUnitCode) {
                            sogModal.openAlertDialog("提示", "复审单位不能为空！");
                            return;
                        }
                        if (!$scope.viewModel.purchaseOfImplement.outReTrialPrincipalName) {
                            sogModal.openAlertDialog("提示", "复审负责人不能为空！");
                            return;
                        }
                        if (!$scope.viewModel.purchaseOfImplement.outReTrialPrincipalPhone) {
                            sogModal.openAlertDialog("提示", "负责人手机号不能为空");
                            return;
                        } else {
                            var regPhoneNumber = /^(((\+\d{2}-)?0\d{2,3}-\d{7,8})|((\+\d{2}-)?(\d{2,3}-)?(1[3-9]\d{9})))$/;
                            var validPhoneNumber = regPhoneNumber.test($scope.viewModel.purchaseOfImplement.outReTrialPrincipalPhone);
                            if (validPhoneNumber === false) {
                                sogModal.openAlertDialog("提示", "负责人手机号格式不正确");
                                return;
                            }
                        }
                        if (!$scope.viewModel.purchaseOfImplement.outReTrialLastCompletionTime) {
                            sogModal.openAlertDialog('提示', '最迟完成时间不能为空');
                            return;
                        }

                        wfWaiting.show();
                        var stratUpOutRetrialTaskUrl = seagull2Url.getPlatformUrl('/BudgetRecheck/StratUpOutImplementRetrialTask');
                        $http.post(stratUpOutRetrialTaskUrl, getCleanModel())
                            .success(function (data) {
                                wfWaiting.hide();
                                var promise = sogModal.openAlertDialog("提示", "发起预算外审待办成功!")
                                promise.then(function () {
                                    location.reload();
                                }, function () {
                                    location.reload();
                                });
                            }).error(function (err) {
                                wfWaiting.hide();
                                sogModal.openAlertDialog("提示", err.message || "查询出现异常，请稍后重试！");
                            });
                    },
                    abortOutRetrialTask: function () {
                        wfWaiting.show();
                        var stratUpOutRetrialTaskUrl = seagull2Url.getPlatformUrl('/BudgetRecheck/AbortOutImplementRetrialTask');
                        $http.post(stratUpOutRetrialTaskUrl, getCleanModel())
                            .success(function (data) {
                                wfWaiting.hide();
                                var promise = sogModal.openAlertDialog("提示", "作废预算外审待办成功!")
                                promise.then(function () {
                                    location.reload();
                                }, function () {
                                    location.reload();
                                });
                            }).error(function (err) {
                                wfWaiting.hide();
                                sogModal.openAlertDialog("提示", err.message || "查询出现异常，请稍后重试！");
                            });
                    },
                    //获取最新的复审负责人信息
                    getRecheckUserOption: function () {
                        if (!$scope.viewModel.purchaseOfImplement.outReTrialUnitCode) {
                            return;
                        }
                        wfWaiting.show();
                        var getRecheckUserOptionUrl = seagull2Url.getPlatformUrl('/BudgetRecheck/GetRecheckUserList') + "?supplierCode=" + $scope.viewModel.purchaseOfImplement.outReTrialUnitCode;
                        $http.get(getRecheckUserOptionUrl)
                            .success(function (data) {
                                wfWaiting.hide();
                                $scope.settings.reTrialPrincipalOpts.dataList = data;
                                $scope.viewModel.recheckUserOption = data;
                                $scope.settings.principalPhoneOpts.dataList = [];
                                $scope.viewModel.linkPhoneOption = [];
                                $scope.viewModel.purchaseOfImplement.outReTrialPrincipalName = "";
                                $scope.viewModel.purchaseOfImplement.outReTrialPrincipalPhone = "";
                            }).error(function (err) {
                                wfWaiting.hide();
                                sogModal.openAlertDialog("提示", err.message || "查询出现异常，请稍后重试！");
                            });
                    },
                }

                // 基本信息 
                $scope.baseInfo = {
                    init: function () {
                        this.setOpinionOpts($scope.opinionOpts.options);
                    },
                    setOpinionOpts: function (data) {
                        // 设置审批栏权限
                        angular.forEach(data, function (item) {
                            item.allowToBeAppended = false;
                            item.allowToBeDeleted = false;
                            item.allowToBeModified = false;
                        });
                    },
                    reTrialAmountChange: function (type) {
                        // 初审一致金额
                        var firstTrialAgreedPartAmount = rcTools.toFixedNum($scope.viewModel.purchaseOfImplement.firstTrialAgreedPartAmount, 2);
                        // 初审争议金额
                        var firstTrialDisputePartAmount = rcTools.toFixedNum($scope.viewModel.purchaseOfImplement.firstTrialDisputePartAmount, 2);
                        // 审计一致金额
                        var reTrialAgreedPartAmount = rcTools.toFixedNum($scope.viewModel.purchaseOfImplement.reTrialAgreedPartAmount, 2);
                        // 审计争议金额
                        var reTrialDisputePartAmount = rcTools.toFixedNum($scope.viewModel.purchaseOfImplement.reTrialDisputePartAmount, 2);
                        // 审计审增金额
                        var reTrialAuditIncreaseAmount = rcTools.toFixedNum($scope.viewModel.purchaseOfImplement.reTrialAuditIncreaseAmount, 2);
                        // 审定金额
                        var total = rcTools.toFixedNum(reTrialAgreedPartAmount + reTrialDisputePartAmount + reTrialAuditIncreaseAmount, 2);
                        var costTarget = rcTools.toFixedNum($scope.viewModel.purchaseOfImplement.purchaseCostTargetAmount, 2);
                        // 计算成本目标偏差金额
                        var deviation = total - costTarget;

                        // 一致部分复审核减金额
                        $scope.viewModel.purchaseOfImplement.reTrialAgreedPartAmountMinus = rcTools.toFixedNum(firstTrialAgreedPartAmount - reTrialAgreedPartAmount, 2);
                        // 争议部分复审核减金额
                        $scope.viewModel.purchaseOfImplement.reTrialDisputePartAmountMinus = rcTools.toFixedNum(firstTrialDisputePartAmount - reTrialDisputePartAmount, 2);
                        // 复审核减率
                        $scope.viewModel.purchaseOfImplement.reTrialJudgementAmountMinusRate
                            = rcTools.toFixedNum(($scope.viewModel.purchaseOfImplement.reTrialAgreedPartAmountMinus / firstTrialAgreedPartAmount) * 100, 2);
                        // 复审审定金额
                        $scope.viewModel.purchaseOfImplement.reTrialJudgementAmount = rcTools.toFixedNum(total, 2);
                        // 成本目标偏差金额
                        $scope.viewModel.purchaseOfImplement.reTrialCostTargetDeviationAmount = rcTools.toFixedNum(deviation, 2);
                        // 成本目标偏差比例
                        $scope.viewModel.purchaseOfImplement.reTrialCostTargetDeviationRate
                            = costTarget === 0 ? 0 : rcTools.toFixedNum((deviation / costTarget) * 100, 2);

                        if (type === 1)
                            $scope.refreshProcess();
                    },
                    // 设置是否外审
                    setReTrialIsExternalAuditor: function (value) {
                        $scope.viewModel.purchaseOfImplement.reTrialIsExternalAuditor = value;
                        $scope.refreshProcess();
                    },
                };

                //外审状态是已回复，需要刷新数据计算金额
                if ($scope.viewModel.purchaseOfImplement.outReTrialTaskStateCode == 2) {
                    $scope.baseInfo.reTrialAmountChange(2);
                }
                //传阅初审负责人
                if ($scope.wfOperateOpts.sendButtonName === "已阅") {
                    $scope.wfOperateOpts.allowSave = false;
                    $scope.isCirculatePage = true;
                    if ($scope.viewModel.purchaseOfImplement.outReTrialTaskStateCode != 2) {
                        $scope.baseInfo.reTrialAmountChange(2);
                    }
                }

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
                        { key: '复审一致部分(元)', attributeName: 'purchaseOfImplement.reTrialAgreedPartAmount', validator: new RequiredValidator('不能为空！') },
                        { key: '复审单位', attributeName: 'purchaseOfImplement.reTrialUnitName', validator: new stringMaxLengthValidator(100, '不能大于100个字符!') },
                        { key: '复审报告编号', attributeName: 'purchaseOfImplement.reTrialReportNo', validator: new stringMaxLengthValidator(50, '不能大于50个字符!') }
                    ]);
                    if ($scope.viewModel.purchaseOfImplement.reTrialIsExternalAuditor === true) {
                        if (!$scope.viewModel.purchaseOfImplement.reTrialUnitName) {
                            modelStateDictionary.addModelError('复审单位', '不能为空！');
                        }
                        if (!$scope.viewModel.purchaseOfImplement.reTrialReportNo) {
                            modelStateDictionary.addModelError('复审报告编号', '不能为空！');
                        }
                        // 审计报告
                        var auditReportFileUploaded = false;
                        if ($scope.viewModel.auditReportFile && angular.isArray($scope.viewModel.auditReportFile)) {
                            for (var i = 0; i < $scope.viewModel.auditReportFile.length; i++) {
                                var item = $scope.viewModel.auditReportFile[i];
                                if (item.uploaded === true && item.isDeleted !== true) {
                                    auditReportFileUploaded = true;
                                }
                            }
                        }
                        if (auditReportFileUploaded === false) {
                            modelStateDictionary.addModelError('审计报告', '请上传！');
                        }
                        // 复审定案表
                        var auditFinalFormFileUploaded = false;
                        if ($scope.viewModel.auditFinalFormFile && angular.isArray($scope.viewModel.auditFinalFormFile)) {
                            for (var i = 0; i < $scope.viewModel.auditFinalFormFile.length; i++) {
                                var item = $scope.viewModel.auditFinalFormFile[i];
                                if (item.uploaded === true && item.isDeleted !== true) {
                                    auditFinalFormFileUploaded = true;
                                }
                            }
                        }
                        if (auditFinalFormFileUploaded === false) {
                            modelStateDictionary.addModelError('复审定案表', '请上传！');
                        }
                    }
                    if ($scope.viewModel.purchaseOfImplement.outReTrialTaskStateCode === 1) {
                        modelStateDictionary.addModelError('复审外审', '已发起预算复审外审待办，请等待外网回复或者将待办撤回再进行发送！');
                    }
                    // 审批流
                    if (angular.isArray($scope.opinionOpts.options) === false
                        || $scope.opinionOpts.options.length <= 1) {
                        modelStateDictionary.addModelError('审批流程', '审批人不能为空！');
                    }
                    return modelStateDictionary;
                };
                // 保存验证
                var saveValidData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '复审单位', attributeName: 'purchaseOfImplement.reTrialUnitName', validator: new stringMaxLengthValidator(100, "不能大于100个字符!") },
                        { key: '复审报告编号', attributeName: 'purchaseOfImplement.reTrialReportNo', validator: new stringMaxLengthValidator(50, "不能大于50个字符!") }
                    ]);

                    return modelStateDictionary;
                };
                // 复制viewModel
                function getCleanModel() {
                    var model = {};
                    $scope.viewModel.purchaseOfImplement.outReTrialUnitCode = $scope.reTrialUnitData.supplierCode;
                    $scope.viewModel.purchaseOfImplement.outReTrialUnitName = $scope.reTrialUnitData.supplierName;
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
                        if (!result.isValid()) {
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
                        judgementAmount: $scope.viewModel.purchaseOfImplement.reTrialJudgementAmount,
                        projectCode: $scope.viewModel.purchaseOfImplement.projectCode,
                        stageAreaCode: $scope.viewModel.purchaseOfImplement.stageAreaCode,
                        costCenterCode: $scope.viewModel.purchaseOfImplement.costCenterCode,
                        reTrialIsExternalAuditor: $scope.viewModel.purchaseOfImplement.reTrialIsExternalAuditor,
                    };
                    if ($scope.viewModel.purchaseOfImplement.reTrialAgreedPartAmount) {
                        wfOperate.refreshProcess('/DirectCommissionedImplementAuditImplementationWf', $scope.currentActivityId, null, param, true);
                    }
                };

                $rootScope.$on("$processRefreshed", function (event, data) {
                    $scope.baseInfo.setOpinionOpts(data.opinionOpts.options);
                    angular.extend($scope.opinionOpts, data.opinionOpts);
                });
                $scope.baseInfo.init();
            }
        ]);
    });