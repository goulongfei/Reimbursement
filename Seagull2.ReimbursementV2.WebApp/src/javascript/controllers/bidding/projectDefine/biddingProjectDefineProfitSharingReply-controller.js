define([
    'app',
    'biddingSynthesizeExtend'
], function (app) {
    app.controller('biddingProjectDefineProfitSharingReply_controller', [
        '$scope', '$rootScope', '$http', 'viewData', 'wfWaiting', 'sogModal', 'sogWfControlOperationType', 'seagull2Url',
        function ($scope, $rootScope, $http, viewData, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url) {
            angular.extend($scope, viewData);
            $scope.wfOperateOpts.transitionKey = $scope.viewModel.toEvaluateTransitionKey;
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
            //基本信息
            $scope.baseInfo = {
                // 撤回评标汇总
                returnToEvaluateSummary: function () {
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
                //放弃回复
                giveUpReply: function (grantDiscountEnquiryCode) {
                    var promise = sogModal.openConfirmDialog("提示", "点击后，供应商无法参与此次让利，是否确认该供应商放弃回复？");
                    promise.then(function (v) {
                        wfWaiting.show();

                        $http.get(seagull2Url.getPlatformUrl('/BiddingProjectDefine/GrantDiscountEnquiryGiveUpReply?grantDiscountEnquiryCode=' + grantDiscountEnquiryCode), {
                            cache: false
                        }).success(function (response) {
                            angular.forEach($scope.viewModel.grantDiscountEnquiryInfoList, function (item) {
                                if (item.code == grantDiscountEnquiryCode) {
                                    item.replyStateCode = 3;
                                    item.replyStateName = "放弃回复";
                                }
                            });
                            wfWaiting.hide();
                        }).error(function (data, status) {
                            if (data) {
                                sogModal.openAlertDialog(status, data.message);
                            } else {
                                sogModal.openAlertDialog("提示", "放弃回复错误");
                            }
                            wfWaiting.hide();
                        });
                    }, function (v) {
                        $scope.msg = "点击了取消" + v;
                        wfWaiting.hide();
                    });
                }
            };
            //加载收集数据的名称
            $scope.collectData = function (e, defer) {
                if (e.operationType === sogWfControlOperationType.MoveTo) {
                    defer.resolve($scope.viewModel);
                }
                return defer.resolve($scope.viewModel);
            }
        }
    ]);
});