define(
    [
        'app',
        'commonUtilExtend',
        'leftNavExtend',
        'dateTimePickerExtend',
    ],
    function (app) {
        app.controller('biddingBusinessOperationsEvaluateSummary_controller', 
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
                $scope.wfOperateOpts.allowRejection = false;//退回 
                $scope.wfOperateOpts.allowDoWithdraw = false; //撤回 
                $scope.wfOperateOpts.allowDoAbort = false;//作废
                $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底 

                // 设置 
                $scope.settings = {
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 2000,
                        resourceId: $scope.resourceId,
                        scene: "BiddingBusinessOperationsEvaluateSummary",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfBusinessOperations.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfBusinessOperations.isGrantDiscountEnquiry,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                    },
                    //附件设置项
                    fileReady: true,
                    fileOpts: {
                        'auto': true,
                        'preview': false,
                        'fileNumLimit': 0
                    }
                };

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
                        $scope.viewModel.purchaseOfBusinessOperations.isGrantDiscountEnquiry = val;
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
                        $scope.viewModel.purchaseOfBusinessOperations.isGrantDiscountEnquiry = false;
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
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                        { key: '废标原因', attributeName: 'purchaseBase.abandonBiddingReason', validator: new stringMaxLengthValidator(4000, "不能大于4000个字符!") }
                    ]);

                    if (!$scope.viewModel.purchaseOfBusinessOperations.isAbandonBidding) {
                        if ($scope.viewModel.purchaseOfBusinessOperations.isGrantDiscountEnquiry == null) {
                            modelStateDictionary.addModelError('是否发放让利询价', '不能为空！');
                        }
                    }
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
                    } else {
                        defer.resolve(getCleanModel());
                    }
                };

                // 刷新流程
                $scope.refreshProcess = function () {
                    var param = {};
                    if ($scope.viewModel.purchaseOfBusinessOperations.isAbandonBidding !== true) {
                        param.IsAbandonBidding = false;
                        param.IsGrantDiscountEnquiry = $scope.viewModel.purchaseOfBusinessOperations.isGrantDiscountEnquiry;
                    }
                    else {
                        param.IsAbandonBidding = $scope.viewModel.purchaseOfBusinessOperations.isAbandonBidding;
                        param.IsGrantDiscountEnquiry = false;
                    }
                    if (param) {
                        wfOperate.refreshProcess('/BiddingBusinessOperationsEvaluateSummaryWf', $scope.currentActivityId, null, param, true);
                    }
                };

                $rootScope.$on("$processRefreshed", function (event, data) {
                    rcTools.setOpinionOpts(data.opinionOpts.options);
                    rcTools.setProcessNavigator(data.processNavigator);
                });

                $scope.baseInfo.init();
            }
        );
    });