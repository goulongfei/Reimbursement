define([
    'app',
    'biddingSynthesizeExtend',
    'dateTimePickerExtend',
], function (app) {
    app.controller('inquiryPriceMarketingEvaluateGrant_controller', [
        '$scope', 'wfOperate', 'viewData', 'sogModal',
        'sogWfControlOperationType', 'ValidateHelper', 'sogValidator',
        function ($scope, wfOperate, viewData, sogModal, sogWfControlOperationType, ValidateHelper, sogValidator) {
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
                sendDiscountTypeList: [{ key: '发放让利', value: true }, { key: '不发放让利', value: false }],
                changeSendDiscountType: function () {
                    var IsGrantDiscountEnquiry = false;
                    angular.forEach($scope.viewModel.grantDiscountEnquiryInfoList, function (info, index) {
                        if (info.isSendDiscount) {
                            IsGrantDiscountEnquiry = true
                        }
                    });
                    if ($scope.viewModel.purchaseOfMarketing.isGrantDiscountEnquiry != IsGrantDiscountEnquiry) {
                        $scope.viewModel.purchaseOfMarketing.isGrantDiscountEnquiry = IsGrantDiscountEnquiry;
                        $scope.refreshProcess();
                    }
                }
            };
            //发送前数据校验
            var checkData = function () {
                var RequiredValidator = ValidateHelper.getValidator("Required");
                var error = ValidateHelper.validateData($scope.viewModel, [
                    {
                        Key: '', attributeName: '', validator: new RequiredValidator('')
                    }]);
                angular.forEach($scope.viewModel.grantDiscountEnquiryInfoList, function (info, index) {
                    index = index + 1;
                    if (info.isNeedBidProfitSharingReply && info.isSendDiscount == null) {
                        error.addModelError("第" + index + "行供应商", "发放让利必须选择");
                    }
                });
                if ($scope.viewModel.purchaseOfMarketing.isGrantDiscountEnquiry) {
                    if (!$scope.viewModel.purchaseOfMarketing.discountDeadline) {
                        error.addModelError("让利回复截止时间", "时间不能为空");
                    } else {
                        var lastTime = new Date($scope.viewModel.purchaseOfMarketing.discountDeadline);
                        var nowDate = new Date();
                        if (lastTime < nowDate) {
                            error.addModelError("让利回复截止时间", "不能小于当前时间");
                        }
                    }
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
                sogValidator.clear();
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
                    IsGrantDiscountEnquiry: $scope.viewModel.purchaseOfMarketing.isGrantDiscountEnquiry,
                };
                if (param) {
                    wfOperate.refreshProcess('/InquiryPriceMarketingEvaluateGrantWf', $scope.currentActivityId, null, param, true);
                }
            };
        }
    ]);
});