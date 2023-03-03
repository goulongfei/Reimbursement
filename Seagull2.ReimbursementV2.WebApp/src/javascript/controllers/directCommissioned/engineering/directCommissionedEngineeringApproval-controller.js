define(
    [
        'app',
        'corporationRadioSelector',
        'supplierCategory',
        'commonUtilExtend', 
        'directCommissionedSynthesizeExtend',
        'engineeringExtend',
        'supplierCategoryExtend',
        'negativeListExtend',
        'contractAgreementExtend',
        'isEmphasisExtend',
        'echartsUitl',
    ],
    function (app) {
        app.controller('directCommissionedEngineeringApproval_controller',[
            '$scope', 'viewData', '$rootScope', '$http','seagull2Url',
            'wfWaiting', 'sogModal', 'ValidateHelper', 'sogValidator',
            'sogWfControlOperationType',
            function ($scope, viewData, $rootScope, $http, seagull2Url,
                wfWaiting, sogModal, ValidateHelper, sogValidator,
                sogWfControlOperationType) {
                angular.extend($scope, viewData);
                //流程标题
                $scope.mainTitle = '直接委托';
                $scope.title = '直接委托（工程采购类）';
                //设置导航栏按钮状态 
                $scope.wfOperateOpts.allowPrint = false;//打印 
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底 
                $scope.wfOperateOpts.allowAdminMoveTo = false;//超级发送

                $scope.isApproval = true;
                //默认显示重要信息
                $scope.viewModel.isEmphasis = true;
                //判断显示，表示初审
                $scope.viewModel.auditState = "InitialAudit";
                //初审图表数据初始化
                $scope.chartOpt = ['成本目标金额', '上报金额', '初审金额'];
                $scope.chartData = [$scope.viewModel.purchaseOfEngineering.purchaseCostTargetAmount, $scope.viewModel.purchaseBase.purchaseAmount, $scope.viewModel.purchaseOfEngineering.firstTrialAgreedPartAmount + $scope.viewModel.purchaseOfEngineering.firstTrialDisputePartAmount];

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
                        'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                        'scene': 'application',
                        'isNeedContract': $scope.viewModel.isNeedContract,
                    },
                    //合约规划
                    contractAgreementOpts: {
                        model: 'readOnly',
                        isAdmin: $scope.viewModel.isAdmin,
                    },
                    //页面的展开按钮控制
                    isSpreadInfo: false,
                    spreadButtonName: "展开",
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
                        this.setOpinionOpts($scope.opinionOpts.options);
                        if (angular.isArray($scope.viewModel.purchaseDelegationInfoList)
                            && $scope.viewModel.purchaseDelegationInfoList.length > 0) {
                            $scope.viewModel.purchaseDelegationInfoList[0].priceFile = $scope.viewModel.priceFile;
                        }

                        $scope.baseInfo.setIsReject($scope); 
                    },
                    setOpinionOpts: function (data) {
                        // 设置审批栏权限
                        angular.forEach(data, function (item) {
                            item.allowToBeAppended = false;
                            item.allowToBeDeleted = false;
                            item.allowToBeModified = false;
                        });
                    },
                    setIsReject: function (data) {
                        try {
                            $scope.viewModel.isReject = false;
                            for (var i = 0; i < data.opinionOpts.options.length; i++) {
                                var item = data.opinionOpts.options[i];
                                if (item.nextStepCollection.length > 1
                                    && data.wfOperateOpts.transitionKey === item.nextStepCollection[1].transitionKey) {
                                    $scope.viewModel.isReject = true;
                                }
                            }
                        } catch (e) {
                        }
                    },
                    spreadInfoFn: function () {
                        if ($scope.settings.isSpreadInfo) {
                            $scope.settings.isSpreadInfo = false;
                            $scope.settings.spreadButtonName = "展开";
                        } else {
                            $scope.settings.isSpreadInfo = true;
                            $scope.settings.spreadButtonName = "收起";
                        }
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
                    var RangeValidator = ValidateHelper.getValidator('Range');
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new stringMaxLengthValidator(30, "采购名称不能大于30个字符!") }
                    ]);
                    // 附件
                    //var authorizedUploaded = false;
                    //if ($scope.viewModel.authorizedFile && angular.isArray($scope.viewModel.authorizedFile.contractFileList)) {
                    //    for (var i = 0; i < $scope.viewModel.authorizedFile.contractFileList.length; i++) {
                    //        var item = $scope.viewModel.authorizedFile.contractFileList[i];
                    //        if (item.uploaded === true && item.isDeleted !=== true) {
                    //            authorizedUploaded = true;
                    //        }
                    //    }
                    //}
                    //if (authorizedUploaded === false) {
                    //    modelStateDictionary.addModelError('', '请上传！');
                    //} 

                    return modelStateDictionary;
                };
                // 保存验证
                var saveValidData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new stringMaxLengthValidator(30, "采购名称不能大于30个字符!") }
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
                $rootScope.$on("$processRefreshed", function (event, data) {                
                    $scope.baseInfo.setIsReject(data);
                });
                $scope.baseInfo.init();
            }
        ]);
    });