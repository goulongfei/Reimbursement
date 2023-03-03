define(
    [
        'app',
        'leftNavExtend',
    ],
    function (app) {
        app.controller('biddingAssetsPurchaseGrantDiscountEnquiryReadOnly_controller', [
            '$scope', 'viewData', '$http', 'seagull2Url',
            function ($scope, viewData, $http, seagull2Url) {
                angular.extend($scope, viewData);
                //流程标题
                $scope.mainTitle = viewData.viewModel.purchaseBase.purchaseWayName;
                $scope.title = viewData.viewModel.formAction.actionTypeName;
                //设置导航栏按钮状态 
                viewData.wfOperateOpts.allowCirculate = true;//传阅
                viewData.wfOperateOpts.allowDoAbort = false;//作废 
                viewData.wfOperateOpts.allowRejection = false;//退回
                viewData.wfOperateOpts.allowDoWithdraw = false;//撤回
                viewData.wfOperateOpts.allowPrint = false;//打印 
                viewData.wfOperateOpts.allowDoWithdrawToAssignees = false;//一撤到底
                if (viewData.wfOperateOpts.sendButtonName == "已阅") {
                    viewData.wfOperateOpts.allowSave = false;//保存 
                }

                // 设置 
                $scope.settings = { 
                    //左侧导航栏
                    leftNavListOpts: {
                        offset: 59.5,
                        fixed: 0,
                        delay: 2000,
                        resourceId: $scope.resourceId,
                        scene: "GrantEnquiry",
                        activityInfoList: $scope.viewModel.processActivityInfoList,
                        isAbandonBidding: $scope.viewModel.purchaseOfFixedAssets.isAbandonBidding,
                        isGrantDiscountEnquiry: $scope.viewModel.purchaseOfFixedAssets.isGrantDiscountEnquiry,
                        actionTypeCode: $scope.viewModel.formAction.actionTypeCode,
                    },
                };

                //加载收集数据的名称
                $scope.collectData = function (e, defer) {
                    defer.resolve($scope.viewModel);
                };

            }]);
    });