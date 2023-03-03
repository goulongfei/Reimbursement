﻿define(
    [
        'app',
        'commonUtilExtend',
        'bidSectionInfoExtend',
        'leftNavExtend',
        'dateTimePickerExtend',
    ],
    function (app) {
        app.controller('biddingEngineeringEvaluateSummary_controller', [
            '$scope', 'viewData',
            'wfWaiting', 'sogModal', 'ValidateHelper', 'sogValidator', 'rcTools',
            'sogWfControlOperationType', '$rootScope', 'wfOperate',
            function ($scope, viewData,
                wfWaiting, sogModal, ValidateHelper, sogValidator, rcTools,
                sogWfControlOperationType, $rootScope, wfOperate) {

                angular.extend($scope, viewData);

                //流程标题
                $scope.mainTitle = viewData.viewModel.purchaseBase.purchaseWayName;
                $scope.title = viewData.viewModel.formAction.actionTypeName;
                //设置导航栏按钮状态
                $scope.wfOperateOpts.allowCirculate = false; //传阅 
                $scope.wfOperateOpts.allowPrint = false; //打印
                $scope.wfOperateOpts.allowDoWithdraw = false; //撤回 
                $scope.wfOperateOpts.allowRejection = false;//退回 
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底 

                // 附件设置项
                $scope.fileOpts = {
                    'auto': true,
                    'preview': false,
                    'fileNumLimit': 0
                };
                // 设置 
                $scope.settings = {
                    // 标段信息
                    bidSectionInfoOpts: {
                        'scene': 'EvaluateSummary',
                        biddingOrEnquiry: $scope.viewModel.biddingOrEnquiry,
                        isUsedTenderFile: $scope.viewModel.purchaseBase.isUsedTenderFile
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 2000,
                        resourceId: $scope.resourceId,
                        scene: "BiddingEngineeringEvaluateSummary",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfEngineering.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfEngineering.isGrantDiscountEnquiry,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                    },
                };

                $scope.api = {
                    showErrorMessage: function (error, status) {
                        wfWaiting.hide();
                        if (status === 400) {
                            sogModal.openAlertDialog("提示", error.message).then(function () { });
                        }
                        else {
                            if (error) { sogModal.openErrorDialog(error).then(function () { }); }
                        }
                    },
                }

                // 基本信息 
                $scope.baseInfo = {
                    init: function () {
                        rcTools.setOpinionOpts($scope.opinionOpts.options);
                        rcTools.setProcessNavigator($scope.processNavigator);
                        $scope.wfOperateOpts.transitionKey = $scope.viewModel.toAwardTransitionKey;
                        $rootScope.$broadcast('$processRefreshed', $scope);
                        $scope.refreshProcess();
                    },
                    // 设置是否发放让利询价
                    setIsGrantDiscountEnquiry: function (val) {
                        $scope.viewModel.purchaseOfEngineering.isGrantDiscountEnquiry = val;
                        if (val === true) {
                            $scope.wfOperateOpts.transitionKey = $scope.viewModel.toProfitSharingTransitionKey;
                        }
                        else {
                            $scope.wfOperateOpts.transitionKey = $scope.viewModel.toAwardTransitionKey;
                        }
                        $rootScope.$broadcast('$processRefreshed', $scope);
                        $scope.refreshProcess();
                    },
                    // 废标
                    cancelBidding: function () {
                        $scope.viewModel.purchaseOfEngineering.isGrantDiscountEnquiry = false;
                        $scope.wfOperateOpts.transitionKey = $scope.viewModel.toNullifiedTransitionKey;
                        $rootScope.$broadcast('$processRefreshed', $scope);
                        $scope.refreshProcess();
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
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new RequiredValidator('不能为空！') }
                    ]);

                    if (!$scope.viewModel.isInvalidTender && !$scope.viewModel.purchaseOfEngineering.isAbandonBidding) {
                        if ($scope.viewModel.purchaseOfEngineering.isGrantDiscountEnquiry == null) {
                            modelStateDictionary.addModelError('是否发放让利询价', '不能为空！');
                        }
                        // 需发放标段 
                        if ($scope.viewModel.purchaseOfEngineering.isGrantDiscountEnquiry) {
                            if (!$scope.viewModel.purchaseOfEngineering.discountDeadline) {
                                modelStateDictionary.addModelError('让利回复截止时间', '不能为空！');
                            }
                            if (angular.isArray($scope.viewModel.biddingSectionInfoList)) {
                                var isIssueDiscountEnquirySection = false;
                                for (var i = 0; i < $scope.viewModel.biddingSectionInfoList.length; i++) {
                                    if ($scope.viewModel.biddingSectionInfoList[i].isIssueDiscountEnquirySection) {
                                        isIssueDiscountEnquirySection = true;
                                    }
                                }
                                if (isIssueDiscountEnquirySection == false) {
                                    modelStateDictionary.addModelError('需发放标段', '请选择！');
                                }
                            }
                        }
                    }
                    return modelStateDictionary;
                };
                // 保存验证
                var saveValidData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '采购名称', attributeName: 'purchaseBase.purchaseName', validator: new stringMaxLengthValidator(30, "不能大于30个字符!") },
                        { key: '废标原因', attributeName: 'purchaseBase.abandonBiddingReason', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") }
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
                    } else if (e.operationType === sogWfControlOperationType.Comment) {
                        var promise = sogModal.openConfirmDialog("提示", "请确定已经点击保存按钮，否则页面填写的数据会刷新!")
                        promise.then(function () {
                            defer.resolve(getCleanModel());
                        }, function () {
                            defer.reject($scope.viewModel);
                        });
                    } else if (e.operationType === sogWfControlOperationType.Save) {
                        result = saveValidData();
                        if (!result.isValid()) {
                            sogModal.openDialogForModelStateDictionary('信息校验失败', result);
                            sogValidator.broadcastResult(result.get());
                            defer.reject($scope.viewModel);
                        } else {
                            defer.resolve(getCleanModel());
                        }
                    } else {
                        defer.resolve(getCleanModel());
                    }
                };

                // 刷新流程
                $scope.refreshProcess = function () {
                    var param = {};
                    if ($scope.viewModel.purchaseOfEngineering.isAbandonBidding !== true) {
                        param.IsAbandonBidding = false;
                        param.IsGrantDiscountEnquiry = $scope.viewModel.purchaseOfEngineering.isGrantDiscountEnquiry;
                    }
                    else {
                        param.IsAbandonBidding = $scope.viewModel.purchaseOfEngineering.isAbandonBidding;
                        param.IsGrantDiscountEnquiry = false;
                    }
                    if (param) {
                        wfOperate.refreshProcess('/BiddingEngineeringEvaluateSummaryWf', $scope.currentActivityId, null, param, true);
                    }
                };

                $rootScope.$on("$processRefreshed", function (event, data) {
                    rcTools.setOpinionOpts(data.opinionOpts.options);
                    rcTools.setProcessNavigator(data.processNavigator);
                });

                $scope.baseInfo.init();
            }
        ]);
    });