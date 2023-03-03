define([
    'app',
    'biddingSynthesizeExtend',
    'dateTimePickerExtend'
], function (app) {
    app.controller('inquiryPriceMarketingProfitSharingReply_controller', [
        '$scope', '$http', 'viewData', 'wfWaiting', 'sogModal', 'seagull2Url',
        function ($scope, $http, viewData, wfWaiting, sogModal, seagull2Url) {
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
            //基本信息
            $scope.baseInfo = {
                //放弃回复
                giveUpReply: function (grantDiscountEnquiryCode) {
                    var promise = sogModal.openConfirmDialog("提示", "点击后，供应商无法参与此次让利，是否确认该供应商放弃回复？");
                    promise.then(function (v) {
                        wfWaiting.show();
                        $http.get(seagull2Url.getPlatformUrl('/InquiryPriceMarketing/GrantDiscountEnquiryGiveUpReply?grantDiscountEnquiryCode=' + grantDiscountEnquiryCode), {
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
                },
                //更新最新让利截止时间
                updateGrantReplyDeadline: function () {
                    var lastTime = new Date($scope.viewModel.purchaseOfMarketing.discountDeadline);
                    var nowDate = new Date();
                    if (lastTime) {
                        if (lastTime < nowDate) {
                            sogModal.openAlertDialog("提示", "让利截止时间不能小于当前时间");
                            return;
                        }
                        $http.get(seagull2Url.getPlatformUrl("/InquiryPriceMarketing/UpdateDiscountDeadline?resourceID=" +
                            $scope.viewModel.resourceID +
                            "&discountDeadline=" +
                            $scope.viewModel.purchaseOfMarketing.discountDeadline.replace('T', ' ')))
                            .success(function () {
                                var promise = sogModal.openAlertDialog("提示", "让利截止时间修改成功");
                                promise.then(function (result) {
                                    //location.reload();
                                }, function (rejectData) {
                                    //location.reload();
                                });
                            })
                    } else {
                        sogModal.openAlertDialog("提示", "让利截止时间不能为空");
                    }
                }
            };
            //加载收集数据的名称
            $scope.collectData = function (e, defer) {
                return defer.resolve($scope.viewModel);
            }
        }
    ]);
});