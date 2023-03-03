define([
    'app',
    'biddingSynthesizeExtend',
    'dateTimePickerExtend'
], function (app) {
    app.controller('biddingProjectDefineOpenTender_controller', [
        '$scope', '$http', 'wfOperate', 'viewData', 'wfWaiting', 'sogModal', 'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', '$filter',
        function ($scope, $http, wfOperate, viewData, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, $filter) {
            angular.extend($scope, viewData);
            //流程标题
            $scope.mainTitle = '采购管理';
            $scope.title = "招投标(项目定义服务类)";
            //设置导航栏按钮状态
            $scope.wfOperateOpts.allowCirculate = false;//传阅
            $scope.wfOperateOpts.allowDoAbort = false;//作废
            $scope.wfOperateOpts.allowRejection = false;//退回
            $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
            $scope.wfOperateOpts.allowPrint = false;//打印
            $scope.wfOperateOpts.allowComment = false;//评论
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底
            if ($scope.viewModel.hideRejectionButton)
                $scope.wfOperateOpts.allowRejection = false;//退回
            // 基本信息
            $scope.baseInfo = {
                // 更新最新回标截止时间
                updateReplyDeadline: function () {
                    wfWaiting.show();
                    var lastTime = new Date($scope.viewModel.purchaseOfProjectDefine.lastReplyDeadline);
                    var nowDate = new Date();
                    if (lastTime) {
                        if (lastTime < nowDate) {
                            sogModal.openAlertDialog("提示", "最新回标截止时间不能小于当前时间");
                            wfWaiting.hide();
                            return;
                        }
                        $http.get(seagull2Url.getPlatformUrl("/BiddingProjectDefine/UpdateLastReplyDeadline?resourceID=" +
                            $scope.viewModel.resourceID +
                            "&lastReplyDeadline=" +
                            $scope.viewModel.purchaseOfProjectDefine.lastReplyDeadline.replace('T', ' ')))
                            .success(function () {
                                wfWaiting.hide();
                                sogModal.openAlertDialog('提示', "最新回标截止时间修改成功！");
                            })
                    } else {
                        sogModal.openAlertDialog("提示", "最新回标截止时间不能为空");
                    }
                },
                //发起修改时间流程
                editpurchaseDatearrange: function () {
                    wfWaiting.show();
                    $http.get(seagull2Url.getPlatformUrl("/BiddingProjectDefine/AdjustBiddingDataArrange?resourceID=" +
                        $scope.viewModel.resourceID +
                        "&isAdjustBiddingDataArrange=true"))
                        .success(function () {
                            $scope.viewModel.purchaseOfProjectDefine.isAdjustBiddingDataArrange = true;
                            wfWaiting.hide();
                            var t_link = "default.htm?processDescKey=ReimbursementV2_ModifyPurchaseTime&parentResourceID=" + $scope.viewModel.resourceID + "&purchaseActivityID=" + viewData.currentActivityId + "&urlPart=biddingProjectDefineOpenTender" + "#/modifyPurchaseTime/";
                            window.open(t_link, self);
                        }).error(function (data, status) {
                            if (data) {
                                sogModal.openAlertDialog(status, data.message);
                            } else {
                                sogModal.openAlertDialog("提示", "发起修改时间流程错误");
                            }
                            wfWaiting.hide();
                        });
                },
                //废标
                cancelTender: function () {
                    $scope.refreshProcess();
                },
            }
            //数据有效性的检验
            var validData = function () {
                var RequiredValidator = ValidateHelper.getValidator("Required");
                sogValidator.clear();
                var modelStateDictionary = ValidateHelper.validateData($scope.viewModel, [
                    {
                        Key: '', attributeName: '', validator: new RequiredValidator('')
                    }]);
                //如果废标，还得更新废标理由
                if ($scope.viewModel.purchaseOfProjectDefine.isAbandonBidding) {
                    if (!$scope.viewModel.purchaseOfProjectDefine.abandonBiddingReason) {
                        modelStateDictionary.addModelError("废标", "废标原因不能为空");
                    }
                }
                else {
                    var replyRound = 0;
                    angular.forEach($scope.viewModel.supplierScopeList, function (v, i) {
                        if (v.isReplyBidding) {
                            replyRound++;
                        }
                    });
                    if (replyRound < 3)
                        modelStateDictionary.addModelError("回标供应商个数", "回标供应商个数不能小于3家");
                }

                if (!modelStateDictionary.isValid()) {
                    sogModal.openDialogForModelStateDictionary('信息校验失败', modelStateDictionary)
                    sogValidator.broadcastResult(modelStateDictionary.get());
                    return false;
                }
                return true;
            }
            //加载收集数据的名称
            $scope.collectData = function (e, defer) {
                if (e.operationType === sogWfControlOperationType.MoveTo) {
                    if (validData()) {
                        defer.resolve($scope.viewModel);
                    } else {
                        defer.reject($scope.viewModel);
                    }
                } else {
                    defer.resolve($scope.viewModel);
                }
            }
            // 刷新流程
            $scope.refreshProcess = function () {
                var param = {
                    IsAbandonBidding: $scope.viewModel.purchaseOfProjectDefine.isAbandonBidding,
                };
                if (param) {
                    wfOperate.refreshProcess('/BiddingProjectDefineOpenTenderWf', $scope.currentActivityId, null, param, true);
                }
            };
        }
    ]);
});