define(
    [
        'app',
        'commonUtilExtend',
        'dateTimePickerExtend',
        'leftNavExtend',
    ],
    function (app) {
        app.controller('biddingAssetsPurchaseEvaluateSummary_controller', [
            '$scope', '$rootScope', 'wfOperate', 'viewData', 'sogModal',
            'sogWfControlOperationType', 'ValidateHelper', 'sogValidator', 'rcTools',
            function ($scope, $rootScope, wfOperate, viewData, sogModal, sogWfControlOperationType, ValidateHelper, sogValidator, rcTools) {
                angular.extend($scope, viewData);
                //流程标题
                $scope.mainTitle = viewData.viewModel.purchaseBase.purchaseWayName;
                $scope.title = viewData.viewModel.formAction.actionTypeName;

                viewData.wfOperateOpts.allowComment = true; //评论
                viewData.wfOperateOpts.allowCirculate = true;//传阅
                viewData.wfOperateOpts.allowDoAbort = false;//作废 
                viewData.wfOperateOpts.allowRejection = false;//退回
                viewData.wfOperateOpts.allowDoWithdraw = false;//撤回
                viewData.wfOperateOpts.allowPrint = false;//打印
                viewData.wfOperateOpts.allowSave = true;//保存
                viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底

                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                    viewData.wfOperateOpts.allowRejection = false;//退回
                    viewData.wfOperateOpts.allowCirculate = false;//传阅
                    viewData.wfOperateOpts.allowSave = false;//保存
                    viewData.wfOperateOpts.allowComment = true; //评论
                }

                // 设置 
                $scope.settings = {
                    // 附件设置项
                    fileOpts: {
                        'auto': true,
                        'preview': false,
                        'fileNumLimit': 0
                    },
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 2000,
                        resourceId: $scope.resourceId,
                        scene: "EvaluateTenderSummary",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfFixedAssets.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfFixedAssets.isGrantDiscountEnquiry,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                    },
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
                        $scope.viewModel.purchaseOfFixedAssets.isGrantDiscountEnquiry = val;
                        if (val === true) {
                            $scope.wfOperateOpts.transitionKey = $scope.viewModel.toProfitSharingTransitionKey;
                        }
                        else {
                            $scope.wfOperateOpts.transitionKey = $scope.viewModel.toAwardTransitionKey;
                        }
                        $rootScope.$broadcast('$processRefreshed', $scope);
                        $scope.refreshProcess();
                    },
                };

                //验证
                var validData = function () {
                    var RequiredValidator = ValidateHelper.getValidator('Required');
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, []);

                    if (!$scope.viewModel.isInvalidTender && !$scope.viewModel.purchaseOfFixedAssets.isAbandonBidding) {
                        if ($scope.viewModel.purchaseOfFixedAssets.isGrantDiscountEnquiry == null) {
                            modelStateDictionary.addModelError('是否发放让利询价', '请选择！');
                        }
                    }
                    return modelStateDictionary;
                };
                // 保存验证
                var saveValidData = function () {
                    var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, []);
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
                    if ($scope.viewModel.purchaseOfFixedAssets.isAbandonBidding !== true) {
                        param.IsAbandonBidding = false;
                        param.IsGrantDiscountEnquiry = $scope.viewModel.purchaseOfFixedAssets.isGrantDiscountEnquiry;
                    }
                    else {
                        param.IsAbandonBidding = $scope.viewModel.purchaseOfFixedAssets.isAbandonBidding;
                        param.IsGrantDiscountEnquiry = false;
                    }
                    if (param) {
                        wfOperate.refreshProcess('/BiddingAssetsPurchaseEvaluteSummaryWf', $scope.currentActivityId, null, param, true);
                    }
                };

                $rootScope.$on("$processRefreshed", function (event, data) {
                    rcTools.setOpinionOpts(data.opinionOpts.options);
                    rcTools.setProcessNavigator(data.processNavigator);
                });

                $scope.baseInfo.init();

            }]);
    });

