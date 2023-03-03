define([
    'app',
    'biddingSynthesizeExtend',
    'dateTimePickerExtend',
], function (app) {
    app.controller('inquiryPriceMarketingOpenTender_controller', [
        '$scope', '$http', 'wfOperate', 'viewData', 'wfWaiting', 'sogModal', 'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator',
        function ($scope, $http, wfOperate, viewData, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator) {
            angular.extend($scope, viewData);
            //流程标题
            $scope.mainTitle = '采购管理';
            $scope.title = "询价(营销类)";
            //设置导航栏按钮状态
            $scope.wfOperateOpts.allowCirculate = false;//传阅
            $scope.wfOperateOpts.allowRejection = false;//退回
            $scope.wfOperateOpts.allowDoAbort = false;//作废
            $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
            $scope.wfOperateOpts.allowComment = false;  //评论
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//撤回                
            $scope.wfOperateOpts.allowPrint = false;//打印 
            //设置
            $scope.settings = {
                // 入围供应商
                supplierScopeOpts: {
                    'actionTypeCode': $scope.viewModel.formAction.actionTypeCode,
                    'scene': 'OpenTender'
                }
            }
            //基本信息
            $scope.baseInfo = {
                //更新最新回标截止时间
                updateReplyDeadline: function () {
                    wfWaiting.show();
                    var lastTime = new Date($scope.viewModel.purchaseOfMarketing.lastReplyDeadline);
                    var nowDate = new Date();
                    if (lastTime) {
                        if (lastTime < nowDate) {
                            sogModal.openAlertDialog("提示", "最新回标截止时间不能小于当前时间");
                            wfWaiting.hide();
                            return;
                        }
                        $http.get(seagull2Url.getPlatformUrl("/InquiryPriceMarketing/UpdateLastReplyDeadline?resourceID=" +
                            $scope.viewModel.resourceID +
                            "&lastReplyDeadline=" +
                            $scope.viewModel.purchaseOfMarketing.lastReplyDeadline.replace('T', ' ')))
                            .success(function () {
                                wfWaiting.hide();
                                sogModal.openAlertDialog("提示", "最新回标截止时间修改成功");
                            })
                    } else {
                        sogModal.openAlertDialog("提示", "最新回标截止时间不能为空");
                    }
                },
                //废标
                changeIsAbandonBidding: function () {
                    $scope.refreshProcess();
                },

            };
            //发送前数据校验
            var checkData = function () {
                var RequiredValidator = ValidateHelper.getValidator("Required");
                sogValidator.clear();
                var error = ValidateHelper.validateData($scope.viewModel, [
                    {
                        Key: '', attributeName: '', validator: new RequiredValidator('')
                    }]);
                //如果废标，还得更新废标理由
                if ($scope.viewModel.purchaseOfMarketing.isAbandonBidding) {
                    if (!$scope.viewModel.purchaseOfMarketing.abandonBiddingReason) {
                        error.addModelError("废标", "废标原因不能为空");
                    }
                }
                else {
                    var replyRound = 0;
                    angular.forEach($scope.viewModel.supplierScopeList, function (v, i) {
                        if (v.isReplyBidding) {
                            replyRound++;
                        }
                    });
                    if ($scope.viewModel.purchaseOfMarketing.marketingBudgetAmount <= 100000 && replyRound < 2)
                        error.addModelError("回标供应商个数", "回标供应商个数不能小于2家");
                    if ($scope.viewModel.purchaseOfMarketing.marketingBudgetAmount > 100000 && replyRound < 3)
                        error.addModelError("回标供应商个数", "回标供应商个数不能小于3家");
                }
                if (!error.isValid()) {
                    sogModal.openDialogForModelStateDictionary('信息校验失败', error)
                    sogValidator.broadcastResult(error.get());
                    return false;
                }
                return true;
            }
            //加载收集数据的名称
            $scope.collectData = function (e, defer) {
                if (e.operationType === sogWfControlOperationType.MoveTo) {
                    if (checkData(e)) {
                        return defer.resolve($scope.viewModel)
                    } else {
                        return defer.reject($scope.viewModel);
                    }
                } else if (e.operationType === sogWfControlOperationType.Save) {
                    return defer.resolve($scope.viewModel);
                }
                return defer.resolve($scope.viewModel);
            }
            // 刷新流程
            $scope.refreshProcess = function () {
                var param = {
                    IsAbandonBidding: !$scope.viewModel.purchaseOfMarketing.isAbandonBidding,
                };
                if (param) {
                    wfOperate.refreshProcess('/InquiryPriceMarketingOpenTenderWf', $scope.currentActivityId, null, param, true);
                }
            };
        }
    ]);
});