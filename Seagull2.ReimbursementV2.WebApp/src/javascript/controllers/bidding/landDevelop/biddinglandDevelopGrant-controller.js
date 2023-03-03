define(
    [
        'app',
        'commonUtilExtend',
        'biddingSynthesizeExtend',
        'engineeringExtend',
        'leftNavExtend'
    ],
    function (app) {
        app.controller('biddinglandDevelopGrantDiscountEnquiry_controller', [
            '$scope', '$rootScope', '$http', '$state', '$stateParams', 'uploader', 'wfOperate', 'viewData', '$timeout', 'wfWaiting', 'sogModal',
             'sogWfControlOperationType', 'seagull2Url', 'ValidateHelper', 'sogValidator', 'sogOguType', '$filter', 'errorDialog',
            function ($scope, $rootScope, $http, $state, $stateParams, uploader, wfOperate, viewData, $timeout, wfWaiting, sogModal, sogWfControlOperationType, seagull2Url, ValidateHelper, sogValidator, sogOguType, $filter, errorDialog) {
                angular.extend($scope, viewData);
                $scope.wfOperateOpts.transitionKey = $scope.viewModel.toEvaluateTransitionKey;
                $scope.mainTitle = '采购管理';
                $scope.title = "招投标(土地开发类)";

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

                if (new Date() >= new Date(Date.parse($scope.viewModel.purchaseOfLandDevelop.discountDeadline))) {
                    $scope.isAbortNoReply = true;
                } else {
                    $scope.isAbortNoReply = false;
                }

                //基本信息
                $scope.baseInfo = {
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 1000,
                        resourceId: $scope.resourceId,
                        scene: 'GrantEnquiry',
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfLandDevelop.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfLandDevelop.isGrantDiscountEnquiry,
                    },
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
                    //查找商务评标信息
                    getBusinessEvaluateBiddingInfo: function (supplier) {
                        var amount = 0;
                        for (var i = 0; i < $scope.viewModel.supplierReplyBiddingInfoForGrantSubmitList.length; i++) {
                            if ($scope.viewModel.supplierReplyBiddingInfoForGrantSubmitList[i].supplierCode == supplier.supplierCode
                                && $scope.viewModel.supplierReplyBiddingInfoForGrantSubmitList[i].round == $scope.viewModel.purchaseOfLandDevelop.evaluateBiddingTimes - 1) {
                                amount = $scope.viewModel.supplierReplyBiddingInfoForGrantSubmitList[i].afterDiscountAmount;
                                break;
                            }
                        }
                        if (amount == 0) {
                            amount = supplier.totalAmountWithTax;
                        }
                        return amount;
                    },
                    //放弃回复
                    giveUpReply: function (grantDiscountEnquiryCode) {
                        var promise = sogModal.openConfirmDialog("提示", "点击后，供应商无法参与此次让利，是否确认该供应商放弃回复？");
                        promise.then(function (v) {
                            wfWaiting.show();

                            $http.get(seagull2Url.getPlatformUrl('/BiddingLandDevelop/GrantDiscountEnquiryGiveUpReply?grantDiscountEnquiryCode=' + grantDiscountEnquiryCode), {
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
            }]);
    });