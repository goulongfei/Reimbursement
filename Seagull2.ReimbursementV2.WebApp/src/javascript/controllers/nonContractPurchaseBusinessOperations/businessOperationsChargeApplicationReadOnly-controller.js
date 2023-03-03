define(
    [
        'app',
        'corporationRadioSelector',
        'commonUtilExtend',
        'contractAgreementExtend',
    ],
    function (app) {
        app.controller('businessOperationsChargeApplicationReadOnly_controller', [
            '$scope', '$http', 'viewData', 'seagull2Url', 'configure', 'wfWaiting', 'sogModal', '$window',
            function ($scope, $http, viewData, seagull2Url, configure, wfWaiting, sogModal, $window) {
                angular.extend($scope, viewData);
                viewData.wfOperateOpts.allowCirculate = false;//传阅
                viewData.wfOperateOpts.allowRejection = false;//退回
                viewData.wfOperateOpts.allowDoAbort = false;//作废
                viewData.wfOperateOpts.allowDoWithdraw = false;//撤回
                viewData.wfOperateOpts.allowPrint = true;//打印
                viewData.wfOperateOpts.allowSave = false;//保存
                viewData.wfOperateOpts.allowComment = false;  //评论
                viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底

                //流程标题
                $scope.mainTitle = '采购管理';
                $scope.title = '无合同采购（非开发运营类）';
                $scope.isShowPayProcess = true;

                //基本信息
                $scope.baseInfo = {
                    costTargetAmountHeji: 0,
                    actualAmountHeji: 0,
                    accumulativeHappenedHeji: 0,
                    surplusValueWithTaxHeji: 0,
                    ChargeState: '',
                    //总合计金额
                    amountChange: function () {
                        angular.forEach($scope.viewModel.contractAgreementScopeList[0].contractAgreementSplitInfoList, function (splitInfo) {
                            if (splitInfo.isCanApportion) {
                                splitInfo.surplusValueWithTax = splitInfo.costTargetAmount - splitInfo.actualAmount - splitInfo.accumulativeHappenedAmountWithTax;
                                $scope.baseInfo.actualAmountHeji = $scope.baseInfo.actualAmountHeji + splitInfo.actualAmount;
                            }
                            $scope.baseInfo.costTargetAmountHeji += parseFloat(splitInfo.costTargetAmount);
                            $scope.baseInfo.accumulativeHappenedHeji += parseFloat(splitInfo.accumulativeHappenedAmountWithTax);
                            $scope.baseInfo.surplusValueWithTaxHeji += splitInfo.surplusValueWithTax;
                        });
                        if ($scope.baseInfo.actualAmountHeji) {
                            $scope.viewModel.purchaseBase.purchaseAmount = $scope.baseInfo.actualAmountHeji;
                        }
                    },
                    //查看支付进度页面
                    findChargeProcess: function () {
                        var url = $scope.viewModel.purchaseOfNoContract.paymentFormURL;
                        if (url == "") {
                            sogModal.openAlertDialog('提示', '当前支付流程已发起但并未进行操作，请稍后刷新查看!');
                        } else {
                            url += "&random=" + Math.random();
                            var config = {};
                            var RootUrl = configure.getConfig(config, 'common').webUrlBase;
                            if (typeof WebViewBridge == 'undefined') {
                                $window.open(RootUrl + url);
                            }
                            else {
                                WebViewBridge.send(JSON.stringify({ type: 'attachment', title: "无合同支付流程", url: RootUrl + url }));
                            }
                        }
                    },
                    //显示重新发起/查看按钮
                    isShowRestart: true,
                    //重新发起
                    reStartChargeProcess: function () {
                        wfWaiting.show();
                        var apiUrl = "/PurchaseOfNoContract/ReStartBusinessOperationsCharge?resourceID=" + $scope.viewModel.resourceID + "&rand=" + Math.random();

                        $http.post(seagull2Url.getPlatformUrl(apiUrl)).success(function (data) {
                            wfWaiting.hide();
                            sogModal.openAlertDialog("提示信息", "无合同采购支付流程发起成功,请尽快完成支付!");
                            $scope.baseInfo.isShowRestart = false;
                        }).error(function (data) {
                            sogModal.openAlertDialog("提示信息", "无合同采购支付流程发起失败,请稍后再试!");
                            $scope.baseInfo.isShowRestart = true;
                            wfWaiting.hide();
                            console.log(data);
                        });
                    }
                };
                $scope.baseInfo.amountChange();

                $scope.collectData = function (e, defer) {
                    defer.resolve($scope.viewModel);
                };
            }]);
    });


