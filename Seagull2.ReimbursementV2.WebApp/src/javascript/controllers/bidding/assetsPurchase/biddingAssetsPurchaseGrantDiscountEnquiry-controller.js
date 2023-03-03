define(
    [
        'app',
        'commonUtilExtend',
        'dateTimePickerExtend',
        'leftNavExtend',
    ],
    function (app) {
        app.controller('biddingAssetsPurchaseGrantDiscountEnquiry_controller', [
            '$scope', '$rootScope', 'wfOperate', 'viewData', 'sogModal',
            'sogWfControlOperationType', 'ValidateHelper', 'sogValidator', 'rcTools', 'wfWaiting', '$http','seagull2Url',
            function ($scope, $rootScope, wfOperate, viewData, sogModal, sogWfControlOperationType, ValidateHelper, sogValidator, rcTools, wfWaiting, $http, seagull2Url) {
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
                        scene: "GrantEnquiry",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfFixedAssets.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfFixedAssets.isGrantDiscountEnquiry,
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
                    urlAbandonProfitSharingReply: function (param) {
                        return seagull2Url.getPlatformUrl('/BiddingAssetsPurchase/abandonProfitSharingReply?r=' + Math.random());
                    },
                    // 延长提问截止时间
                    abandonProfitSharingReply: function (param, done) {
                        $http({
                            method: 'POST',
                            url: $scope.api.urlAbandonProfitSharingReply(param),
                            data: param,
                        })
                            .success(function (data) {
                                done(data);
                            })
                            .error($scope.api.showErrorMessage);
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
                    // 撤回评标汇总
                    returnToEvaluateSummary: function () {
                        if (!$scope.viewModel.toEvaluateSummaryTransitionKey
                            || !$scope.viewModel.toEvaluateTransitionKey) { return; }
                        if ($scope.viewModel.isCancelEvaluate) {
                            var responseData = $scope;
                            responseData.wfOperateOpts.transitionKey = $scope.viewModel.toEvaluateSummaryTransitionKey;
                            $rootScope.$broadcast('$processRefreshed', responseData);
                        }
                        else {
                            var responseData = $scope;
                            responseData.wfOperateOpts.transitionKey = $scope.viewModel.toEvaluateTransitionKey;
                            $rootScope.$broadcast('$processRefreshed', responseData);
                        }
                    },
                    // 放弃回复
                    abandonProfitSharingReply: function (item) {
                        var param = {
                            resourceId: $scope.resourceId,
                            bidGrantDiscountEnquiryInfoCode: item.code,
                        }
                        var promise = sogModal.openConfirmDialog("提示", "点击后，供应商无法参与此次让利，是否确认该供应商放弃回复？");
                        promise.then(function (v) {
                            wfWaiting.show();
                            $scope.api.abandonProfitSharingReply(param, function (data) {
                                if ($scope.api.showErrorMessage != "") {
                                    item.isNeedBidProfitSharingReply = false;
                                    item.replyStateCode = data.grantDiscountEnquiryInfo.replyStateCode;
                                    item.replyStateName = data.grantDiscountEnquiryInfo.replyStateName;
                                    item.replyDate = data.grantDiscountEnquiryInfo.replyDate;
                                    wfWaiting.hide();
                                    sogModal.openAlertDialog('提示', "放弃回复操作成功！");
                                } else {
                                    wfWaiting.hide();
                                    console.log(data.errorStr);
                                    sogModal.openAlertDialog('提示', "放弃回复操作失败，请稍后再试！");
                                }
                            });
                        }, function (v) {
                            $scope.msg = "点击了取消" + v;
                            wfWaiting.hide();
                        });
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
                    $scope.baseInfo.returnToEvaluateSummary();
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

