﻿define(
    [
        'app'
    ],
    function (app) {
        app.controller('businessOperationsApplicationReadOnly_controller', [
            '$scope', 'viewData', '$location', function ($scope, viewData, $location) {

                angular.extend($scope, viewData);
                viewData.wfOperateOpts.allowCirculate = false;//传阅
                viewData.wfOperateOpts.allowRejection = false;//退回
                viewData.wfOperateOpts.allowDoAbort = false;//作废
                viewData.wfOperateOpts.allowDoWithdraw = true;//撤回
                viewData.wfOperateOpts.allowPrint = false;//打印
                viewData.wfOperateOpts.allowSave = false;//保存
                viewData.wfOperateOpts.allowComment = false;  //评论
                viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底

                //流程标题
                $scope.mainTitle = '采购管理';
                $scope.title = '无合同采购（非开发运营类）';
                if ($scope.viewModel.isNonContractAdditional)
                    $scope.title = "无合同采购补录（非开发运营类）";
                $scope.isShowPayProcess = false;

                //基本信息
                $scope.baseInfo = {
                    opinionCount: 0,
                    costTargetAmountHeji: 0,
                    actualAmountHeji: 0,
                    accumulativeHappenedHeji: 0,
                    surplusValueWithTaxHeji: 0,
                    //总合计金额
                    amountChange: function () {
                        if ($scope.viewModel.contractAgreementScopeList != null && $scope.viewModel.contractAgreementScopeList.length > 0) {
                            angular.forEach($scope.viewModel.contractAgreementScopeList[0].contractAgreementSplitInfoList, function (splitInfo) {
                                if (splitInfo.isCanApportion) {
                                    splitInfo.surplusValueWithTax = splitInfo.costTargetAmount - splitInfo.actualAmount - splitInfo.accumulativeHappenedAmountWithTax;
                                    $scope.baseInfo.actualAmountHeji = $scope.baseInfo.actualAmountHeji + splitInfo.actualAmount;
                                }
                                $scope.baseInfo.costTargetAmountHeji += parseFloat(splitInfo.costTargetAmount);
                                $scope.baseInfo.accumulativeHappenedHeji += parseFloat(splitInfo.accumulativeHappenedAmountWithTax);
                                $scope.baseInfo.surplusValueWithTaxHeji += splitInfo.surplusValueWithTax;
                            });
                        }
                        if ($scope.baseInfo.actualAmountHeji) {
                            $scope.viewModel.purchaseBase.purchaseAmount = $scope.baseInfo.actualAmountHeji;
                        }
                    },
                };
                $scope.baseInfo.amountChange();
                $scope.collectData = function (e, defer) {
                    defer.resolve($scope.viewModel);
                };
            }]);
    });