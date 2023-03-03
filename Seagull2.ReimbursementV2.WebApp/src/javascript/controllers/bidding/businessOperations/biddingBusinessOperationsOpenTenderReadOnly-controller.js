﻿define(
    [
        'app',
        'biddingSynthesizeExtend',
        'leftNavExtend',
    ],
    function (app) {
        app.controller('biddingBusinessOperationsOpenTenderReadOnly_controller', function ($scope, viewData, wfWaiting, sogModal) {
            angular.extend($scope, viewData);
            //流程标题
            $scope.mainTitle = viewData.viewModel.purchaseBase.purchaseWayName;
            $scope.title = viewData.viewModel.formAction.actionTypeName;
            //设置导航栏按钮状态
            $scope.wfOperateOpts.allowCirculate = false;//传阅 
            $scope.wfOperateOpts.allowPrint = false;//打印
            $scope.wfOperateOpts.allowRejection = false;//退回 
            $scope.wfOperateOpts.allowDoAbort = false;//作废
            $scope.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底 
            $scope.wfOperateOpts.allowDoWithdraw = false;//撤回

            // 设置
            $scope.settings = { 
                //左侧导航栏
                leftNavListOpts: {
                    offset: 59.5,
                    fixed: 0,
                    delay: 2000,
                    resourceId: $scope.resourceId,
                    scene: "BiddingBusinessOperationsOpenTender",
                    activityInfoList: $scope.viewModel.processActivityInfoList,
                    isAbandonBidding: $scope.viewModel.purchaseOfBusinessOperations.isAbandonBidding,
                    isGrantDiscountEnquiry: $scope.viewModel.purchaseOfBusinessOperations.isGrantDiscountEnquiry,
                    actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                },
            };

            //加载收集数据的名称
            $scope.collectData = function (e, defer) {
                defer.resolve($scope.viewModel);
            };
        }
    );
});