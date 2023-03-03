﻿define([
    'app',
    'comparePriceSynthesizeExtend'
], function (app) {
    app.controller('comparePricePurchaseApproval_controller', [
        '$scope', 'viewData',
        function ($scope, viewData) {
            angular.extend($scope, viewData);
            //流程标题
            $scope.mainTitle = '采购管理';
            $scope.title = "比价采购";
            //设置导航栏按钮状态 
            $scope.wfOperateOpts.allowCirculate = false;//传阅
            $scope.wfOperateOpts.allowDoAbort = false;//作废 
            $scope.wfOperateOpts.allowRejection = false;//退回
            $scope.wfOperateOpts.allowDoWithdraw = false;//撤回
            $scope.wfOperateOpts.allowPrint = false;//打印
            $scope.wfOperateOpts.allowComment = false;//评论
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底
            //设置
            $scope.settings = {
                // 入围供应商
                supplierScopeOpts: {
                    scene: "Approval"
                },
                // 拟定中标供应商
                signContractOpts: {
                    scene: 'Approval',
                    isSignContract: $scope.viewModel.purchaseOfComparePrice.isSignContract
                }
            }
            //加载收集数据的名称
            $scope.collectData = function (e, defer) {
                defer.resolve($scope.viewModel);
            };
        }
    ]);
});

