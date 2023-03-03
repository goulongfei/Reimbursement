define(
    [
        'app',
        'commonUtilExtend',
        'leftNavExtend',
        'dateTimePickerExtend',
    ],
    function (app) {
        app.controller('biddingBusinessOperationsProfitSharingReply_controller',
            function ($scope, viewData, $http, seagull2Url, wfWaiting, sogModal, ValidateHelper, sogValidator, rcTools,
                sogWfControlOperationType, $rootScope, wfOperate) {

                angular.extend($scope, viewData);
                $scope.wfOperateOpts.transitionKey = $scope.viewModel.toEvaluateTransitionKey;
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
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 2000,
                        resourceId: $scope.resourceId,
                        scene: "BiddingBusinessOperationsProfitSharingReply",
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
                        return seagull2Url.getPlatformUrl('/BiddingBusinessOperations/AbandonProfitSharingReply?r=' + Math.random());
                    },
                    // 放弃回复
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
                    // 撤回评标汇总
                    returnToEvaluateSummary: function () {
                        if (!$scope.viewModel.toEvaluateSummaryTransitionKey
                            || !$scope.viewModel.toEvaluateTransitionKey ) { return; }
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
                };

                //验证
                var validData = function () {
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
                    } else {
                        defer.resolve(getCleanModel());
                    }
                };
            }
        );
    });